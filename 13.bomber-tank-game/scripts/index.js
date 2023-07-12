"use strict";

const mainTitle = document.querySelector(".title");
const tutorialSection = document.getElementById("tutorial-section");
const tutorialText = document.getElementById("tutorial-text");
const tutorialBtn = document.getElementById("tutorial-btn");
const levelSection = document.querySelector(".level-section");
const levelBtns = document.querySelectorAll(".level-btn");
const gameBoard = document.getElementById("game-board");
const resultsDisplay = document.getElementById("results");

const width = 15; // Number of cells in each row and column
const cellSize = 2.5; // Size of each cell in 'rem' unit
const allCells = width * width; // Number of all cells in the gameboard
let scores = 0; // A variable to hold the game score
let currentTankIndex; // An index in a row to place the tank
let direction = 1; // Enemy's movement direction (1 for moving to the right and -1 for left)
let isGoingRight = true; // Enemies movement direction
let enemyInterval; // This variable will be used to clear the interval effect

// A class to build sound objects
class Sound {
	constructor(src, isLooped = false) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.loop = isLooped;
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
	}
	playSound() {
		this.sound.play();
	}
	stopSound() {
		this.sound.pause();
	}
}

// Build objects from the Sound class with a proper sound source for different parts of the game
const backgroundSound = new Sound("static/sounds/bgSound.mp3", true);
const startSound = new Sound("static/sounds/start.mp3");
const enemiesSound = new Sound("static/sounds/enemyMove.mp3");
const shootSound = new Sound("static/sounds/shoot.mp3");
const explodeSound = new Sound("static/sounds/explode.mp3");
const winSound = new Sound("static/sounds/win.mp3");
const gameOverSound = new Sound("static/sounds/gameOver.mp3");

// An array of starting index positions for enemies (three rows of enemies)
const startEnemyPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];
let currentEnemyPositions = [...startEnemyPositions];
let currentEnemyPositionsLength = currentEnemyPositions.length; // total 30
let enemyRemovedPositions = []; // Removed enemies index will push to this array

tutorialText.innerText = `Tutorial:
	1- Select a level for the game.
	2- Use the keyboard up arrow ↑ to shoot.
	3- Use the keyboard ← or → to move the Tank.`;

// All the level buttons are disabled when the tutorial modal is showing
for (const btn of levelBtns) {
	btn.disabled = true;
	btn.style.cursor = "not-allowed";
}

// Set the size to gameboard and fill it with div elements (total number of divs is 15*15=225)
gameBoard.style.width = `${width * cellSize}rem`;
gameBoard.style.height = `${width * cellSize}rem`;
for (let i = 0; i < allCells; i++) {
	const div = document.createElement("div");

	div.style.width = `${cellSize}rem`;
	div.style.height = `${cellSize}rem`;
	div.style.backgroundSize = `${cellSize}rem ${cellSize}rem`;

	gameBoard.appendChild(div);
}

// Making an array of divs (using the spread operator)
const cells = [...document.querySelectorAll(".game-board div")];

// Adding enemy's starting positions to selected cells (selected index)
for (let i = 0; i < currentEnemyPositionsLength; i++) {
	cells[currentEnemyPositions[i]].classList.add("enemy");
}

// This function handles the tank's movement to the left/right with arrows on the keyboard
function moveTank(event) {
	switch (event.key) {
		case "ArrowLeft":
			// Check if the tank has an empty cell on the left side to move
			if (currentTankIndex % width !== 0) {
				cells[currentTankIndex].classList.remove("tank"); // Remove the tank from current cell
				cells[--currentTankIndex].classList.add("tank"); // Add the tank to this cell
			}
			break;

		case "ArrowRight":
			// Check if the tank has an empty cell on the right side to move
			if (currentTankIndex % width < width - 1) {
				cells[currentTankIndex].classList.remove("tank"); // Remove the tank from current cell
				cells[++currentTankIndex].classList.add("tank"); // Add the tank to this cell
			}
			break;
	}
}

// This function handles shooting bullets
function shoot(event) {
	// A shoot and sound will be happend when the up arrow of the keyboard press
	if (event.key === "ArrowUp") {
		let currentBulletIndex = currentTankIndex;
		const bulletInterval = setInterval(moveBullet, 100); // The bullet position will be updated each 100 ms

		shootSound.playSound();

		// This function updates the tank's bullet index from bottom of the gameboard to top
		function moveBullet() {
			cells[currentBulletIndex].classList.remove("bullet");
			currentBulletIndex -= width; // The bullet's position moves up one row

			if (currentBulletIndex < 0) {
				clearInterval(bulletInterval); // When the bullet reached to the top of the gameboard it will be stop
			} else {
				cells[currentBulletIndex].classList.add("bullet");

				// When the bullet hits an enemy this block will be executed
				if (cells[currentBulletIndex].classList.value === "enemy bullet") {
					cells[currentBulletIndex].classList.remove("bullet"); // Remove bullet effect
					cells[currentBulletIndex].classList.remove("enemy"); // Remove enemy effect
					cells[currentBulletIndex].classList.add("explosion"); // Add an explode effect

					explodeSound.playSound();

					// Removing explode effect after 200 ms and cleaning the cell
					setTimeout(() => cells[currentBulletIndex].classList.remove("explosion"), 200);

					clearInterval(bulletInterval); // Clearing the interval after the explosion

					enemyRemovedPositions.push(currentEnemyPositions.indexOf(currentBulletIndex));

					scores++;

					resultsDisplay.innerHTML = `Score: ${scores}/${startEnemyPositions.length}`;

					// End of the game when all enemies were removed
					if (scores === startEnemyPositions.length) {
						resultsDisplay.innerHTML = `<span style="color: lightgreen">"YOU WON!"</span>`;

						winSound.playSound();

						clearInterval(enemyInterval); // Stop the movement of enemies

						// The keyboard will be disabled
						document.removeEventListener("keydown", moveTank);
						document.removeEventListener("keydown", shoot);
					}
				}
			}
		}
	}
}

// This function handles the enemy's movements
function moveEnemies() {
	const isOnLeftEdge = currentEnemyPositions[0] % width === 0;
	const isOnRightEdge = currentEnemyPositions[currentEnemyPositionsLength - 1] % width === width - 1;

	// This loop hides removed enemies
	for (let i = 0; i < currentEnemyPositionsLength; i++) {
		if (!enemyRemovedPositions.includes(i)) {
			cells[currentEnemyPositions[i]].classList.remove("enemy");
		}
	}

	// Changing movement direction (from right to left) depends on the enemy's position
	if (isOnRightEdge && isGoingRight) {
		enemiesSound.playSound();

		// All the enemy's position moves down one row
		for (let i = 0; i < currentEnemyPositionsLength; i++) {
			currentEnemyPositions[i] += width + 1;
			direction = -1;
			isGoingRight = false;
		}
	} else if (isOnLeftEdge && !isGoingRight) {
		enemiesSound.playSound();

		// All the enemy's position moves down one row
		for (let i = 0; i < currentEnemyPositionsLength; i++) {
			currentEnemyPositions[i] += width - 1;
			direction = 1;
			isGoingRight = true;
		}
	}

	// Changing the enemy's current cell index one by one (to the right or the left depends on direction value)
	for (let i = 0; i < currentEnemyPositionsLength; i++) {
		currentEnemyPositions[i] += direction;
	}

	// When the enemies reached to the down of the gameboard the game will be over
	for (let i = 0; i < currentEnemyPositionsLength; i++) {
		if (!enemyRemovedPositions.includes(i)) {
			// The last allowed index of cells that enemies can be there (one row up tank's row)
			if (currentEnemyPositions[i] >= allCells - width) {
				resultsDisplay.innerHTML = `<span style="color: red">"GAME OVER!"</span>`;

				gameOverSound.playSound();

				clearInterval(enemyInterval); // Stop enemies movement

				// The keyboard will be disable
				document.removeEventListener("keydown", moveTank);
				document.removeEventListener("keydown", shoot);
			}

			cells[currentEnemyPositions[i]].classList.add("enemy");
		}
	}

	// When an enemy hits the tank the game will be over
	if (cells[currentTankIndex].classList.value === "tank enemy") {
		resultsDisplay.innerHTML = `<span style="color: red">"GAME OVER!"</span>`;

		gameOverSound.playSound();

		clearInterval(enemyInterval); // Stop enemies movement

		cells[currentTankIndex].classList.add("explosion"); // tank exploded effect

		// The keyboard will be disabled
		document.removeEventListener("keydown", moveTank);
		document.removeEventListener("keydown", shoot);
	}
}

// This function starts a new game with default values (a kind of restart function)
function gameStarter(level) {
	scores = 0;
	resultsDisplay.innerHTML = `Score: ${scores}/${startEnemyPositions.length}`;
	currentTankIndex = Math.pow(width, 2) - Math.ceil(width / 2); // The center cell of the last row
	direction = 1;
	isGoingRight = true;
	clearInterval(enemyInterval);
	currentEnemyPositions = [...startEnemyPositions];
	currentEnemyPositionsLength = currentEnemyPositions.length;
	enemyRemovedPositions.splice(0);

	// Remove all effects from the gameboard
	for (let i = 0; i < allCells; i++) {
		cells[i].classList.remove("enemy", "tank", "bullet", "explosion");
	}

	// Adding the enemy's starting positions to selected cells (selected index)
	for (let i = 0; i < currentEnemyPositionsLength; i++) {
		cells[currentEnemyPositions[i]].classList.add("enemy");
	}

	// Adding the tank to the bottom of the gameboard
	cells[currentTankIndex].classList.add("tank");

	// This interval updates the position of enemies depending on the game level
	enemyInterval = setInterval(moveEnemies, level);
}

// Setting the default values and starting the game
tutorialBtn.addEventListener("click", () => {
	tutorialSection.style.display = "none";

	// Set a timer for each game-level button from easy to hard (depending on the default time)
	let defaultTime = 1000;

	// All the level-buttons will be enabled after that tutorial modal was closed
	for (const btn of levelBtns) {
		btn.disabled = false;
		btn.style.cursor = "pointer";
	}

	for (const btn of levelBtns) {
		eventListenerHandler(btn, defaultTime); // Set a listener to the level button with proper time

		defaultTime = defaultTime / 2; // The default time will be half in each loop
	}

	// Playing sound in the background needs the user interaction
	backgroundSound.playSound();

	// This function adds a listener to each game-level button
	function eventListenerHandler(btn, time = 1000) {
		btn.addEventListener("click", () => {
			// The app listens to the user's actions when a key is pressed and then calls the proper function
			document.addEventListener("keydown", moveTank);
			document.addEventListener("keydown", shoot);

			// Each game runs with a time parameter to determine the enemy's movement speed
			gameStarter(time);

			startSound.playSound();
		});
	}
});

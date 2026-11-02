function quit(){
    var quitBtn = document.getElementById('quitBtn');
    quitBtn.style.display = 'none';

    var confirmBtn = document.createElement("button");
    var cancelBtn = document.createElement("button");

    confirmBtn.setAttribute("id", "confirmBtn");
    confirmBtn.setAttribute("class", "btn");
    cancelBtn.setAttribute("id", "cancelBtn");
    cancelBtn.setAttribute("class", "btn");


    confirmBtn.innerHTML = "Quit";
    cancelBtn.innerHTML = "Cancel";

    confirmBtn.onclick = quitGame;
    cancelBtn.onclick = cancelQuit;

    var container = document.createElement("div");
    container.setAttribute("class", "container");

    container.appendChild(confirmBtn);
    container.appendChild(cancelBtn);

    var navMenu = document.querySelector('.menu');
    navMenu.appendChild(container);
}

function quitGame(){
    var playBtn = document.getElementById('playBtn');
    var quitBtn = document.getElementById('quitBtn');
    var container = document.querySelector('.container');
    var confirmBtn = document.getElementById('confirmBtn');
    var cancelBtn = document.getElementById('cancelBtn');

    playBtn.remove();
    quitBtn.remove();
    optionsBtn.remove();
    creditsBtn.remove();
    confirmBtn.remove();
    cancelBtn.remove();
    container.remove();

    var message = document.createElement("p");
    message.setAttribute("class", "message");
    message.innerHTML = "Thank you for playing!";
    
    var navMenu = document.querySelector('.menu');
    navMenu.appendChild(message);  
}

function cancelQuit(){
    var confirmBtn = document.getElementById('confirmBtn');
    var cancelBtn = document.getElementById('cancelBtn');
    var container = document.querySelector('.container');
    confirmBtn.remove();
    cancelBtn.remove();
    container.remove();

    var quitBtn = document.getElementById('quitBtn');
    quitBtn.style.display = 'inline-block';
}

function startGame(){
    var title = document.getElementById('title');
    var version = document.getElementById('version');
    var playBtn = document.getElementById('playBtn');
    var quitBtn = document.getElementById('quitBtn');
    var optionsBtn = document.getElementById('optionsBtn');
    var creditsBtn = document.getElementById('creditsBtn');

    title.style.display = 'none';
    playBtn.style.display = 'none';
    quitBtn.style.display = 'none';
    optionsBtn.style.display = 'none';
    creditsBtn.style.display = 'none';
    version.style.display = 'none';
    quitBtn.style.display = 'none';


    var navMenu = document.querySelector('.menu');
    var container = document.createElement("div");
    container.setAttribute("id", "playContainer");
    navMenu.appendChild(container);

    var message = document.createElement("p");
    message.setAttribute("id", "pMessage");
    message.innerHTML = "You are playing the game!";
    container.appendChild(message);

    var stopBtn = document.createElement("button");
    stopBtn.setAttribute("id", "stopBtn");
    stopBtn.setAttribute("class", "btn");
    stopBtn.innerHTML = "Stop Game";
    stopBtn.onclick = stopGame;
    container.appendChild(stopBtn);
}

function stopGame(){
    var playContainer = document.getElementById('playContainer');
    playContainer.remove();
    var title = document.getElementById('title');
    var version = document.getElementById('version');
    var playBtn = document.getElementById('playBtn');
    var quitBtn = document.getElementById('quitBtn');
    var optionsBtn = document.getElementById('optionsBtn');
    var creditsBtn = document.getElementById('creditsBtn');

    title.style.display = 'inline-block';
    version.style.display = 'inline-block';
    playBtn.style.display = 'inline-block';
    quitBtn.style.display = 'inline-block';
    optionsBtn.style.display = 'inline-block';
    creditsBtn.style.display = 'inline-block';
    quitBtn.style.display = 'inline-block';
}

function showCredits(){
    var creditsContainer = document.getElementById('creditsContainer');

    var title = document.getElementById('title');
    var version = document.getElementById('version');
    var creditsBtn = document.getElementById('creditsBtn');
    var quitBtn = document.getElementById('quitBtn');
    var optionsBtn = document.getElementById('optionsBtn');
    var playBtn = document.getElementById('playBtn');


    title.style.display = 'none';
    playBtn.style.display = 'none';
    quitBtn.style.display = 'none';
    optionsBtn.style.display = 'none';
    creditsBtn.style.display = 'none';
    version.style.display = 'none';
    quitBtn.style.display = 'none';

    var navMenu = document.querySelector('.menu');
    var container = document.createElement("div");
    container.setAttribute("id", "creditsContainer");
    navMenu.appendChild(container);

    var message = document.createElement("p");
    message.setAttribute("id", "pMessage");
    message.innerHTML = "Developed by:";
    container.appendChild(message);

    var pnames = document.createElement("p");
    pnames.setAttribute("id", "pnames");
    pnames.innerHTML = "Allan Daniel <br> Aryane Ribeiro<br> Beatriz Vallada<br> Bruno Souza";
    container.appendChild(pnames);

    var backBtn = document.createElement("button");
    backBtn.setAttribute("id", "backmenuBtn");
    backBtn.setAttribute("class", "btn");
    backBtn.innerHTML = "Back";
    backBtn.onclick = backmenu;
    container.appendChild(backBtn);
}

function backmenu(){
    var creditsContainer = document.getElementById('creditsContainer');
    if (creditsContainer) creditsContainer.remove();
    var opContainer = document.getElementById('opContainer');
    if (opContainer) opContainer.remove();
    var title = document.getElementById('title');
    var version = document.getElementById('version');
    var playBtn = document.getElementById('playBtn');
    var quitBtn = document.getElementById('quitBtn');
    var optionsBtn = document.getElementById('optionsBtn');
    var creditsBtn = document.getElementById('creditsBtn');
    var opContainer = document.getElementById('opContainer');

    title.style.display = 'inline-block';
    version.style.display = 'inline-block';
    playBtn.style.display = 'inline-block';
    quitBtn.style.display = 'inline-block';
    optionsBtn.style.display = 'inline-block';
    creditsBtn.style.display = 'inline-block';
    quitBtn.style.display = 'inline-block';
}

function showOptions(){
    var version = document.getElementById('version');
    var playBtn = document.getElementById('playBtn');
    var quitBtn = document.getElementById('quitBtn');
    var optionsBtn = document.getElementById('optionsBtn');
    var creditsBtn = document.getElementById('creditsBtn');
    var opContainer = document.createElement("div");
    opContainer.setAttribute("id", "opContainer");
    var navMenu = document.querySelector('.menu');
    navMenu.appendChild(opContainer);

    playBtn.style.display = 'none';
    quitBtn.style.display = 'none';
    optionsBtn.style.display = 'none';
    creditsBtn.style.display = 'none';
    version.style.display = 'none';
    quitBtn.style.display = 'none';


    var message = document.createElement("p");
    message.setAttribute("id", "pMessage");
    message.innerHTML = "Game Options: ";
    opContainer.appendChild(message);

    var soundContainer = document.createElement("div");
    soundContainer.setAttribute("id", "soundContainer");
    opContainer.appendChild(soundContainer);
    var message = document.createElement("p");
    message.setAttribute("id", "pMessage");
    message.innerHTML = "Sound: ";
    soundContainer.appendChild(message);
    var soundBtn = document.createElement("button");
    soundBtn.setAttribute("id", "soundBtn");
    soundBtn.setAttribute("class", "btn");
    soundBtn.innerHTML = "ON";
    soundBtn.onclick = toggleSound;
    soundContainer.appendChild(soundBtn);

    var difficultyContainer = document.createElement("div");
    difficultyContainer.setAttribute("id", "difficultyContainer");
    opContainer.appendChild(difficultyContainer);
    var message = document.createElement("p");
    message.setAttribute("id", "pMessage");
    message.innerHTML = "Difficulty: ";
    difficultyContainer.appendChild(message);
    var difBtn = document.createElement("button");
    difBtn.setAttribute("id", "difBtn");
    difBtn.setAttribute("class", "btn");
    difBtn.innerHTML = "NORMAL";
    difBtn.onclick = toggleDifficulty;
    difficultyContainer.appendChild(difBtn);

    var backBtn = document.createElement("button");
    backBtn.setAttribute("id", "backmenuBtn");
    backBtn.setAttribute("class", "btn");
    backBtn.innerHTML = "Back";
    backBtn.onclick = backmenu;
    opContainer.appendChild(backBtn);
}

function toggleSound(){
    var soundBtn = document.getElementById('soundBtn');
    if (soundBtn.innerHTML === "ON") {
        soundBtn.innerHTML = "OFF";
    } else {
        soundBtn.innerHTML = "ON";
    }
}

function toggleDifficulty(){
    var difBtn = document.getElementById('difBtn');
    if (difBtn.innerHTML === "NORMAL") {
        difBtn.innerHTML = "HARD";
    } 
    else{
        if (difBtn.innerHTML === "HARD") {
            difBtn.innerHTML = "EASY";
        }
        else{
            difBtn.innerHTML = "NORMAL";
        }
    }
}

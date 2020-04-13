// first of all, I detect my canvas and set the width
// and height of it as large as the screen.
let canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// then I get and save the context of my canvas as **ctx** also,
const ctx = canvas.getContext("2d");

// in order to have easy access to the min/max of the canvas sides
// in the future, I take them and put in the variables
let canvasMin = Math.min(canvas.width, canvas.height);
let canvasMax = Math.max(canvas.width, canvas.height);

// number of circles that should add to canvas
const numberOfCircles = 50;

// to have animated canvas with circles, we need to create circles and keep them.
let circles = [];

// to prevent scaling in canvas we should listen for resize
// of window and update the size of canvas
window.addEventListener("resize", onResize);

/**
 * update the width and height of the canvas on resize
 */
function onResize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    canvasMin = Math.min(canvas.width, canvas.height);
    canvasMax = Math.max(canvas.width, canvas.height);
}

/**
 * this method is used for generating random numbers between min and max
 * @param max
 * @param min
 * @param floor
 * @returns {number}
 */
function rndNum(max, min = 0, floor = false) {
    if (floor)
        return Math.floor(Math.random() * (max - min) + min);

    return Math.random() * (max - min) + min;
}

/**
 * this function will draw the entire background of canvas.
 */
function drawBackground() {

    // first clear the the whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // this will generate the main gradient (main-light) of wallpaper
    let mainGrd = ctx.createRadialGradient(
        canvas.width / 2, rndNum(-85, -100), 1,
        canvas.width / 2, canvasMax / 4, canvasMin * 1.8);
    mainGrd.addColorStop(.4, "#1a0003");
    mainGrd.addColorStop(0, "#d58801");

    // after creating the gradient and set it colors,
    // we should set it as the fillStyle of the context and
    // paint whole canvas
    ctx.fillStyle = mainGrd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * this method is a util to generate a random circle
 * and push it to the circles array to keep
 */
function addNewCircle() {

    // circles can expose in 3 position,
    // bottom-left corner, bottom-right corner and bottom center.
    const entrances = ["bottomRight", "bottomCenter", "bottomLeft"];
    // I take one of entrances randomly as target entrance
    const targetEntrance = entrances[rndNum(entrances.length, 0, true)];

    // we have 5 different gradient to give each
    // circle a different appearance. each item
    // in below array has colors and offset of gradient.
    const possibleGradients = [
        [
            [0, "rgba(238,31,148,0.14)"],
            [1, "rgba(238,31,148,0)"]
        ],
        [
            [0, "rgba(213,136,1,.2)"],
            [1, "rgba(213,136,1,0)"]
        ],
        [
            [.5, "rgba(213,136,1,.2)"],
            [1, "rgba(213,136,1,0)"]
        ],
        [
            [.7, "rgba(255,254,255,0.07)"],
            [1, "rgba(255,254,255,0)"]
        ],
        [
            [.8, "rgba(255,254,255,0.05)"],
            [.9, "rgba(255,254,255,0)"]
        ]
    ];
    // I take one of gradients details as target gradient details
    const targetGrd = possibleGradients[rndNum(possibleGradients.length, 0, true)];

    // each circle should have a radius. and it will be
    // a random number between three and four quarters of canvas-min side
    const radius = rndNum(canvasMin / 3, canvasMin / 4);

    // this will push the created Circle to the circles array
    circles.push(new Circle(targetEntrance, radius, targetGrd))
}

// to add circles randomly I use an interval that fire every 300ms and a timeout in it.
// every 300ms it will call a timeout func with a delay between 700 and 2000ms, and when
// the timeout callback fired, it will call the addNewCircle method
let addingInterval = setInterval(() => {

    // after adding as manny as expected circles,
    // we clear the interval to stop adding
    if (circles.length > numberOfCircles)
        clearInterval(addingInterval);

    setTimeout(() => {
        addNewCircle();
    }, rndNum(700, 2000));

}, 300);

/**
 * to animate wallpaper, we need to call draw functions frequently.
 * to do that, we use the requestAnimationFrame method that is a browser API.
 * the requestAnimationFrame method get the animateMyWallpaper as the callback
 * function and call it frequently.
 * actually we made a recursion that call draw function on each call.
 *
 * You can read more about [recursion here](https://en.wikipedia.org/wiki/Recursion_(computer_science))
 */
function animateMyWallpaper() {

    // requestAnimationFrame() is a JavaScript method for creating smoother,
    // less resource intensive JavaScript animations
    // you can read mote [here](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
    requestAnimationFrame(animateMyWallpaper);

    // call background draw function.
    drawBackground();

    // loop over circles and call animate function of it
    for (let i = 0; i < circles.length; i++) {
        circles[i].animate();
    }
}


// this just starts animations
animateMyWallpaper();

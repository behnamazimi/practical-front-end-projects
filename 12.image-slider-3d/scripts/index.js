const slider = document.getElementById("slider");

// Initial data to add inside the slider
const imagesData = [
	{ imageName: "img1.png", alt: "slider-item-1" },
	{ imageName: "img2.png", alt: "slider-item-2" },
	{ imageName: "img3.png", alt: "slider-item-3" },
	{ imageName: "img4.jpg", alt: "slider-item-4" },
	{ imageName: "img5.jpg", alt: "slider-item-5" },
	{ imageName: "img6.jpg", alt: "slider-item-6" },
	{ imageName: "img7.jpg", alt: "slider-item-7" },
	{ imageName: "img8.png", alt: "slider-item-8" },
	{ imageName: "img9.png", alt: "slider-item-9" },
	{ imageName: "img10.png", alt: "slider-item-10" },
];
const imagesCount = imagesData.length;

// Animation duration per image in the secondes unit
const animationTimePerImage = 3;

// Using the map method to fill the slider(slider is ul element)
imagesData.map((img, index) => {
	const li = document.createElement("li");

	// Adding a custom animation to each image by a function
	li.style.animationName = dynamicAnimationHandler(imagesCount);

	// Adding a runtime duration to each image
	li.style.animationDuration = `${animationTimePerImage * imagesCount}s`;

	// Adding a delay time to each image depends on the image's id
	li.style.animationDelay = `${animationTimePerImage * (index - imagesCount)}s`;

	// Initial images position depends on the image's id(The first image has no styles)
	if (index === 1) {
		// This is the seconde image
		li.style.transform = "translateX(240px) translateZ(-240px) rotateY(-45deg)";
	} else if (index === imagesCount - 1) {
		// This is the last image
		li.style.transform = "translateX(-240px) translateZ(-240px) rotateY(45deg)";
	} else {
		// These are rest of the images
		li.style.transform = "translateZ(-500px)";
	}

	const imageElement = `
				            <img src=./static/images/${img.imageName} alt=${img.alt} />
				          `;

	li.innerHTML = imageElement;

	slider.appendChild(li);
});

// This function appends a custom stylesheet(including a dynamic keyframe) to the DOM and returns a suitable name
function dynamicAnimationHandler(imagesCount) {
	// Each animation has a freezing time and a range of time to start a movement
	const freezeTime = 100 / imagesCount;
	const movementRange = freezeTime * 0.2;

	const animationName = `animationFor${imagesCount}Images`;
	const animationBody = `0%,
		${freezeTime - movementRange}% {
			transform: translateX(0);
		}
		${freezeTime}%,
		${2 * freezeTime - movementRange}% {
			transform: translateX(-240px) translateZ(-240px) rotateY(45deg);
		}
		${2 * freezeTime}%,
		${100 - freezeTime - movementRange}% {
			transform: translateZ(-500px);
		}
		${100 - freezeTime}%,
		${100 - movementRange}% {
			transform: translateX(240px) translateZ(-240px) rotateY(-45deg);
		}
		${100 - movementRange / 2}% {
			transform: translateX(240px) translateZ(-240px) rotateY(-45deg) translateX(160px);
		}
		100% {
			transform: translateX(0);
	}`;

	// Create an empty stylesheet element and append it to the DOM
	const styleSheet = document.createElement("style");
	document.head.appendChild(styleSheet);

	// Inserting the animation values to the stylesheet
	styleSheet.sheet.insertRule(`@keyframes ${animationName} {${animationBody}}`, styleSheet.length);

	return animationName;
}

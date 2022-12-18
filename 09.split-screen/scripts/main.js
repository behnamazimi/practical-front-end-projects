const left = document.querySelector(".left");
const right = document.querySelector(".right");
const container = document.querySelector(".container");

function addEvent(ele, className){
	ele.addEventListener("mouseenter", () => {
	  container.classList.add(className);
	});
	
	ele.addEventListener("mouseleave", () => {
	  container.classList.remove(className);
	});
}

addEvent(left, "hover-left");
addEvent(right, "hover-right");

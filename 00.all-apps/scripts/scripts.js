document.addEventListener("DOMContentLoaded", function () {
  const apps = [
    {
      name: "Custom Video Player",
      path: "https://behnamazimi.github.io/simple-web-projects/custom-video-player/",
    },
    {
      name: "Lovely Movies",
      path: "https://behnamazimi.github.io/simple-web-projects/lovely-movies/",
    },
    {
      name: "Notes App",
      path: "https://behnamazimi.github.io/simple-web-projects/notes-app/",
    },
    {
      name: "Othello Board Game",
      path: "https://behnamazimi.github.io/simple-web-projects/othello-board-game/",
    },
    {
      name: "Quiz App",
      path: "https://behnamazimi.github.io/simple-web-projects/quiz-app/",
    },
    {
      name: "Simple Range Slider",
      path: "https://behnamazimi.github.io/simple-web-projects/simple-range-slider/",
    },
    {
      name: "Web Chat App",
      path: "https://behnamazimi.github.io/simple-web-projects/web-chat-app/",
    },
    {
      name: "Canvas Wallpaper",
      path: "https://behnamazimi.github.io/simple-web-projects/canvas-wallpaper/",
    },
    {
      name: "split-screen",
      path: "https://behnamazimi.github.io/simple-web-projects/split-screen/",
    },
    // {
    //   name: "Responsive Font Size",
    //   path: "https://behnamazimi.github.io/simple-web-projects/responsive-font-size/",      //this doesn't work
    // },
    {
      name: "CSS Escape Loading Animation",
      path: "https://behnamazimi.github.io/simple-web-projects/css-escape-loading-animation/",
    },
    {
      name: "Image Slider 3D",
      path: "https://behnamazimi.github.io/simple-web-projects/image-slider-3d/",
    },
  ];

  const appList = document.getElementById("app-list");
  const searchInput = document.getElementById("search");

  function displayApps(filter = "") {
    appList.innerHTML = "";
    apps
      .filter((app) => app.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach((app) => {
        const listItem = document.createElement("li");
        listItem.textContent = app.name;
        listItem.style.cursor = "pointer";
        listItem.addEventListener("click", () => {
          window.location.href = app.path;
        });
        appList.appendChild(listItem);
      });
  }

  searchInput.addEventListener("input", (e) => {
    displayApps(e.target.value);
  });

  displayApps();
});

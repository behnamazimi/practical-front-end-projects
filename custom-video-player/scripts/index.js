"use strict";

const video = new Video({
    wrapperID: "video-wrapper",
    videoSrc: "static/video.mp4",
    posterSrc: "static/poster.jpg",
    absolute: true,
    hideControlsOnPlay: true,
    progressColor: "white"
});

console.log(video);

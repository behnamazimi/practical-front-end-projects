const defaultOptions = {
    absolute: false
};

function Video(wrapper, options = defaultOptions) {

    if (!wrapper && (!wrapper instanceof Element || !wrapper instanceof HTMLDocument))
        throw new Error("Wrapper must be a valid node.");

    this.wrapper = wrapper;
    this.options = options;
    this.video = null;
    this.controls = null;
    this.videoProgress = null;
    this.soundRange = null;

    this.icons = {
        stop: '<svg><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
        play: '<svg><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
        pause: '<svg><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
        muted: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>',
        volume_0: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>',
        volume_1: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
        volume_2: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
        fullscreen: '<svg><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
        exitFullscreen: '<svg><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
    };

    this.init();
}

Video.prototype.init = function () {
    if (this.video)
        return;

    this.wrapper.classList.add("m-video");

    this.video = this.wrapper.querySelector("video");
    if (!this.video)
        throw new Error("Can not find video in the wrapper");

    this.video.controls = false;
    this.drawControls();
    this.initListeners();
};

Video.prototype.drawControls = function () {
    if (!this.video || this.controls)
        return;

    this.controls = document.createElement("div");
    this.controls.classList.add("v-controls");
    if (this.options.absolute)
        this.controls.classList.add("--absolute");

    this.controls.innerHTML = `
            <div class="v-controls__btns">
                <div class="v-controls__btns__sound">
                    <button id="sound-toggle">${this.icons.volume_2}</button>
                    <input type="range" min="0" max="1" value="1" step="0.1" id="sound-range">
                </div>
                <div class="v-controls__btns_play">
                    <button id="video-play">${this.icons.play}</button>
                    <button id="video-stop">${this.icons.stop}</button>
                </div>
                <div class="v-controls__btns_fs">
                    <button id="video-fs">${this.icons.fullscreen}</button>
                </div>
            </div>
            <div class="v-controls__timing">
                <span class="elapsed-time">00:00</span>
                <input type="range" min="0" max="100" step="0.05" value="0" id="video-progress">
                <span class="remaining-time">00:00</span>
            </div>`;

    this.elapsedTimeSpan = this.controls.querySelector(".v-controls__timing .elapsed-time");
    this.remainingTimeSpan = this.controls.querySelector(".v-controls__timing .remaining-time");
    this.wrapper.append(this.controls);
};

Video.prototype.initListeners = function () {
    if (!this.video || !this.controls)
        return;

    this.video.addEventListener("loadeddata", this.calcProgress.bind(this));
    this.video.addEventListener("timeupdate", this.calcProgress.bind(this));

    this.videoPlayBtn = this.wrapper.querySelector(".v-controls__btns #video-play");
    this.videoPlayBtn.addEventListener("click", this.togglePlay.bind(this));

    this.videoStopBtn = this.wrapper.querySelector(".v-controls__btns #video-stop");
    this.videoStopBtn.addEventListener("click", this.stop.bind(this));

    this.soundToggleBtn = this.wrapper.querySelector(".v-controls__btns #sound-toggle");
    this.soundToggleBtn.addEventListener("click", this.soundToggle.bind(this));

    this.videoFullscreenBtn = this.wrapper.querySelector(".v-controls__btns #video-fs");
    this.videoFullscreenBtn.addEventListener("click", this.toggleFullscreen.bind(this));

    this.videoProgress = this.wrapper.querySelector(".v-controls__timing input[type=range]");
    this.videoProgress.addEventListener("change", this.setCurrentTime.bind(this));

    this.soundRange = this.wrapper.querySelector(".v-controls__btns__sound input[type=range]");
    this.soundRange.addEventListener("change", this.updateVolume.bind(this));

};

Video.prototype.togglePlay = function () {
    if (!this.video)
        return;

    if (this.video.paused) {
        this.video.play();
        this.videoPlayBtn.innerHTML = this.icons.pause;
    } else {
        this.video.pause();
        this.videoPlayBtn.innerHTML = this.icons.play;
    }
};

Video.prototype.stop = function () {
    if (!this.video)
        return;

    this.video.currentTime = 0;
    this.video.pause();
    this.videoPlayBtn.innerHTML = this.icons.play;
};

Video.prototype.soundToggle = function () {
    if (!this.video)
        return;

    this.video.muted = !this.video.muted;

    if (this.video.muted) {
        this.soundToggleBtn.innerHTML = this.icons.muted;
    } else {
        this.soundToggleBtn.innerHTML = this.icons.volume_2;
    }
};

Video.prototype.toggleFullscreen = function () {
    if (!this.video)
        return;

    if (!this.fullscreen) {
        this.fullscreen = true;
        this.videoFullscreenBtn.innerHTML = this.icons.exitFullscreen;
        if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.mozRequestFullScreen) { /* Firefox */
            this.video.mozRequestFullScreen();
        } else if (this.video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            this.video.webkitRequestFullscreen();
        } else if (this.video.msRequestFullscreen) { /* IE/Edge */
            this.video.msRequestFullscreen();
        }
    } else {
        this.fullscreen = false;
        this.videoFullscreenBtn.innerHTML = this.icons.fullscreen;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
};

Video.prototype.setCurrentTime = function (e) {
    if (!this.video)
        return;

    const rangeValue = e.target.value || 0;

    this.video.currentTime = (rangeValue * this.video.duration) / 100;
};

Video.prototype.calcProgress = function (e) {
    if (!this.video)
        return;

    this.videoProgress.value = (this.video.currentTime / this.video.duration) * 100;

    this.elapsedTimeSpan.innerHTML = this.secToTimeStr(this.video.currentTime);
    this.remainingTimeSpan.innerHTML = this.secToTimeStr(this.video.duration - this.video.currentTime);
};

Video.prototype.secToTimeStr = function (time) {

    let timeInHour = Math.floor(time / 3600);
    let timeInMin = Math.floor((time % 3600) / 60);
    let timeInSec = Math.floor(time % 60);

    if (timeInHour < 10)
        timeInHour = `0${timeInHour}`;

    if (timeInMin < 10)
        timeInMin = `0${timeInMin}`;

    if (timeInSec < 10)
        timeInSec = `0${timeInSec}`;

    let timeStr = `${timeInMin}:${timeInSec}`;
    if (parseInt(timeInHour))
        timeStr = `${timeInHour}:${timeStr}`;

    return timeStr;
};

Video.prototype.updateVolume = function (e) {
    if (!this.video)
        return;

    this.video.volume = e.target.value;
    if (+e.target.value === 0) {
        this.soundToggleBtn.innerHTML = this.icons.volume_0;
    } else if (+e.target.value < .5) {
        this.soundToggleBtn.innerHTML = this.icons.volume_1;
    } else {
        this.soundToggleBtn.innerHTML = this.icons.volume_2;
    }
};

window.Video = Video;

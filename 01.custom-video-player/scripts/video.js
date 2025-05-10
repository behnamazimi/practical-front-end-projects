const defaultOptions = {
  wrapperID: "video-wrapper",
  videoSrc: null,
  posterSrc: null,
  absolute: false,
  hideControlsOnPlay: true,
  progressColor: "red"
};

function Video(options = {}) {
  // Validate options
  if (typeof options !== "object" || !options.wrapperID) {
    throw new Error("Options not passed correctly to the Video constructor.");
  }
  // Merge options with defaults
  this.options = Object.assign({}, defaultOptions, options);

  // Find wrapper element
  this.wrapper = document.getElementById(this.options.wrapperID);
  if (!(this.wrapper instanceof Element || this.wrapper instanceof HTMLDocument)) {
    throw new Error("Wrapper must be a valid DOM element.");
  }

  // Initialize video setup
  this._init();
}

Object.assign(Video.prototype, {
  _init() {
    if (this.video) return;

    // Initialize icons
    this.icons = {
      stop: '<svg><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
      play: '<svg><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
      pause: '<svg><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
      muted: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>',
      volume_0: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>',
      volume_1: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
      volume_2: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
      fullscreen: '<svg><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
      exitFullscreen: '<svg><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>'
    };

    // Add class to wrapper
    this.wrapper.classList.add("m-video");

    // Find existing video or create one
    this.video = this.wrapper.querySelector("video");
    if (!this.video) {
      if (!this.options.videoSrc) {
        throw new Error("Cannot find video tag or videoSrc in options");
      }
      this._generateVideoTag();
    }

    // Disable default controls
    this.video.controls = false;

    // Generate custom controls
    this._generateControls();

    // Initialize event listeners
    this._initListeners();
  },

  _generateVideoTag() {
    this.video = document.createElement("video");
    this.video.src = this.options.videoSrc;
    this.video.poster = this.options.posterSrc;
    this.wrapper.appendChild(this.video);
  },

  _generateControls() {
    if (this.controls) return;

    this.controls = document.createElement("div");
    this.controls.className = "v-controls";
    if (this.options.absolute) this.controls.classList.add("--absolute");
    if (this.options.hideControlsOnPlay) this.controls.classList.add("--auto-hide");

    this.controls.innerHTML = `
      <div class="v-controls__btns">
        <div class="v-controls__btns__sound">
          <button id="sound-toggle">${this.icons.volume_2}</button>
          <input type="range" min="0" max="1" step="0.1" id="sound-range" value="1" />
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
        <input type="range" min="0" max="100" step="0.05" value="0" id="video-progress" />
        <span class="remaining-time">00:00</span>
      </div>
    `;

    // Cache references
    this.elapsedTimeSpan = this.controls.querySelector(".v-controls__timing .elapsed-time");
    this.remainingTimeSpan = this.controls.querySelector(".v-controls__timing .remaining-time");
    this.wrapper.style.setProperty('--progress-color', this.options.progressColor);
    this.wrapper.appendChild(this.controls);

    this._cacheControlElements();
  },

  _cacheControlElements() {
    const controls = this.controls;
    this.videoPlayBtn = controls.querySelector("#video-play");
    this.videoStopBtn = controls.querySelector("#video-stop");
    this.soundToggleBtn = controls.querySelector("#sound-toggle");
    this.videoFullscreenBtn = controls.querySelector("#video-fs");
    this.videoProgress = controls.querySelector("#video-progress");
    this.soundRange = controls.querySelector("#sound-range");
  },

  _initListeners() {
    if (!this.video || !this.controls) return;

    this.video.addEventListener("loadeddata", this.calcProgress.bind(this));
    this.video.addEventListener("play", this._onPlay.bind(this));
    this.video.addEventListener("pause", this._onPause.bind(this));
    this.video.addEventListener("timeupdate", this.calcProgress.bind(this));

    this.videoPlayBtn.addEventListener("click", this._togglePlayPause.bind(this));
    this.videoStopBtn.addEventListener("click", this.stop.bind(this));
    this.soundToggleBtn.addEventListener("click", this._soundToggle.bind(this));
    this.videoFullscreenBtn.addEventListener("click", this._toggleFullscreen.bind(this));
    this.videoProgress.addEventListener("change", this._setCurrentTime.bind(this));
    this.soundRange.addEventListener("change", this._updateVolume.bind(this));
  },

  _onPlay() {
    this.wrapper.classList.add("playing");
    this.videoPlayBtn.innerHTML = this.icons.pause;
  },

  _onPause() {
    this.wrapper.classList.remove("playing");
    this.videoPlayBtn.innerHTML = this.icons.play;
  },

  _togglePlayPause() {
    if (!this.video) return;
    if (this.video.paused) this.video.play();
    else this.video.pause();
  },

  stop() {
    if (!this.video) return;
    this.video.currentTime = 0;
    this.video.pause();
  },

  _soundToggle() {
    if (!this.video) return;
    this.video.muted = !this.video.muted;

    // Animate volume slider when toggling mute
    const animateVolume = () => {
      if (this.video.muted) {
        if (+this.soundRange.value > 0) {
          this.soundRange.value = (+this.soundRange.value - 0.1).toFixed(1);
          requestAnimationFrame(animateVolume);
        }
      } else {
        if (+this.soundRange.value < this.volumeMemorize) {
          this.soundRange.value = (+this.soundRange.value + 0.1).toFixed(1);
          requestAnimationFrame(animateVolume);
        }
      }
    };

    if (this.video.muted) {
      this.volumeMemorize = this.soundRange.value;
      this.soundToggleBtn.innerHTML = this.icons.muted;
    } else {
      this.soundToggleBtn.innerHTML = this.icons.volume_2;
    }
    animateVolume();
  },

  _updateVolume(e) {
    if (!this.video || !e) return;
    this.video.volume = parseFloat(e.target.value);
    const val = parseFloat(e.target.value);
    if (val === 0) {
      this.soundToggleBtn.innerHTML = this.icons.volume_0;
    } else if (val < 0.5) {
      this.soundToggleBtn.innerHTML = this.icons.volume_1;
    } else {
      this.soundToggleBtn.innerHTML = this.icons.volume_2;
    }
  },

  _toggleFullscreen() {
    if (!this.video) return;
    if (!this.fullscreen) {
      this.fullscreen = true;
      this.videoFullscreenBtn.innerHTML = this.icons.exitFullscreen;
      this.controls.classList.add("--fs-abs");
      (this.wrapper.requestFullscreen || this.wrapper.mozRequestFullScreen || this.wrapper.webkitRequestFullscreen || this.wrapper.msRequestFullscreen).call(this.wrapper);
    } else {
      this.fullscreen = false;
      this.videoFullscreenBtn.innerHTML = this.icons.fullscreen;
      this.controls.classList.remove("--fs-abs");
      (document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen).call(document);
    }
  },

  _setCurrentTime(e) {
    if (!this.video || !e) return;
    const value = e.target.value;
    this.video.currentTime = (value * this.video.duration) / 100;
  },

  calcProgress() {
    if (!this.video) return;
    this.videoProgress.value = (this.video.currentTime / this.video.duration) * 100;
    this.elapsedTimeSpan.innerHTML = secToTimeStr(this.video.currentTime);
    this.remainingTimeSpan.innerHTML = secToTimeStr(this.video.duration - this.video.currentTime);
  }
});

// Utility function
function secToTimeStr(seconds) {
  seconds = Math.floor(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const hh = h > 0 ? (h < 10 ? `0${h}` : `${h}`) : '';
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;

  return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

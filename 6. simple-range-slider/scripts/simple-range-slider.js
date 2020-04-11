"use strict";

function SimpleRangeSlider(wrapper, options) {

    if (!wrapper || !(wrapper instanceof Element || wrapper instanceof HTMLDocument))
        throw new Error("Wrapper must be a valid node.");

    this.defaultOptions = {
        min: 0,
        max: 100,
        mode: "horizontal",
        size: '100%',
        defaultValue: 50,
        pathDiameter: "8px",
        handlerSize: "20px",
        pathColor: "#ddd",
        progressColor: "#1c70ff",
        loadingProgressColor: "#ccc",
        lockOnLoadingValue: false
    };

    this.options = Object.assign(this.defaultOptions, options || {});
    this.wrapper = wrapper;

    this.init();
}

// define value property
Object.defineProperty(SimpleRangeSlider.prototype, "value", {
    get: function () {
        return this._value;
    },
    set: function (newValue) {

        // check to lock progress on loading value
        if (this.options.lockOnLoadingValue) {
            if (newValue >= this.loadingValue) {
                newValue = this.loadingValue;
            }
        }

        // convert to percent with two floating point
        const valueAsPercent = Math.floor(Math.max(0, Math.min(100, newValue * 100 / this.options.max)) * 100) / 100;

        if (this.isHorizontalMode) {
            this.progress.style.height = "100%";
            this.progress.style.width = valueAsPercent + "%";
            this.handler.style.left = valueAsPercent + "%";
        } else if (this.isVerticalMode) {
            this.progress.style.width = "100%";
            this.progress.style.height = valueAsPercent + "%";
            this.handler.style.bottom = valueAsPercent + "%";
        }

        this._value = newValue;

        // trigger value change event
        this.events.call("change", this._value);
    }
});

// define loading value property
Object.defineProperty(SimpleRangeSlider.prototype, "loadingValue", {
    get: function () {
        return this._loadingValue;
    },
    set: function (newValue) {
        // convert to percent with two floating point
        const valueAsPercent = Math.floor(Math.max(0, Math.min(100, newValue * 100 / this.options.max)) * 100) / 100;

        if (this.isHorizontalMode) {
            this.loadingProgress.style.height = "100%";
            this.loadingProgress.style.width = valueAsPercent + "%";
        } else if (this.isVerticalMode) {
            this.loadingProgress.style.width = "100%";
            this.loadingProgress.style.height = valueAsPercent + "%";
        }

        this._loadingValue = newValue;

        // trigger loading value change event
        this.events.call("loadingChange", this._loadingValue);
    }
});

SimpleRangeSlider.prototype.init = function () {

    if (this.slider)
        return this;

    this.initialized = false;
    this.events = {
        call: function (event) {
            if (event && typeof event === "string" && typeof this.events[event] === "function") {
                const args = Array.prototype.slice.call(arguments).slice(1);
                this.events[event].apply(this, args);
            }
        }.bind(this),
    };
    this.bound = {
        width: void 0,
        height: void 0,
        leftPos: void 0,
        topPos: void 0
    };
    this._value = 0;
    this._loadingValue = 0;

    // create DOM elements
    this.slider = document.createElement("div");
    this.path = document.createElement("div");
    this.progress = document.createElement("div");
    this.loadingProgress = document.createElement("div");
    this.handler = document.createElement("div");

    this.slider.classList.add("simple-slider");
    this.path.classList.add("simple-slider__path");
    this.progress.classList.add("simple-slider__progress");
    this.loadingProgress.classList.add("simple-slider__loading-progress");
    this.handler.classList.add("simple-slider__handler");

    this.path.appendChild(this.loadingProgress);
    this.path.appendChild(this.progress);
    this.slider.appendChild(this.path);
    this.slider.appendChild(this.handler);

    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(this.slider);

    // apply options on slider
    this.applyOptions();

    this.initListeners();
};

SimpleRangeSlider.prototype.initListeners = function () {
    if (!this.slider)
        return;

    if (this.initialized)
        return this;

    let dragging = false;

    const findPositionFromEvent = function (event) {
        let xPos = event.pageX;
        if (xPos && event.touches)
            xPos = event.touches[0].pageX;
        let yPos = event.pageY;
        if (yPos && event.touches)
            yPos = event.touches[0].pageY;

        if (this.isHorizontalMode) {
            setHorizontalSliderValue(xPos);
        } else if (this.isVerticalMode) {
            setVerticalSliderValue(yPos);
        }
    }.bind(this);


    const setHorizontalSliderValue = function (xPos) {
        const changeGrade = Math.min(1, Math.max(0, (xPos - this.bound.leftPos) / this.bound.width));
        this.value = ((1 - changeGrade) * this.options.min) + (changeGrade * this.options.max);
    }.bind(this);

    const setVerticalSliderValue = function (yPos) {
        const changeGrade = Math.min(1, Math.max(0, 1 - ((yPos - this.bound.topPos) / this.bound.height)));
        this.value = ((1 - changeGrade) * this.options.min) + (changeGrade * this.options.max);

    }.bind(this);

    let draggingStart = function (e) {
        e.preventDefault();

        dragging = true;

        // trigger drag start event
        this.events.call("start", this.value);

        let scrollLeft = window.pageXOffset;
        let scrollTop = window.pageYOffset;

        const rect = this.slider.getBoundingClientRect();
        this.bound = {
            width: rect.width,
            height: rect.height,
            leftPos: rect.left + scrollLeft,
            topPos: rect.top + scrollTop
        };

        this.slider.classList.add("--dragging");

        findPositionFromEvent(e);

        document.addEventListener("mousemove", onDragging);
        document.addEventListener("touchmove", onDragging);
    }.bind(this);

    let draggingStop = function (e) {
        e.preventDefault();
        if (!dragging)
            return;

        this.bound = {
            width: void 0,
            height: void 0,
            leftPos: void 0,
            topPos: void 0
        };
        dragging = false;
        this.slider.classList.remove("--dragging");
        document.removeEventListener("mousemove", onDragging);
        document.removeEventListener("touchmove", onDragging);

        // trigger stop event
        this.events.call("stop", this.value);
    }.bind(this);

    let onDragging = function (e) {
        if (!dragging)
            return;

        findPositionFromEvent(e);

        // trigger dragging event
        this.events.call("dragging", e, this.value);

    }.bind(this);

    this.slider.addEventListener("mousedown", draggingStart);
    this.slider.addEventListener("touchstart", draggingStart);
    document.addEventListener("mouseup", draggingStop);
    document.addEventListener("touchend", draggingStop);

    this.initialized = true;
    return this;
};

SimpleRangeSlider.prototype.applyOptions = function () {

    let modeClass = "--" + (this.options.mode || this.defaultOptions.mode);
    this.slider.classList.remove("--horizontal");
    this.slider.classList.remove("--vertical");
    this.slider.classList.remove("--circle");
    this.slider.classList.add(modeClass);

    this.isVerticalMode = this.options.mode === "vertical";
    this.isCircleMode = this.options.mode === "circle";
    this.isHorizontalMode = !this.isCircleMode && !this.isVerticalMode;

    if (this.options.size) {
        if (this.isHorizontalMode) {
            this.slider.style.height = "unset";
            this.slider.style.width = this.options.size;
        } else if (this.isVerticalMode) {
            this.slider.style.width = "auto";
            this.slider.style.height = this.options.size;
        }
    }

    if (this.options.pathDiameter) {
        this.slider.style.setProperty("--slider-path-diameter", this.options.pathDiameter);
    }

    if (this.options.handlerSize) {
        this.slider.style.setProperty("--slider-handler-size", this.options.handlerSize);
    }

    if (this.options.pathColor) {
        this.slider.style.setProperty("--slider-path-color", this.options.pathColor);
    }

    if (this.options.progressColor) {
        this.slider.style.setProperty("--slider-progress-color", this.options.progressColor);
    }

    if (this.options.loadingProgressColor) {
        this.slider.style.setProperty("--slider-loading-progress-color", this.options.loadingProgressColor);
    }

    // set default value
    this.value = this.options.defaultValue || 0;

    // set default loading value
    this.loadingValue = this._loadingValue || 0;

};

SimpleRangeSlider.prototype.on = function (event, fn) {
    if (typeof event !== "string" || typeof fn !== "function") {
        throw "Invalid event or callback function";
    }

    this.events[event] = fn;
};

SimpleRangeSlider.prototype.update = function (options) {
    if (!this.slider) {
        return;
    }

    this.options = Object.assign(this.defaultOptions, options || {});

    this.applyOptions();

    return this;
};

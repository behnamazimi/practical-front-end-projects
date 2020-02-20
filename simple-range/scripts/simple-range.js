"use strict";

function SimpleRange(wrapper, options) {

    if (!wrapper || !(wrapper instanceof Element || wrapper instanceof HTMLDocument))
        throw new Error("Wrapper must be a valid node.");

    this.defaultOptions = {
        min: 0,
        max: 10,
        defaultValue: 5,
        pathDiameter: "8px",
        handlerSize: "20px",
    };

    this.options = Object.assign(this.defaultOptions, options || {});
    this.wrapper = wrapper;

    this.init();
}

// define value property
Object.defineProperty(SimpleRange.prototype, "value", {
    get: function () {
        return this._value;
    },
    set: function (newValue) {
        // limit the value between 0 and 100
        newValue = Math.max(0, Math.min(newValue, 100));
        this.progress.style.width = newValue + "%";
        this.handler.style.left = newValue + "%";

        this._value = newValue;

        // trigger value change event
        this.events.call("change");
    }
});

// define loading value property
Object.defineProperty(SimpleRange.prototype, "loadingValue", {
    get: function () {
        return this._loadingValue;
    },
    set: function (newValue) {
        // limit the value between 0 and 100
        newValue = Math.max(0, Math.min(newValue, 100));
        this.loadingProgress.style.width = newValue + "%";

        this._loadingValue = newValue;

        // trigger loading value change event
        this.events.call("loadingChange");
    }
});

SimpleRange.prototype.init = function () {

    if (this.slider)
        return this;

    this.initialized = false;
    this.events = {
        call: function (event) {
            if (event && typeof event === "string" && typeof this.events[event] === "function")
                this.events[event]();
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

SimpleRange.prototype.initListeners = function () {
    if (!this.slider)
        return;

    if (this.initialized)
        return this;

    let dragging = false;

    const setSliderValue = function (xPos) {
        const changeGrade = Math.min(1, Math.max(0, (xPos - this.bound.leftPos) / this.bound.width));
        let newValue = ((1 - changeGrade) * this.options.min) + (changeGrade * this.options.max);
        // convert to percent with two floating point
        newValue = Math.floor(Math.max(0, Math.min(100, newValue * 100 / this.options.max)) * 100) / 100;
        this.value = newValue;
    }.bind(this);

    let draggingStart = function (e) {
        e.preventDefault();

        dragging = true;

        // trigger drag start event
        this.events.call("start");

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
        let xPos = e.pageX;
        if (xPos && e.touches)
            xPos = e.touches[0].pageX;
        setSliderValue(xPos);
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
        this.events.call("stop");
    }.bind(this);

    let onDragging = function (e) {
        if (!dragging)
            return;

        // trigger dragging event
        this.events.call("dragging");

        let xPos = e.pageX;
        if (xPos && e.touches)
            xPos = e.touches[0].pageX;
        setSliderValue(xPos)
    }.bind(this);

    this.slider.addEventListener("mousedown", draggingStart);
    this.slider.addEventListener("touchstart", draggingStart);
    document.addEventListener("mouseup", draggingStop);
    document.addEventListener("touchend", draggingStop);

    this.initialized = true;
    return this;
};

SimpleRange.prototype.setDefaultValue = function () {
    if (this.options.defaultValue !== void 0) {
        // calc default val as percent
        this.value = Math.max(0, Math.min(100, this.options.defaultValue * 100 / this.options.max));
    }
};

SimpleRange.prototype.applyOptions = function () {
    this.setDefaultValue();

    if (this.options.width) {
        this.slider.style.width = this.options.width;
    }

    if (this.options.pathDiameter) {
        this.slider.style.setProperty("--slider-path-diameter", this.options.pathDiameter);
    }

    if (this.options.handlerSize) {
        this.slider.style.setProperty("--slider-handler-size", this.options.handlerSize);
    }
};

SimpleRange.prototype.on = function (event, fn) {
    if (typeof event !== "string" || typeof fn !== "function") {
        throw "Invalid event or callback function";
    }

    this.events[event] = fn;
};

SimpleRange.prototype.update = function (options) {
    if (!this.slider) {
        return;
    }

    this.options = Object.assign(this.defaultOptions, options || {});

    if (this.options.width) {
        this.slider.style.width = this.options.width;
    }

    return this;
};

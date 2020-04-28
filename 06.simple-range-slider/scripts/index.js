const sr = new SimpleRangeSlider(document.getElementById("simple-range"), {
    min: 0,
    max: 10,
    mode: "horizontal",
    size: "200px",
    defaultValue: 5,
    pathDiameter: "10px",
    handlerSize: "8px",
    pathColor: "#ddd",
    progressColor: "#1c70ff",
    loadingProgressColor: "#ccc",
    lockOnLoadingValue: false,
});

sr.on("start", (value) => {
    // console.log("started", value);
});

sr.on("dragging", (event, value) => {
    // console.log("dragging", event, value);
});

sr.on("change", (value) => {
    // console.log("changed", value);
});

sr.on("stop", (value) => {
    // console.log("stopped", value);
});

sr.on("loadingChange", (value) => {
    // console.log("loadingChange", value);
});


const srVertical = new SimpleRangeSlider(document.getElementById("simple-range-vertical"), {
    min: 0,
    max: 10,
    mode: "vertical",
    size: "200px",
    defaultValue: 5,
    pathDiameter: "10px",
    handlerSize: "8px",
    pathColor: "#ddd",
    progressColor: "#1c70ff",
    loadingProgressColor: "#ccc",
    lockOnLoadingValue: false,
});

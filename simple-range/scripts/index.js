const sr = new SimpleRange(document.getElementById("simple-range"), {
    min: 0,
    max: 10,
    defaultValue: 5,
    pathDiameter: "10px",
    handlerSize: "8px",
});

sr.on("start", (value) => {
    console.log("started", value);
});

sr.on("dragging", (pos, value) => {
    console.log("dragging", pos, value);
});

sr.on("change", (value) => {
    console.log("changed", value);
});

sr.on("stop", (value) => {
    console.log("stopped", value);
});

sr.on("loadingChange", (value) => {
    console.log("loadingChange", value);
});

console.log(sr);

const sr = new SimpleRange(document.getElementById("simple-range"), {
    min: 0,
    max: 10,
    defaultValue: 5,
    pathDiameter: "15px",
    handlerSize: "8px",
});

sr.on("start", () => {
    // console.log("started");
});

sr.on("dragging", () => {
    // console.log("dragging");
});

sr.on("change", () => {
    // console.log("changed");
});

sr.on("stop", () => {
    // console.log("stopped");
});

console.log(sr);

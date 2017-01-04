import { zoom } from "../src/zoom.js";

document.addEventListener("DOMContentLoaded", () => {
    var elems = document.querySelectorAll("img[data-action='zoom']");
    for (var i = 0; i < elems.length; i++) {
        zoom.setup(elems[i]);
    }
});

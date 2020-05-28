/**
 * Pure JavaScript implementation of zoom.js.
 *
 * Original preamble:
 * zoom.js - It's the best way to zoom an image
 * @version v0.0.2
 * @link https://github.com/fat/zoom.js
 * @license MIT
 *
 * Needs a related CSS file to work. See the README at
 * https://github.com/nishanths/zoom.js for more info.
 *
 * This is a fork of the original zoom.js implementation by @fat.
 * Copyrights for the original project are held by @fat. All other copyright
 * for changes in the fork are held by Nishanth Shanmugham.
 *
 * Copyright (c) 2013 @fat
 * The MIT License. Copyright © 2016 Nishanth Shanmugham.
 */

import { ZoomImage } from "./zoom-image.js";
import { windowWidth, windowHeight } from "./utils.js";

var current = null;
var offset = 80;
var initialScrollPos = -1;
var initialTouchPos = -1;

var setup = (elem) => {
    elem.addEventListener("click", prepareZoom);
};

var prepareZoom = e => {
    e.preventDefault();
    e.stopPropagation();

    if (document.body.classList.contains("zoom-overlay-open")) {
        return;
    }

    if (e.metaKey || e.ctrlKey) {
        window.open((e.target.getAttribute("data-original") || e.target.src), "_blank");
        return;
    }

    if (e.target.width >= windowWidth() - offset) {
        return;
    }

    closeCurrent(true);

    current = new ZoomImage(e.target, offset);
    current.zoom();

    addCloseListeners();
};

var closeCurrent = force => {
    if (current == null) {
        return;
    }
    if (force) {
        current.dispose();
    } else {
        current.close();
    }
    removeCloseListeners();
    current = null;
};

var addCloseListeners = () => {
    document.addEventListener("scroll", handleScroll);
    document.addEventListener("keyup", handleKeyup);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("click", handleClick, true);
};

var removeCloseListeners = () => {
    document.removeEventListener("scroll", handleScroll);
    document.removeEventListener("keyup", handleKeyup);
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("click", handleClick, true);
};

var handleScroll = () => {
    if (initialScrollPos == -1) {
        initialScrollPos = window.pageYOffset;
    }

    var deltaY = Math.abs(initialScrollPos - window.pageYOffset);
    if (deltaY >= 40) {
        closeCurrent();
    }
};

var handleKeyup = e => {
    if (e.keyCode == 27) {
        closeCurrent();
    }
};

var handleTouchStart = e => {
    var t = e.touches[0];
    if (t == null) {
        return;
    }

    initialTouchPos = t.pageY;
    e.target.addEventListener("touchmove", handleTouchMove);
};

var handleTouchMove = e => {
    var t = e.touches[0];
    if (t == null) {
        return;
    }

    if (Math.abs(t.pageY - initialTouchPos) > 10) {
        closeCurrent();
        e.target.removeEventListener("touchmove", handleTouchMove);
    }
};

var handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    closeCurrent();
};

var zoom = Object.create(null);
zoom.setup = setup;

export { zoom };

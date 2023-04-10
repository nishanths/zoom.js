import { toOffset, usableWidth } from "./common.js";
import { ZoomImage } from "./zoom-image.js";
let activeZoom = null; // actively zoomed image, or null.
let initialScrollPos = null;
let initialTouchPos = null;
let closeScrollDelta = null;
let closeTouchDelta = null;
function openActiveZoom(img, c) {
    if (activeZoom !== null) {
        throw "a zoom is already active";
    }
    const tooNarrow = img.width >= usableWidth(document.documentElement, toOffset(c.padding));
    activeZoom = new ZoomImage(img, toOffset(tooNarrow ? c.paddingNarrow : c.padding));
    activeZoom.zoom();
    closeScrollDelta = c.dismissScrollDelta;
    closeTouchDelta = c.dismissTouchDelta;
    addCloseListeners();
}
function closeActiveZoom() {
    if (activeZoom === null) {
        throw "no active zoom";
    }
    removeCloseListeners();
    closeScrollDelta = null;
    closeTouchDelta = null;
    initialScrollPos = null;
    initialTouchPos = null;
    activeZoom.dismiss();
    activeZoom = null;
}
function addCloseListeners() {
    document.addEventListener("scroll", handleDocumentScroll);
    document.addEventListener("keyup", handleDocumentKeyup);
    document.addEventListener("touchstart", handleDocumentTouchStart);
    document.addEventListener("click", handleDocumentClick, true);
}
function removeCloseListeners() {
    document.removeEventListener("scroll", handleDocumentScroll);
    document.removeEventListener("keyup", handleDocumentKeyup);
    document.removeEventListener("touchstart", handleDocumentTouchStart);
    document.removeEventListener("click", handleDocumentClick, true);
}
function handleDocumentScroll() {
    if (closeScrollDelta === null) {
        // Should not happen since it is assigned in openActiveZoom.
        throw "null closeScrollDelta";
    }
    if (initialScrollPos === null) {
        initialScrollPos = window.scrollY;
        return;
    }
    const deltaY = Math.abs(initialScrollPos - window.scrollY);
    if (deltaY < closeScrollDelta) {
        return;
    }
    closeActiveZoom();
}
function handleDocumentKeyup(e) {
    if (e.keyCode !== 27) {
        return;
    }
    closeActiveZoom();
}
function handleDocumentTouchStart(e) {
    if (e.touches.length === 0) {
        return;
    }
    initialTouchPos = e.touches[0].pageY;
    document.addEventListener("touchmove", handleDocumentTouchMove);
}
function handleDocumentTouchMove(e) {
    if (closeTouchDelta === null) {
        // Should not happen since it is assigned in openActiveZoom.
        throw "null closeTouchDelta";
    }
    if (initialTouchPos === null) {
        // Should not happen (see touchstart handler), but guard anyway.
        // This guard is also required to show TypeScript that the
        // variable is non-null below.
        return;
    }
    if (e.touches.length === 0) {
        return;
    }
    if (Math.abs(e.touches[0].pageY - initialTouchPos) < closeTouchDelta) {
        return;
    }
    closeActiveZoom();
    document.removeEventListener("touchmove", handleDocumentTouchMove);
}
function handleDocumentClick(e) {
    e.stopPropagation();
    closeActiveZoom();
}
export const defaultConfig = {
    padding: 40,
    paddingNarrow: 25,
    dismissScrollDelta: 15,
    dismissTouchDelta: 10,
};
// zoom zooms the specified image. The function throws if there is already an
// image actively zoomed at the time of the call.
//
// The zoom is either dimissed by user interaction (e.g. clicking, scrolling
// away) or can be dismissed programatically by calling dismissZoom.
export function zoom(img, cfg = defaultConfig) {
    openActiveZoom(img, cfg !== undefined ? cfg : defaultConfig);
}
// dismissZoom programatically dismisses the presently active zoom. The
// function throws if there is no zoom active at the time of the call.
export function dismissZoom() {
    closeActiveZoom();
}

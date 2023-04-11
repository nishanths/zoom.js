import { toOffset, usableWidth } from "./common.js";
import { ZoomImage } from "./zoom-image.js";
// Values for the currently active zoomed instance.
// There can be at most one.
let activeZoomImage = null;
let initialScrollPos = null;
let initialTouchPos = null;
let closeScrollDelta = null;
let closeTouchDelta = null;
function openActiveZoom(img, c) {
    if (activeZoomImage !== null) {
        activeZoomImage.dismissImmediate();
    }
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        // Spec: "These attributes return the intrinsic dimensions of the
        // image, or zero if the dimensions are not known."
        // https://html.spec.whatwg.org/multipage/embedded-content.html#dom-image-dev
        return;
    }
    const tooNarrow = img.width >= usableWidth(document.documentElement, toOffset(c.padding));
    activeZoomImage = new ZoomImage(img, toOffset(tooNarrow ? c.paddingNarrow : c.padding));
    initialScrollPos = null;
    initialTouchPos = null;
    closeScrollDelta = c.dismissScrollDelta;
    closeTouchDelta = c.dismissTouchDelta;
    activeZoomImage.zoom();
    addCloseListeners();
}
function closeActiveZoom() {
    if (activeZoomImage === null) {
        return;
    }
    removeCloseListeners();
    activeZoomImage.onDismissComplete(() => { activeZoomImage = null; });
    activeZoomImage.dismiss();
    closeScrollDelta = null;
    closeTouchDelta = null;
    initialScrollPos = null;
    initialTouchPos = null;
}
function addCloseListeners() {
    document.addEventListener("scroll", handleDocumentScroll, { passive: true });
    document.addEventListener("keyup", handleDocumentKeyup, { passive: true });
    document.addEventListener("touchstart", handleDocumentTouchStart, { passive: true });
    document.addEventListener("click", handleDocumentClick, { passive: true, capture: true });
}
function removeCloseListeners() {
    // NOTE: in removeEventListener calls, for the options parameter it is
    // necessary only for the "capture" property to match. The other
    // properties, such as "passive", don't matter. Accordingly even the
    // type defintions don't allow for other properties to be specified.
    document.removeEventListener("scroll", handleDocumentScroll);
    document.removeEventListener("keyup", handleDocumentKeyup);
    document.removeEventListener("touchstart", handleDocumentTouchStart);
    document.removeEventListener("click", handleDocumentClick, { capture: true });
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
    if (e.code !== "Escape") {
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
    paddingNarrow: 20,
    dismissScrollDelta: 15,
    dismissTouchDelta: 10,
};
// zoom zooms the specified image.
//
// The image will not be zoomed if its naturalWidth and naturalHeight properties
// are 0 (usually because the values are unavailable).
export function zoom(img, cfg = defaultConfig) {
    openActiveZoom(img, cfg !== undefined ? cfg : defaultConfig);
}
// dismissZoom programmatically dismisses the presently active zoom. It is a
// no-op if there is no zoom active at the time of the call.
export function dismissZoom() {
    closeActiveZoom();
}

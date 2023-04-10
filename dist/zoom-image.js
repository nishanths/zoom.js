import { unwrap, usableHeight, usableWidth, viewportHeight, viewportWidth, wrap } from "./common";
// scaleFactor returns the scale factor with which the image should be
// transformed. The tw and th parameters specify the maximum usable width and
// height in the viewport.
function scaleFactor(img, tw, th) {
    const maxScaleFactor = img.naturalWidth / img.width;
    const ir = img.naturalWidth / img.naturalHeight;
    const tr = tw / th;
    if (img.naturalWidth < tw && img.naturalHeight < th) {
        return maxScaleFactor;
    }
    if (ir < tr) {
        return (th / img.naturalHeight) * maxScaleFactor;
    }
    return (tw / img.naturalWidth) * maxScaleFactor;
}
// ZoomImage manages the lifecycle of a zoom and dismissal
// on a single <img> element.
export class ZoomImage {
    constructor(img, offset) {
        this.img = img;
        this.oldTransform = img.style.transform;
        this.wrapper = ZoomImage.makeWrapper();
        this.overlay = ZoomImage.makeOverlay();
        this.offset = offset;
    }
    static makeOverlay() {
        const ret = document.createElement("div");
        ret.classList.add("zoom-overlay");
        return ret;
    }
    static makeWrapper() {
        const ret = document.createElement("div");
        ret.classList.add("zoom-img-wrapper");
        return ret;
    }
    static elemOffset(elem, wnd, docElem) {
        const rect = elem.getBoundingClientRect();
        return {
            top: rect.top + wnd.scrollY - docElem.clientTop,
            left: rect.left + wnd.scrollX - docElem.clientLeft
        };
    }
    hackForceRepaint() {
        const x = this.img.naturalWidth;
        return x;
    }
    animate(scale) {
        const imageOffset = ZoomImage.elemOffset(this.img, window, document.documentElement);
        const wx = window.scrollX + (viewportWidth(document.documentElement) / 2);
        const wy = window.scrollY + (viewportHeight(document.documentElement) / 2);
        const ix = imageOffset.left + (this.img.width / 2);
        const iy = imageOffset.top + (this.img.height / 2);
        this.img.style.transform = `scale(${scale})`;
        this.wrapper.style.transform = `translate3d(${wx - ix}px, ${wy - iy}px, 0)`;
        document.body.classList.add("zoom-overlay-open");
    }
    zoom() {
        this.img.classList.add("zoom-img");
        this.img.setAttribute("data-zoom-action", "zoom-out");
        wrap(this.img, this.wrapper);
        document.body.appendChild(this.overlay);
        // repaint before animating.
        // TODO: is this necessary?
        this.hackForceRepaint();
        this.animate(scaleFactor(this.img, usableWidth(document.documentElement, this.offset), usableHeight(document.documentElement, this.offset)));
    }
    dismiss(onDone) {
        this.img.addEventListener("transitionend", () => {
            document.body.classList.remove("zoom-overlay-transitioning");
            // The following undoes the work done at the start of the
            // zoom() method.
            document.body.removeChild(this.overlay);
            unwrap(this.img, this.wrapper);
            this.img.setAttribute("data-zoom-action", "zoom-in");
            this.img.classList.remove("zoom-img");
            // Notify with the done callback.
            onDone === null || onDone === void 0 ? void 0 : onDone();
        }, { once: true });
        document.body.classList.add("zoom-overlay-transitioning");
        // The following undoes the work done in animate(), which is
        // called from zoom().
        document.body.classList.remove("zoom-overlay-open");
        this.img.style.transform = this.oldTransform;
        this.wrapper.style.transform = "none";
    }
}

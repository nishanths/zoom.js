import { unwrap, usableHeight, usableWidth, viewportHeight, viewportWidth, wrap } from "./common.js";

// scaleFactor returns the scale factor with which the image should be
// transformed. The tw and th parameters specify the maximum usable width and
// height in the viewport.
function scaleFactor(img: HTMLImageElement, tw: number, th: number) {
	const maxScaleFactor = img.naturalWidth / img.width
	const ir = img.naturalWidth / img.naturalHeight
	const tr = tw / th

	if (img.naturalWidth < tw && img.naturalHeight < th) {
		return maxScaleFactor
	}
	if (ir < tr) {
		return (th / img.naturalHeight) * maxScaleFactor
	}
	return (tw / img.naturalWidth) * maxScaleFactor
}

// ZoomImage manages a single zoom and dismiss lifecycle
// on a <img> element.
export class ZoomImage {
	readonly img: HTMLImageElement
	private oldTransform: string
	private wrapper: HTMLDivElement
	private overlay: HTMLDivElement
	private offset: number

	private dismissCompleteNotified = false
	private dismissCompleteCallbacks: (() => void)[] = []

	// necessary because dismissModifyDOM() cannot be safely called multiple
	// times.
	private dismissModifiedDOM = false

	constructor(img: HTMLImageElement, offset: number) {
		this.img = img
		this.oldTransform = img.style.transform
		this.wrapper = ZoomImage.makeWrapper()
		this.overlay = ZoomImage.makeOverlay()
		this.offset = offset
	}

	private static makeOverlay(): HTMLDivElement {
		const ret = document.createElement("div")
		ret.classList.add("zoom-overlay")
		return ret
	}

	private static makeWrapper(): HTMLDivElement {
		const ret = document.createElement("div")
		ret.classList.add("zoom-img-wrapper")
		return ret
	}

	private static elemOffset(elem: Element, wnd: Window, docElem: HTMLElement) {
		const rect = elem.getBoundingClientRect()
		return {
			top: rect.top + wnd.scrollY - docElem.clientTop,
			left: rect.left + wnd.scrollX - docElem.clientLeft
		}
	}

	private hackForceRepaint() {
		const x = this.img.naturalWidth
		return x
	}

	private zoomModifyDOM() {
		this.img.classList.add("zoom-img")
		wrap(this.img, this.wrapper)
		document.body.appendChild(this.overlay)
	}

	private dismissModifyDOM() {
		document.body.removeChild(this.overlay)
		unwrap(this.img, this.wrapper)
		this.img.classList.remove("zoom-img")
	}

	private zoomAnimate(scale: number) {
		const imageOffset = ZoomImage.elemOffset(this.img, window, document.documentElement)
		const wx = window.scrollX + (viewportWidth(document.documentElement) / 2)
		const wy = window.scrollY + (viewportHeight(document.documentElement) / 2)
		const ix = imageOffset.left + (this.img.width / 2)
		const iy = imageOffset.top + (this.img.height / 2)
		// In img.style.transform, use "scale3d()", not "scale()". There
		// is an issue in macOS Safari version 16.3 (18614.4.6.1.6) and
		// possibly other versions, if the latter is used. The element
		// becomes invisible when zoomed in.
		//
		// In practice, the issue occurs more often (only?) with
		// elements near the top of the page being zoomed.
		//
		// As a side note, during debugging, the incorrectly invisible
		// element reappeared if the "scale()" value is <= 1. The issue
		// occurs only for "scale()" value > 1.
		//
		// In any case, "scale3d()" fixes the issue.
		this.img.style.transform = `scale3d(${scale},${scale},${scale})`
		this.wrapper.style.transform = `translate3d(${wx - ix}px, ${wy - iy}px, 0)`
		document.body.classList.add("zoom-overlay-open")
	}

	// NOTE: This method is idempotent, and can be called multiple times
	// safely.
	private dismissAnimate() {
		document.body.classList.remove("zoom-overlay-open")
		this.img.style.transform = this.oldTransform
		this.wrapper.style.transform = "none"
	}

	zoom() {
		this.zoomModifyDOM()

		// repaint before animating.
		// TODO: is this necessary?
		this.hackForceRepaint()
		this.zoomAnimate(scaleFactor(
			this.img,
			usableWidth(document.documentElement, this.offset),
			usableHeight(document.documentElement, this.offset),
		))
	}

	// onDismissComplete adds the callback f to be invoked
	// when dismissal of the ZoomImage is complete.
	//
	// When a ZoomImage is dismissed using its dismissImmediate method,
	// the callbacks will be invoked before dismissImmediate returns.
	onDismissComplete(f: () => void) {
		this.dismissCompleteCallbacks.push(f)
	}

	private notifyDismissComplete() {
		if (this.dismissCompleteNotified) {
			return
		}
		this.dismissCompleteCallbacks.forEach(f => f())
		this.dismissCompleteNotified = true
	}

	// dismiss dismisses the ZoomImage, with animations.
	dismiss() {
		this.img.addEventListener("transitionend", () => {
			document.body.classList.remove("zoom-overlay-transitioning")
			if (!this.dismissModifiedDOM) {
				this.dismissModifyDOM()
				this.dismissModifiedDOM = true
			}

			this.notifyDismissComplete()
		}, { once: true })

		document.body.classList.add("zoom-overlay-transitioning")
		this.dismissAnimate()
	}

	// dismissImmediate dismisses the ZoomImage, immediately, without
	// animations. It is allowed to call dismissImmediate after dismiss, but
	// not the other way around.
	dismissImmediate() {
		this.dismissAnimate()

		document.body.classList.remove("zoom-overlay-transitioning")
		if (!this.dismissModifiedDOM) {
			this.dismissModifyDOM()
			this.dismissModifiedDOM = true
		}

		this.notifyDismissComplete()
	}
}

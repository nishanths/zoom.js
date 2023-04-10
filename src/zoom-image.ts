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

// ZoomImage manages the lifecycle of a zoom and dismissal
// on a single <img> element.
export class ZoomImage {
	readonly img: HTMLImageElement
	private oldTransform: string
	private wrapper: HTMLDivElement
	private overlay: HTMLDivElement
	private offset: number

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

	private animate(scale: number) {
		const imageOffset = ZoomImage.elemOffset(this.img, window, document.documentElement)
		const wx = window.scrollX + (viewportWidth(document.documentElement) / 2)
		const wy = window.scrollY + (viewportHeight(document.documentElement) / 2)
		const ix = imageOffset.left + (this.img.width / 2)
		const iy = imageOffset.top + (this.img.height / 2)

		// In img.style.transform, the "translate3d(0,0,0)" is
		// effectively a no-op visually, but it exists as a workaround
		// for a bug in macOS Safari version 16.3 (18614.4.6.1.6) and
		// possibly other versions. The issue is that the element
		// becomes invisible if solely "scale()" is present.
		//
		// In practice, the issue occurs more often (only?) with
		// elements near the top of the page being zoomed.
		//
		// As a side note, during debugging, the incorrectly invisible
		// element reappeared if the scale value is <= 1. The issue
		// occurs only for scale value > 1.
		this.img.style.transform = `scale(${scale}) translate3d(0,0,0)`
		this.wrapper.style.transform = `translate3d(${wx - ix}px, ${wy - iy}px, 0)`
		document.body.classList.add("zoom-overlay-open")
	}

	zoom() {
		this.img.classList.add("zoom-img")
		wrap(this.img, this.wrapper)
		document.body.appendChild(this.overlay)

		// repaint before animating.
		// TODO: is this necessary?
		this.hackForceRepaint()

		this.animate(scaleFactor(
			this.img,
			usableWidth(document.documentElement, this.offset),
			usableHeight(document.documentElement, this.offset),
		))
	}

	dismiss() {
		this.img.addEventListener("transitionend", (): void => {
			document.body.classList.remove("zoom-overlay-transitioning")

			// The following undoes the work done at the start of the
			// zoom() method.
			document.body.removeChild(this.overlay)
			unwrap(this.img, this.wrapper)
			this.img.classList.remove("zoom-img")
		}, { once: true })

		document.body.classList.add("zoom-overlay-transitioning")

		// The following undoes the work done in animate(), which is
		// called from zoom().
		document.body.classList.remove("zoom-overlay-open")
		this.img.style.transform = this.oldTransform
		this.wrapper.style.transform = "none"
	}
}

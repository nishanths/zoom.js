import { toOffset, usableHeight, usableWidth } from "./common";
import { ZoomImage } from "./zoom-image";

const closeScrollThreshold = 10
const closeTouchThreshold = 10

let activeZoom: ZoomImage | null = null // actively zoomed image, or null.
let initialScrollPos: number | null = null;
let initialTouchPos: number | null = null;

function openActiveZoom(img: HTMLImageElement, c: Config): void {
	if (activeZoom !== null) {
		throw "a zoom is already active"
	}
	const tooNarrow = img.width >= usableWidth(document.documentElement, toOffset(c.padding))
	activeZoom = new ZoomImage(img, toOffset(tooNarrow ? c.paddingNarrow : c.padding))
	activeZoom.zoom()
	addCloseListeners()
}

function closeActiveZoom(): void {
	if (activeZoom === null) {
		throw "no active zoom"
	}
	removeCloseListeners()
	initialScrollPos = null
	initialTouchPos = null
	activeZoom.dismiss()
	activeZoom = null
}

function addCloseListeners(): void {
	document.addEventListener("scroll", handleDocumentScroll);
	document.addEventListener("keyup", handleDocumentKeyup);
	document.addEventListener("touchstart", handleDocumentTouchStart);
	document.addEventListener("click", handleDocumentClick, true);
}

function removeCloseListeners(): void {
	document.removeEventListener("scroll", handleDocumentScroll);
	document.removeEventListener("keyup", handleDocumentKeyup);
	document.removeEventListener("touchstart", handleDocumentTouchStart);
	document.removeEventListener("click", handleDocumentClick, true);
}

function handleDocumentScroll(): void {
	if (initialScrollPos === null) {
		initialScrollPos = window.scrollY
		return
	}
	const deltaY = Math.abs(initialScrollPos - window.scrollY);
	if (deltaY < closeScrollThreshold) {
		return
	}
	closeActiveZoom()
}

function handleDocumentKeyup(e: KeyboardEvent) {
	if (e.keyCode !== 27) {
		return
	}
	closeActiveZoom()
}

function handleDocumentTouchStart(e: TouchEvent) {
	if (e.touches.length === 0) {
		return
	}
	initialTouchPos = e.touches[0].pageY
	document.addEventListener("touchmove", handleDocumentTouchMove)
}

function handleDocumentTouchMove(e: TouchEvent) {
	if (e.touches.length === 0) {
		return
	}
	if (initialTouchPos === null) {
		// Should not happen (see touchstart handler), but guard anyway.
		// This guard is also required to show TypeScript that the
		// variable is non-null below.
		return
	}
	if (Math.abs(e.touches[0].pageY - initialTouchPos) < closeTouchThreshold) {
		return
	}
	closeActiveZoom()
	document.removeEventListener("touchmove", handleDocumentTouchMove)
}

function handleDocumentClick(e: MouseEvent) {
	e.stopPropagation()
	closeActiveZoom()
}

// Config is the configuration provided to the zoom function.
export type Config = {
	// padding defines the horizontal space and the vertical space around
	// the zoomed image.
	padding: number
	// paddingNarrow is similar to the padding property, except that it is
	// used if the viewport width is too narrow, such that the use of the
	// larger padding property may produce poor results.
	//
	// paddingNarrow should be <= padding, however this is not validated.
	paddingNarrow: number
}

export const defaultConfig: Config = {
	padding: 40,
	paddingNarrow: 25,
}

// zoom zooms the specified image. The function throws if there is already an
// image actively zoomed at the time of the call.
export function zoom(img: HTMLImageElement, cfg: Config = defaultConfig): void {
	openActiveZoom(img, cfg !== undefined ? cfg : defaultConfig)
}

// dismissZoom programatically dismisses the presently active zoom. The
// function throws if there is no zoom active at the time of the call.
export function dismissZoom(): void {
	closeActiveZoom()
}

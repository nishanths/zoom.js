import { toOffset, usableWidth } from "./common.js";
import { ZoomImage } from "./zoom-image.js";

// Values for the currently active zoomed instance.
// There can be at most one.
let activeZoom: ZoomImage | null = null
let onZoomDismiss: (() => void) | null = null
let initialScrollPos: number | null = null
let initialTouchPos: number | null = null
let closeScrollDelta: number | null = null
let closeTouchDelta: number | null = null

function openActiveZoom(img: HTMLImageElement, c: Config, onDismiss?: () => void): void {
	if (activeZoom !== null) {
		throw "a zoom is already active"
	}

	const tooNarrow = img.width >= usableWidth(document.documentElement, toOffset(c.padding))

	activeZoom = new ZoomImage(img, toOffset(tooNarrow ? c.paddingNarrow : c.padding))
	onZoomDismiss = onDismiss !== undefined ? onDismiss : null
	initialScrollPos = null
	initialTouchPos = null
	closeScrollDelta = c.dismissScrollDelta
	closeTouchDelta = c.dismissTouchDelta

	activeZoom.zoom()
	addCloseListeners()
}

function closeActiveZoom(): void {
	if (activeZoom === null) {
		throw "no active zoom"
	}

	removeCloseListeners()
	activeZoom.dismiss()
	onZoomDismiss?.()

	closeScrollDelta = null
	closeTouchDelta = null
	initialScrollPos = null
	initialTouchPos = null
	onZoomDismiss = null
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
	if (closeScrollDelta === null) {
		// Should not happen since it is assigned in openActiveZoom.
		throw "null closeScrollDelta"
	}
	if (initialScrollPos === null) {
		initialScrollPos = window.scrollY
		return
	}
	const deltaY = Math.abs(initialScrollPos - window.scrollY);
	if (deltaY < closeScrollDelta) {
		return
	}
	closeActiveZoom()
}

function handleDocumentKeyup(e: KeyboardEvent) {
	if (e.code !== "Escape") {
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
	if (closeTouchDelta === null) {
		// Should not happen since it is assigned in openActiveZoom.
		throw "null closeTouchDelta"
	}
	if (initialTouchPos === null) {
		// Should not happen (see touchstart handler), but guard anyway.
		// This guard is also required to show TypeScript that the
		// variable is non-null below.
		return
	}
	if (e.touches.length === 0) {
		return
	}
	if (Math.abs(e.touches[0].pageY - initialTouchPos) < closeTouchDelta) {
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

	// dismissScrollDelta defines the vertical scrolling threshold at which
	// the zoomed image is automatically dismissed. The value is the pixel
	// difference between the original vertical scroll position and the
	// subsequent vertical scroll positions.
	dismissScrollDelta: number

	// dismissTouchDelta defines the vertical touch movement threshold at
	// which the zoomed image is automatically dismissed. The value is the
	// pixel difference between the initial vertical touch position and
	// subsequent vertical touch movements.
	dismissTouchDelta: number
}

export const defaultConfig: Config = {
	padding: 40,
	paddingNarrow: 20,
	dismissScrollDelta: 15,
	dismissTouchDelta: 10,
}

// zoom zooms the specified image. The function throws if there is already an
// image actively zoomed at the time of the call.
//
// The onDismiss callback, if provided, is invoked when the zoom is dismissed.
// The zoom can either be dimissed by user interaction (e.g. clicking, scrolling
// away), or it can be dismissed programmatically by calling dismissZoom.
// onDismiss is called as soon as the zoom is dismissed. Dismissal animations
// and transitions may still be in progress at the time of the call.
export function zoom(
	img: HTMLImageElement,
	cfg: Config = defaultConfig,
	onDismiss?: () => void,
): void {
	openActiveZoom(img, cfg !== undefined ? cfg : defaultConfig, onDismiss)
}

// dismissZoom programmatically dismisses the presently active zoom. The
// function throws if there is no zoom active at the time of the call.
export function dismissZoom(): void {
	closeActiveZoom()
}

// zoomActive returns the <img> element that is zoomed if one is actively
// zoomed. Otherwise it returns null.
export function zoomActive(): HTMLImageElement | null {
	if (activeZoom !== null) {
		return activeZoom.img
	}
	return null
}

// viewportWidth and viewportHeight return the width and height of the viewport.
// The value does not include space occupied by any scrollbars. docElem must be
// a document.documentElement value.
export function viewportWidth(docElem: HTMLElement) { return docElem.clientWidth }
export function viewportHeight(docElem: HTMLElement) { return docElem.clientHeight }

// usableWidth and usableHeight return the maximum width and height of the
// viewport that can be used to show the zoomed image. The value is defined
// to be the viewport width (or height) minus the specified offset.
// docElem must be a document.documentElement value.
export function usableWidth(docElem: HTMLElement, offset: number) { return viewportWidth(docElem) - offset }
export function usableHeight(docElem: HTMLElement, offset: number) { return viewportHeight(docElem) - offset }

// toOffset converts a padding value to an offset value.
//
// Note that the internal API of this program is based largely on offset values,
// but the public API is based on padding values, hence the necessity
// for the conversion.
export function toOffset(padding: number) { return padding * 2 }

// wrap wraps elem inside wrapper.
export function wrap(elem: Node, wrapper: Node): void {
	elem.parentNode?.insertBefore(wrapper, elem)
	wrapper.appendChild(elem)
}

// unwrap undoes the operation done by the wrap function.
export function unwrap(elem: Node, wrapper: Node): void {
	wrapper.parentNode?.insertBefore(elem, wrapper)
	wrapper.parentNode?.removeChild(wrapper)
}

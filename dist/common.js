// viewportWidth and viewportHeight return the width and height of the viewport.
// The value does not include space occupied by any scrollbars. docElem must be
// a document.documentElement value.
export function viewportWidth(docElem) { return docElem.clientWidth; }
export function viewportHeight(docElem) { return docElem.clientHeight; }
// usableWidth and usableHeight return the maximum width and height of the
// viewport that can be used to show the zoomed image. The value is defined
// to be the viewport width (or height) minus the specified offset.
// docElem must be a document.documentElement value.
export function usableWidth(docElem, offset) { return viewportWidth(docElem) - offset; }
export function usableHeight(docElem, offset) { return viewportHeight(docElem) - offset; }
// toOffset converts a padding value to an offset value.
//
// Note that the internal API of this program is based largely on offset values,
// but the public API is based on padding values, hence the necessity
// for the conversion.
export function toOffset(padding) { return padding * 2; }
// wrap wraps elem inside wrapper.
export function wrap(elem, wrapper) {
    var _a;
    (_a = elem.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(wrapper, elem);
    wrapper.appendChild(elem);
}
// unwrap undoes the operation done by the wrap function.
export function unwrap(elem, wrapper) {
    var _a, _b;
    (_a = wrapper.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(elem, wrapper);
    (_b = wrapper.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(wrapper);
}

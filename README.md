# zoom.js

An image zooming plugin for the web, as seen on [Medium][medium]. This project
is a port of [`fat/zoom.js`][fat] but has no jQuery or Bootstrap dependencies.

Version 4 is written in TypeScript, has a new API, includes typings, and has no
dependencies.

[https://www.npmjs.com/package/@nishanths/zoom.js][npm]

## Branches

* **v4**: The default branch. It contains code for version 4, which is the
  current major version.
* **master**: Frozen and no longer maintained. The final version on this branch
  is 3.1.0.

## Demo

[https://nishanths.github.io/zoom.js][demo]

## Usage

Install the package.

```
npm i @nishanths/zoom.js
```

Link the `dist/zoom.css` file in your application. For example:

```html
<link href="zoom.css" rel="stylesheet">
```

Import and use symbols from the package. For example:

```ts
import { zoom } from "@nishanths/zoom.js"
```

Note that the `package.json` for the package specifies the `module` property but
not the `main` property. You may need a module-aware tool to correctly include
the package in your bundle. For further reading, see this Stack Overflow
[answer](https://stackoverflow.com/a/47537198/3309046) as a starting point.

## Documentation

### API

```ts
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
	paddingNarrow: 25,
	dismissScrollDelta: 15,
	dismissTouchDelta: 10,
}

// zoom zooms the specified image. The function throws if there is already an
// image actively zoomed at the time of the call.
//
// The zoom is either dimissed by user interaction (e.g. clicking, scrolling
// away) or can be dismissed programmatically by calling dismissZoom.
export function zoom(img: HTMLImageElement, cfg: Config = defaultConfig): void

// dismissZoom programmatically dismisses the presently active zoom. The
// function throws if there is no zoom active at the time of the call.
export function dismissZoom(): void
```

### Example

The following TypeScript program makes all `<img>` elements on the page
zoomable.

```ts
import { zoom } from "@nishanths/zoom.js"

function setupZoom(img: HTMLImageElement) {
	img.classList.add("zoom-cursor")
	img.addEventListener("click", () => { zoom(img) })
}

const imgs = [...document.querySelectorAll("img")]
imgs.forEach(img => { setupZoom(img) })
```

### Notes

All CSS class names used by the package are prefixed with `zoom-`.

Add the class name `zoom-cursor` to a zoomable `<img>` element to show
an indicative [`zoom-in` cursor][zoom-in-cursor] instead of the default cursor.

The program appends the DOM node for the overlay, which appears when an image is
zoomed, to the end of `document.body`.

While an image is zoomed, the program listens for `click` events on
`document.body` with `useCapture` set to `true`, and the handler function calls
`e.stopPropagation()`. This may interfere with other `click` event handlers on
the page. The event listener is removed when zoom is dismissed.

## License

The software in this repository is based on the original [`fat/zoom.js`][fat]
project. The copyright notices and license notices from the original project are
present in the `LICENSE.original` file at the root of this repository.

New source code and modifications in this repository are licensed under an MIT
license. See the `LICENSE` file at the root of the repository.

[fat]: https://github.com/fat/zoom.js
[medium]: https://medium.com
[demo]: https://nishanths.github.io/zoom.js
[zoom-in-cursor]: https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
[npm]: https://www.npmjs.com/package/@nishanths/zoom.js

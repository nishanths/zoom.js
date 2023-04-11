# zoom.js

An image zooming plugin, as seen on older versions of [medium.com][medium]. This
project is a port of [`fat/zoom.js`][fat] but has no jQuery or Bootstrap
dependencies.

Version 4 is written in TypeScript, has a new API, includes typings, and has no
dependencies.

npm package: [https://www.npmjs.com/package/@nishanths/zoom.js][npm]

## Branches and versions

No API backwards compatibility guarantees even within the same major version.

* **v4**: The default branch. It contains code for version 4, which is the
  current major version.
* **master**: Frozen and no longer maintained. The final version on this branch
  is 3.1.0.

## Demo

[https://nishanths.github.io/zoom.js][demo]

Zoom on an image by clicking on it.

Dismiss the zoom by either clicking again on the image, clicking the overlay
around the image, scrolling away, or hitting the `esc` key.

## Usage

Install the package:

```
npm i @nishanths/zoom.js
```

Link the `src/zoom.css` file in your application:

```html
<link href="zoom.css" rel="stylesheet">
```

Import and use symbols from the package:

```ts
import { zoom } from "@nishanths/zoom.js"
```

Note that the `package.json` for the package specifies the `module` property but
not the `main` property. You may need a module-aware tool to correctly include
the package in your bundle. For further reading, see this Stack Overflow
[answer](https://stackoverflow.com/a/47537198/3309046) as a starting point.

## Building locally

To build the package locally, run the following from the root directory
of the repo:

```
% npm install
% make build
```

This should produce a `dist` directory. The js files in the `dist`
directory are ES modules.

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
	// the zoomed image is dismissed by user interaction. The value is the pixel
	// difference between the original vertical scroll position and the
	// subsequent vertical scroll positions.
	dismissScrollDelta: number

	// dismissTouchDelta defines the vertical touch movement threshold at
	// which the zoomed image is dismissed by user interactoin. The value is the
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

// zoom zooms the specified image.
//
// The image will not be zoomed if its naturalWidth and naturalHeight properties
// are 0 (usually because the values are unavailable).
export function zoom(img: HTMLImageElement, cfg: Config = defaultConfig): void

// dismissZoom programmatically dismisses the presently active zoom. It is a
// no-op if there is no zoom active at the time of the call.
export function dismissZoom(): void
```

### Examples

The following TypeScript program makes all existing `<img>` elements on the page
zoomable. Images are zoomed when they are clicked.

```ts
import { zoom } from "@nishanths/zoom.js"

function setupZoom(img: HTMLImageElement) {
	img.classList.add("zoom-cursor")
	img.addEventListener("click", () => { zoom(img) })
}

const imgs = [...document.querySelectorAll("img")]
imgs.forEach(img => { setupZoom(img) })
```

The following TypeScript program customizes only certain properties of a
`Config`, keeping the defaults for the other properties.

```ts
import { Config, defaultConfig } from "@nishanths/zoom.js"

const customConfig: Config = {
	...defaultConfig,
	padding: 30,
}
```

### Notes

All CSS class names used by the package are prefixed with `zoom-`.

Add the class name `zoom-cursor` to a zoomable `<img>` element to use an
[`zoom-in` cursor][zoom-in-cursor] instead of the default cursor for the
image.

The program appends the DOM node for the overlay element, which appears when an
image is zoomed, to the end of `document.body`.

While an image is zoomed, the program listens for `click` events on
`document.body` with `useCapture` set to `true`, and the handler function calls
`e.stopPropagation()`. This may interfere with other `click` event handlers on
the page. The event listener is removed when the zoom is dismissed.

When an image is zoomed, its `transform` style is replaced with a new value that
is necessary for zooming. The old `transform` is restored when the zoom is
dismissed.

### Browser compatibility

I think any popular web browser versions released after 2016 should be supported
by this package. Please read the source code for exact details.

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

# zoom.js

An image zooming plugin for the web, as seen on [Medium][medium].

This project is a port of [`fat/zoom.js`][fat], but has no jQuery or Bootstrap
dependencies.

Version 4 is written in TypeScript and offers a new API.

## Branches

* **v4**: The default branch. It contains code for version 4, which is the current
  major version.
* **master**: Frozen and no longer maintained. The final version on this branch
  is 3.1.0.

## Usage

Install the package:

```
npm install @nishanths/zoom.js
```

Link the `dist/zoom.css` file in your application. For example:

```
<link href="zoom.css" rel="stylesheet">
```

Import and use symbols from the package. For example:

```
import { zoom, Config } from "@nishanths/zoom.js"
```

Note that the `package.json` field for the package specifies the `module`
property but not the `main` property. You may need a module-aware tool to
correctly include the package in your bundle. For further reading, see this
Stack Overflow [answer](https://stackoverflow.com/a/47537198/3309046) as a
starting point.

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
}

export const defaultConfig: Config = {
	padding: 40,
	paddingNarrow: 25,
}

// zoom zooms the specified image. The function throws if there is already an
// image actively zoomed at the time of the call.
export function zoom(img: HTMLImageElement, cfg: Config = defaultConfig): void

// dismissZoom programatically dismisses the presently active zoom. The
// function throws if there is no zoom active at the time of the call.
export function dismissZoom(): void
```

### Notes

While an image zoom is active, the program listens for `click` events on
`document.body` with `useCapture` set to `true`, and the handler function calls
`e.stopPropagation()`. This may interfere with other `click` event handlers on
the page while image zoom is active. The event listener is removed when image
zoom is dismissed.

### Examples

```ts
import { zoom, Config } from "@nishanths/zoom.js"
```

## License

The software in this repository is based on the original [`fat/zoom.js`][fat]
project. The copyright notices and license notices from the original project are
present in the `LICENSE.original` file at the root of this repository.

New source code and modifications in this repository are licensed under an MIT
license. See the `LICENSE` file at the root of the repository.

[fat]: https://github.com/fat/zoom.js
[medium]: https://medium.com

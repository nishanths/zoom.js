# zoom.js

An image zooming plugin for the web, as seen on [Medium][medium].

This project is a port of [`fat/zoom.js`][orig], but has no jQuery or Bootstrap
dependencies.

Version 4 is written in TypeScript and offers a new API.

## Branches

* `v4`: The default branch. It contains the code for version 4, which is the
  current major version.
* `master`: Frozen and not actively developed. The final version on this branch
  is version 3.1.0, published on 2020-05-28. Versions on this branch are no
  longer supported.

## Usage

Install the package:

```
npm install @nishanths/zoom.js
```

Note that the `package.json` field for the package specifies the `module`
property but not the `main` property. You may need a module-aware tool to
correctly include the package in a bundle. For further reading, see footnotes
[^1],[^2],[^3].

## License

The software in this repository is based on the original [`fat/zoom.js`][orig]
project. The copyright notices and license notices from the original project are
present in the `LICENSE.original` file at the root of this repository.

New source code and modifications in this repository are licensed under an MIT
license. See the `LICENSE` file at the root of the repository.

[^1]: https://esbuild.github.io/api/#main-fields
[^2]: https://stackoverflow.com/a/47537198/3309046
[^3]: https://github.com/rollup/rollup/wiki/pkg.module

[orig]: https://github.com/fat/zoom.js
[medium]: medium.com

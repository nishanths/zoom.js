# ZOOM.JS

A pure JavaScript image zooming plugin; as seen on [Medium.com](https://medium.com/designing-medium/image-zoom-on-medium-24d146fc0c20).

Has **no dependencies** on jQuery or Bootstrap.

This is a port of the original version by @fat: <https://github.com/fat/zoom.js>

## Demo

<https://nishanths.github.io/zoom.js>

![gif](https://i.imgur.com/gj3foRU.gif)

## Usage

1. Link the zoom.js and zoom.css files to your site or application. You can either [download](https://github.com/nishanths/zoom.js/archive/master.zip) the files from GitHub or install via npm: `npm i @nishanths/zoom.js`.

  ```html
  <link href="css/zoom.css" rel="stylesheet">
  <script src="dist/zoom.js"></script>
  ```

2. Add a `data-action="zoom"` attribute to the images you want to make zoomable. For example:

  ```html
  <img src="img/blog_post_featured.png" data-action="zoom">
  ```

## Differences from the original implementation

The API is the same as in the original implementation. But browser compatibility may be lower since this does not use vendor prefixes.

### Compatibility

Uses the transitionend event without vendor prefixes, so IE 10 or higher. 

If you need improved compatibility, please [create an issue](https://github.com/nishanths/zoom.js/issues).

## License

[Original license](https://raw.githubusercontent.com/fat/zoom.js/master/MIT-LICENSE.txt)

The MIT License. © 2016 Nishanth Shanmugham.

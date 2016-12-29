# ZOOM.JS

A pure JavaScript-only image zooming plugin; as seen on [Medium.com](https://medium.com/designing-medium/image-zoom-on-medium-24d146fc0c20). Has no dependencies on jQuery or Bootstrap.

This is a port of the original version by @fat: <https://github.com/fat/zoom.js>

## Demo

<https://nishanths.github.io/zoom.js>

## Usage

1. Link the zoom.js and zoom.css files to your site or application.

  ```html
  <link href="css/zoom.css" rel="stylesheet">
  <script src="dist/zoom.js"></script>
  ```

2. Add a `data-action="zoom"` attribute to the images you want to make zoomable. For example:

  ```html
  <img src="img/blog_post_featured.png" data-action="zoom">
  ```

## Differences from the original implementation

The API is the same as in the original implementation. But:

```
 * May be less compatible with older browsers because this uses ES6 features and
   no vendor prefixes. Details below.
 * The "click" event listener on img[data-action="zoom"] elements does not 
   cancel the event after handling. This should allow the event to reach any custom
   event handlers you have setup on the img element.
 * Zoom remains enabled at lower screens widths than allowed in the original implementation. 
   See the OFFSET variable.
```

### Compatibility

Uses ES6 `class`, arrow functions, and the `transitionend` event without vendor prefixes. Should work with Chrome 49, Opera 36, Firefox 49, Edge 12, Safari 10, and iOS 10 or higher.


## License

[Original license](https://raw.githubusercontent.com/fat/zoom.js/master/MIT-LICENSE.txt)

The MIT License. © 2016 Nishanth Shanmugham.

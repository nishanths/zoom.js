# ZOOM.JS

A pure JavaScript image zooming plugin; as seen on
[Medium.com](https://medium.com/designing-medium/image-zoom-on-medium-24d146fc0c20). 

Has no jQuery or Bootstrap dependencies. This is a port of the original
version by @fat: <https://github.com/fat/zoom.js>.

## Usage

You can use zoom.js directly as a script, or install via npm.

### Direct

1. Link the zoom.js and zoom.css files to your site or application.

  ```html
  <link href="css/zoom.css" rel="stylesheet">
  <script src="dist/zoom.js"></script>
  ```

2. Add a `data-action="zoom"` attribute to the images you want to make
   zoomable. For example:

  ```html
  <img src="img/blog_post_featured.png" data-action="zoom">
  ```

### Via npm

1. Install the package `npm i @nishanths/zoom.js`
2. Import the package and call `zoom.setup(elem)` for the images you want to
   make zoomable. 

```js
import { zoom } from "@nishanths/zoom.js";

var imgElem = new Image();
imgElem.src = "tree.png";
document.body.appendChild(imgElem);

zoom.setup(imgElem);
```

## Demo

<https://nishanths.github.io/zoom.js>

![gif](https://i.imgur.com/gj3foRU.gif)


## Notes

It has the same behavior and all the features from the original implementation. But:

```
* In addition to the dist/ scripts, it's available as an npm module.
* Browser compatibility may be lower. Uses the transitionend event without
  vendor prefixes, so IE 10 or higher.
```

## License

[Original license](https://raw.githubusercontent.com/fat/zoom.js/master/MIT-LICENSE.txt)

The MIT License. Copyright © 2016 Nishanth Shanmugham.

.PHONY: build clean

babel = ./node_modules/babel-cli/bin/babel.js
uglifyjs = node ./node_modules/uglifyjs/bin/uglifyjs

define PREAMBLE
/**
 * Pure JavaScript-only implementation of zoom.js.
 *
 * Original preamble:
 * zoom.js - It's the best way to zoom an image
 * @version v0.0.2
 * @link https://github.com/fat/zoom.js
 * @license MIT
 *
 * Needs a related CSS file to work. See the README at
 * https://github.com/nishanths/zoom.js for more info.
 *
 * The MIT License. Copyright © 2016 Nishanth Shanmugham.
 */
endef

export PREAMBLE

OPTS = --screw-ie8 --preamble="$$PREAMBLE" --stats

build: clean
	mkdir dist
	# transpile, wrap in IIFE
	$(babel) js/*.js --presets=es2015-script --plugins=iife-wrap --out-file=dist/zoom.js
	# dist
	$(uglifyjs) dist/zoom.js $(OPTS) --beautify -o dist/zoom.js
	$(uglifyjs) dist/zoom.js $(OPTS) --compress --mangle -o dist/zoom.min.js

clean:
	rm -rf dist

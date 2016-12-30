.PHONY: build clean

minify = node ./node_modules/prettydiff/api/node-local.js

define PREAMBLE
/*
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

build: clean
	mkdir dist
	cp js/zoom.js dist/zoom.js
	# XXX(nishanths): a little hacky, perhaps there's better options to pass to this command.
	$(minify) readmethod:"file" source:"dist/zoom.js" report:false mode:"minify" output:dist/tmp
	mv dist/tmp/dist/zoom.js dist/zoom.min.js
	rm -rf dist/tmp
	# Add preamble
	echo "$$PREAMBLE" | cat - dist/zoom.min.js > tmp
	mv tmp dist/zoom.min.js

clean:
	rm -rf dist

.PHONY: build clean

minify = node ./node_modules/prettydiff/api/node-local.js

build: clean
	mkdir dist
	cp js/zoom.js dist/zoom.js
	# XXX(nishanths): a little hacky, perhaps there's better options to pass to this command.
	$(minify) readmethod:"file" source:"dist/zoom.js" report:false mode:"minify" output:dist/tmp
	mv dist/tmp/dist/zoom.js dist/zoom.min.js
	rm -rf dist/tmp

clean:
	rm -rf dist

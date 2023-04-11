# Relevant npm versioning and publish commands.
# ref: https://stackoverflow.com/a/63112599/3309046
#
# # Versioning
#
# 	npm version premajor --preid alpha # 1.2.3 => 2.0.0-alpha.0
# 	npm version prerelease             # 2.0.0-beta.0 => 2.0.0-beta.1
#	npm version minor                  # 4.0.0 => 4.1.0
#
# # Publish
#
# Regular publish:
#
#	npm publish
#
# To have your package marked as alpha on npmjs.com and
# withheld from automatic installation:
#
# 	npm publish --tag alpha

.PHONY: default
default: build

.PHONY: deps
deps:
	npm ci

.PHONY: build
build:
	mkdir -p dist
	npx tsc
	cp src/zoom.css dist

.PHONY: clean
clean:
	rm -rf dist
	rm -f dist.tsbuildinfo

.PHONY: release
release: clean build
	# increment version number
	npm version minor
	# publish
	git push && git push --tags
	npm publish


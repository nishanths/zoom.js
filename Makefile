.PHONY: default
default:
	@echo "default target does nothing" >&2

.PHONY: build
build:
	npx tsc

clean:
	rm -rf dist/*
	rm dist.tsbuildinfo

# Relevant npm versioning commands
# ref: https://stackoverflow.com/a/63112599/3309046
#
# # 1.2.3 => 2.0.0-alpha.0
# npm version premajor --preid alpha
#
# # 2.0.0-beta.0 => 2.0.0-beta.1
# npm version prerelease

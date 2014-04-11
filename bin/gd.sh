#/bin/bash

# this script is intended to be run form bin directory (paths are relative)

# -root_with_prefix params:
# first path: scanned directory, relative to where script is run
# second path: relative to closure (probably base.js)

../custom_components/closure-library-20130212-95c19e7f0f5f/closure/bin/build/depswriter.py  \
    --root_with_prefix="../src/js ../../../../src/js" \
    > ../src/js_generated/deps.js

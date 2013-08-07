#/bin/bash

../../libs/closure-library-20130212-95c19e7f0f5f/closure/bin/build/depswriter.py  \
    --root_with_prefix="src/js ../../../../tests/parallaxer_1/src/js" \
    --root_with_prefix="../../src/ ../../../../src" \
    --root_with_prefix="../../libs/utils.js/src ../../../../libs/utils.js/src" \
    > src/js_generated/deps.js

#/bin/bash

../../../../libs-external/closure-library-20120710-r2029/closure/bin/build/depswriter.py  \
    --root_with_prefix="src/js ../../../../libs-andrzejdus/parallaxer.js/tests/parallaxer_1/src/js" \
    --root_with_prefix="../../src/ ../../../../libs-andrzejdus/parallaxer.js/src" \
    --root_with_prefix="../../libs/utils.js/src ../../../../libs-andrzejdus/parallaxer.js/libs/utils.js/src" \
    > src/js_generated/deps.js

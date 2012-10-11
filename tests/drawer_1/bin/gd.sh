#/bin/bash

../../../../libs-external/closure-library-20120710-r2029/closure/bin/build/depswriter.py  \
    --root_with_prefix="src/js/test ../../../../libs-andrzejdus/parallaxer/tests/drawer_1/src/js/test" \
    --root_with_prefix="../../../../libs-andrzejdus/utils/src/ ../../../../libs-andrzejdus/utils/src" \
    --root_with_prefix="../../../../libs-andrzejdus/parallaxer.js/src/ ../../../../libs-andrzejdus/parallaxer.js/src" \
    > src/js_generated/deps.js

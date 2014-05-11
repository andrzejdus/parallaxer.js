/*
 * Copyright 2014 Andrzej Duś
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * @author Andrzej Duś <andrzej@boycoy.com>
 */

goog.provide('andrzejdus.parallaxer.drawer.VisibilityChecker');

var andrzejdus = andrzejdus || {};
andrzejdus.parallaxer = andrzejdus.parallaxer || {};

(function (namespace, undefined) {
  "use strict";

  var VisibilityChecker = function () {
    var windowTop = null;
    var windowBottom = null;

    var construct = function () {
      updateWindowBounds();
      $(window).on('resize', onResize);
    };

    /*
     *
     * Public methods
     *
     */

    var isVisible = function (top, bottom) {
      var isVisible = false;

      if ((top >= windowTop && top <= windowBottom) ||
        (bottom >= windowTop && bottom <= windowBottom) ||
        (top < windowTop && bottom > windowBottom)) {
        isVisible = true;
      }

      return isVisible;
    };

    /*
     *
     * Private methods
     *
     */

    var onResize = function () {
      updateWindowBounds();
    };

    var updateWindowBounds = function () {
      windowTop = 0;
      windowBottom = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
    };

    construct();

    this.isVisible = isVisible;
  };

  namespace.VisibilityChecker = VisibilityChecker;
}(andrzejdus.parallaxer));

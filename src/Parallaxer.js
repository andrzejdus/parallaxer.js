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

goog.provide('andrzejdus.parallaxer.Parallaxer');

goog.require('andrzejdus.parallaxer.ParallaxerCore');

var andrzejdus = andrzejdus || {};
andrzejdus.parallaxer = andrzejdus.parallaxer || {};

/** @define {boolean} */
andrzejdus.DEBUG = true;

(function (namespace, undefined) {
  "use strict";

  var Parallaxer = function () {
    this.isSmoothScrollEnabled = false;
    this.layers = [];
    this.parallaxerCore = new andrzejdus.parallaxer.ParallaxerCore();
  };

  Parallaxer.prototype.setSmoothScrollEnabled = function (value) {
    this.isSmoothScrollEnabled = value;
  };

  Parallaxer.prototype.init = function () {
    this.parallaxerCore.setSmoothScrollEnabled(this.isSmoothScrollEnabled);

    this.layers = [];
    var self = this;
    $('[data-type="parallaxer-layer"]').each(function () {
      var $element = $(this);
      self.layers.push({
        element: this,
        $element: $element,
        initialElementOffsetTop: $element.offset().top,
        offsetTop: parseInt($element.data('parallaxer-offset-top'), 10) || 0,
        speed: $element.data('parallaxer-speed'),
        // we cannot use data here because it coerces 'false' string and no value to boolean false
        autoCss: $element.attr('data-parallaxer-auto-css') !== 'false'
      });
    });

    for (var i = 0; i < this.layers.length; i++) {
      var layer = this.layers[i];

      if (layer.autoCss) {
        layer.$element.css({'position': 'fixed', 'top': '0px'});
      }
      this.parallaxerCore.addElement(
        layer.element,
        layer.speed,
        layer.initialElementOffsetTop,
        andrzejdus.parallaxer.ParallaxerCore.VERTICAL);
    }

    var $window = $(window);
    var onScroll = function () {
      var scrollTop = $window.scrollTop();
      this.parallaxerCore.setTargetScrollPosition(scrollTop);
    }.bind(this);

    $window.on('scroll.andrzejdus-parallaxer', onScroll);
    this.parallaxerCore.refresh();
  };

  Parallaxer.prototype.getCore = function () {
    return this.parallaxerCore;
  };

  Parallaxer.prototype.stop = function () {
    var $window = $(window);
    $window.off('scroll.andrzejdus-parallaxer');

    var transformPropertyName = Modernizr.prefixed('transform');

    for (var i = 0; i < this.layers.length; i++) {
      var layer = this.layers[i];

      if (layer.autoCss) {
        layer.$element.css({'position': '', 'top': ''});
        layer.element.style[transformPropertyName] = '';
      }
    }
  };

  namespace.Parallaxer = new Parallaxer();
}(andrzejdus.parallaxer));

goog.exportSymbol('andrzejdus.parallaxer.Parallaxer', andrzejdus.parallaxer.Parallaxer);

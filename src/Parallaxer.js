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

  // constants
  var DATA_PARALLAXER_NAME = 'parallaxer';
  var DATA_OFFSET_TOP_NAME = 'parallaxer-offset-top';
  var DATA_SPEED_NAME = 'parallaxer-speed';
  var DATA_AUTO_CSS_NAME = 'parallaxer-auto-css';
  var DATA_ORIENTATION_NAME = 'parallaxer-orientation';

  var Parallaxer = function () {
    var isSmoothScrollEnabled = false;
    var layers;
    var parallaxerCore = new andrzejdus.parallaxer.ParallaxerCore();

    /*
     *
     * Public methods
     *
     */

    var start = function () {
      var pageHeight = $('body').height();
      $('body').height(pageHeight);

      layers = [];

      var dataParallaxerSelector = '[data-' + DATA_PARALLAXER_NAME + '="enabled"]';
      $(dataParallaxerSelector).each(function () {
        var $element = $(this);
        layers.push({
          element: this,
          $element: $element,
          initialElementOffsetTop: $element.offset().top,
          offsetTop: parseInt($element.data(DATA_OFFSET_TOP_NAME), 10) || 0,
          speed: $element.data(DATA_SPEED_NAME),
          orientation: $element.data(DATA_ORIENTATION_NAME),
          // we cannot use data here because it coerces 'false' string and no value to boolean false
          autoCss: $element.attr('data-' + DATA_AUTO_CSS_NAME) !== 'false'
        });
      });

      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.autoCss) {
          layer.$element.css({'position': 'fixed', 'top': '0px'});
        }
        parallaxerCore.addElement(
          layer.element,
          layer.speed,
          layer.initialElementOffsetTop,
          andrzejdus.parallaxer.ParallaxerCore.VERTICAL);
      }

      var $window = $(window);
      var onScroll = function () {
        var scrollTop = $window.scrollTop();
        parallaxerCore.setTargetScrollPosition(scrollTop);
      };

      $window.on('scroll.andrzejdus-parallaxer', onScroll);
      parallaxerCore.setSmoothScrollEnabled(isSmoothScrollEnabled);
      parallaxerCore.refresh();
    };

    var stop = function () {
      var $window = $(window);
      $window.off('scroll.andrzejdus-parallaxer');

      var transformPropertyName = Modernizr.prefixed('transform');

      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.autoCss) {
          layer.$element.css({'position': '', 'top': ''});
          layer.element.style[transformPropertyName] = '';
        }
      }
    };

    var setSmoothScrollEnabled = function (value) {
      isSmoothScrollEnabled = value;
    };

    var getCore = function () {
      return parallaxerCore;
    };

    this.start = start;
    this.stop = stop;
    this.setSmoothScrollEnabled = setSmoothScrollEnabled;
    this.getCore = getCore;
  };

  namespace.Parallaxer = new Parallaxer();
}(andrzejdus.parallaxer));

goog.exportSymbol('andrzejdus.parallaxer.Parallaxer', andrzejdus.parallaxer.Parallaxer);

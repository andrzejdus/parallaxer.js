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

goog.provide('andrzejdus.parallaxer.ParallaxerCoreEvent');

var andrzejdus = andrzejdus || {};
andrzejdus.parallaxer = andrzejdus.parallaxer || {};

(function (namespace, undefined) {
  "use strict";

  /** @constructor */
  var ParallaxerCoreEvent = function (source) {
    this.source = source;
  };

  ParallaxerCoreEvent.CURRENT_POSITION_CHANGED = 'current_position_changed';
  ParallaxerCoreEvent.TARGET_POSITION_CHANGED = 'target_position_changed';
  ParallaxerCoreEvent.AFTER_FIRST_DRAW = 'after_first_draw';
  ParallaxerCoreEvent.AFTER_LOOP_STOP = 'after_loop_stop';

  namespace.ParallaxerCoreEvent = ParallaxerCoreEvent;
}(andrzejdus.parallaxer));


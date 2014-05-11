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

goog.provide('andrzejdus.parallaxer.ParallaxerCore');

goog.require('andrzejdus.parallaxer.ParallaxerCoreEvent');
goog.require('andrzejdus.parallaxer.drawer.Drawer');
goog.require('andrzejdus.utils.Log');
goog.require('andrzejdus.utils.Looper');
goog.require('andrzejdus.utils.Utils');
goog.require('andrzejdus.utils.events.EventsManager');

var andrzejdus = andrzejdus || {};
andrzejdus.parallaxer = andrzejdus.parallaxer || {};

(function (namespace, undefined) {
  "use strict";

  /** @constructor */
  var ParallaxerCore = function (initialScrollPosition) {
    // aliases for namespaced objects
    var ParallaxerCoreEvent = andrzejdus.parallaxer.ParallaxerCoreEvent;
    var Drawer = andrzejdus.parallaxer.Drawer;
    var DrawerObject = andrzejdus.parallaxer.DrawerObject;

    var currentScrollPosition;
    var targetScrollPosition;

    var eventsManager;

    var smoothScrollEnabled;
    var isFirstDraw;

    var objects;
    var drawer;
    var looper;

    var onLoopFrameHook = null;

    var construct = function () {
      if (initialScrollPosition === undefined) {
        currentScrollPosition = 0;
        targetScrollPosition = 0;
      } else {
        currentScrollPosition = initialScrollPosition;
        targetScrollPosition = initialScrollPosition;
      }

      eventsManager = new EventsManager();
      eventsManager.registerType(ParallaxerCoreEvent.CURRENT_POSITION_CHANGED);
      eventsManager.registerType(ParallaxerCoreEvent.TARGET_POSITION_CHANGED);
      eventsManager.registerType(ParallaxerCoreEvent.AFTER_FIRST_DRAW);
      eventsManager.registerType(ParallaxerCoreEvent.AFTER_LOOP_STOP);

      smoothScrollEnabled = false;

      objects = [];
      drawer = new Drawer();
      looper = new Looper(onLoopFrame);
    };

    /*
     *
     * Public methods
     *
     */

    /*
     * Registers event listener for given event type.
     */
    var addEventListener = function (type, listener) {
      eventsManager.addEventListener(type, listener);
    };

    /*
     * Unregisters given event listener for given event type.
     */
    var removeEventListener = function (type, listener) {
      eventsManager.removeEventListener(type, listener);
    };

    /*
     * Registers DOM element to be scrolled by parallaxer.
     *
     * Arguments control scrolling parameters for element.
     */
    var addElement = function (element, speed, scrollOffset, type) {
      if (element === undefined) {
        return null;
      }

      var object = {
        'id': objects.length,
        'element': element,
        'speed': speed,
        'type': type,
        'scrollOffset': scrollOffset
      };

      objects.push(object);
      drawer.addObject(
          object.id,
          element,
          object.type === ParallaxerCore.HORIZONTAL ?
              DrawerObject.HORIZONTAL :
              DrawerObject.VERTICAL,
          0
      );

      return object;
    };

    var refresh = function () {
      draw(0, true);
    };

    /*
     * Returns current smooth scroll state.
     */
    var isSmoothScrollEnabled = function () {
      return smoothScrollEnabled;
    };

    /*
     * Enables or disables smooth scroll.
     */
    var setSmoothScrollEnabled = function (value) {
      isSmoothScrollEnabled = value;
    };

    /*
     * Gets current scroll position, i.e. position on which registered elements were last drawn.
     */
    var getCurrentScrollPosition = function () {
      return currentScrollPosition;
    };

    /*
     * Gets target scroll position, i.e. position to which elements are scrolled.
     */
    var getTargetScrollPosition = function () {
      return targetScrollPosition;
    };

    /*
     * Sets target scroll position, i.e. position to which elements are scrolled.
     */
    var setTargetScrollPosition = function (value) {
      if (targetScrollPosition !== value) {
        targetScrollPosition = value;

        eventsManager.dispatch(ParallaxerCoreEvent.TARGET_POSITION_CHANGED,
          new ParallaxerCoreEvent(this));

        looper.start();
      }
    };

    /*
     * Sets callback that gets executed on every frame draw.
     */
    var setLoopFrameHook = function (callback) {
      onLoopFrameHook = callback;
    };

    /*
     *
     * Private methods
     *
     */

    var onLoopFrame = function (deltaTime) {
      var hasChanged = draw(deltaTime, false);

      // stops loop if nothing has changed in last frame
      if (hasChanged === false) {
        looper.stop();
        eventsManager.dispatch(ParallaxerCoreEvent.AFTER_LOOP_STOP,
          new ParallaxerCoreEvent(this));
      }

      if (onLoopFrameHook) {
        onLoopFrameHook(deltaTime);
      }
    }.bind(this);

    var draw = function (deltaTime, forceUpdate) {
      var deltaPosition = targetScrollPosition - currentScrollPosition;
      var absDeltaPosition = Math.abs(deltaPosition);

      var hasChanged = false;
      if (absDeltaPosition > 0.2 || forceUpdate) {
        hasChanged = true;

        if (isSmoothScrollEnabled) {
          var change = deltaPosition / 30 * (deltaTime / (1000 / 60));

          if (Math.abs(change) < 1) {
            change = change > 0 ? 1 : -1;
          }
          currentScrollPosition += change;

          if (absDeltaPosition - Math.abs(change) < 0) {
            currentScrollPosition = targetScrollPosition;
          }
        }
        else {
          currentScrollPosition = targetScrollPosition;
        }

        eventsManager.dispatch(ParallaxerCoreEvent.CURRENT_POSITION_CHANGED,
          new ParallaxerCoreEvent(this));

        drawer.startFrame();
        updateOffsets(currentScrollPosition);
        drawer.draw();

        if (isFirstDraw === true) {
          isFirstDraw = false;

          eventsManager.dispatch(ParallaxerCoreEvent.AFTER_FIRST_DRAW,
            new ParallaxerCoreEvent(this));
        }
      }

      return hasChanged;
    }.bind(this);

    var updateOffsets = function (newScrollPosition) {
      for (var key in objects) {
        var object = objects[key];

        var offset = Math.floor((object.scrollOffset - newScrollPosition) * object.speed);

        drawer.updateOffset(object.id, offset);
      }
    };

    construct();

    this.addEventListener = addEventListener;
    this.removeEventListener = removeEventListener;
    this.addElement = addElement;
    this.refresh = refresh;
    this.isSmoothScrollEnabled = isSmoothScrollEnabled;
    this.setSmoothScrollEnabled = setSmoothScrollEnabled;
    this.getCurrentScrollPosition = getCurrentScrollPosition;
    this.getTargetScrollPosition = getTargetScrollPosition;
    this.setTargetScrollPosition = setTargetScrollPosition;
    this.setLoopFrameHook = setLoopFrameHook;
  };

  ParallaxerCore.HORIZONTAL = 'horizontal';
  ParallaxerCore.VERTICAL = 'vertical';

  namespace.ParallaxerCore = ParallaxerCore;
}(andrzejdus.parallaxer));

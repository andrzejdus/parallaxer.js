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

goog.provide('andrzejdus.parallaxer.drawer.Drawer');

goog.require('andrzejdus.utils.Log');
goog.require('andrzejdus.parallaxer.drawer.DrawerObject');
goog.require('andrzejdus.parallaxer.drawer.Cache');
goog.require('andrzejdus.parallaxer.drawer.VisibilityChecker');

var Drawer = function () {
  var transformPropertyName = Modernizr.prefixed('transform');

  var stateObjects = {};
  var stateObjectsToRedraw = {};

  var heightsCache = null;

  var visibilityChecker = new VisibilityChecker();

  var construct = Utils.delegate(this, function () {
    heightsCache = new Cache(function onCacheCreate(element) {
    });
  });

  this.addObject = function (id, element, type, offset) {
    stateObjects[id] = new DrawerObject(element, type, offset);

    stateObjectsToRedraw = {};
  };

  this.startFrame = function () {
    stateObjectsToRedraw = {};
  };

  this.updateOffset = function (id, newOffset) {
    var stateObject = stateObjects[id];
    if (stateObject) {
      stateObject.setOffset(newOffset);
      var element = stateObject.getElement();
      stateObject.updateVisibility(
        visibilityChecker.isVisible(
          stateObject.getOffset(), heightsCache.get(element))
      );
      stateObjectsToRedraw[id] = stateObject;
    }
    else {
      console.error('Unknown object id ' + id);
    }
  };

  this.draw = Utils.delegate(this, function () {
    for (var id in stateObjectsToRedraw) {
      var stateObject = stateObjectsToRedraw[id];

      var element = stateObject.getElement();

      if (element) {
        element.style[transformPropertyName] =
          'translate' +
          (stateObject.getType() === DrawerObject.HORIZONTAL ? 'X' : 'Y') +
          '(' + stateObject.getOffset() + 'px)';
      }
    }
  });

  construct();
};


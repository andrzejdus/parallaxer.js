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

goog.provide('andrzejdus.parallaxer.drawer.DrawerObject');

var andrzejdus = andrzejdus || {};
andrzejdus.parallaxer = andrzejdus.parallaxer || {};

(function (namespace, undefined) {
  "use strict";

  var DrawerObject = function (element, type, offset) {
    var isVisibleValue = true;

    var getElement = function () {
      return element;
    };

    var getOffset = function () {
      return offset;
    };

    var setOffset = function (value) {
      offset = value;
    };

    var getType = function () {
      return type;
    };

    var isVisible = function () {
      return isVisibleValue;
    };

    var updateVisibility = function (value) {
      isVisibleValue = value;
    };

    this.getElement = getElement;
    this.getOffset = getOffset;
    this.setOffset = setOffset;
    this.getType = getType;
    this.isVisible = isVisible;
    this.updateVisibility = updateVisibility;
  };

  DrawerObject.HORIZONTAL = 'horizontal';
  DrawerObject.VERTICAL = 'vertical';

  namespace.DrawerObject = DrawerObject;
}(andrzejdus.parallaxer));

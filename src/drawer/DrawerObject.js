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

var DrawerObject = function (element, type, offset) {
  var isVisibleValue = true;

  this.getElement = function () {
    return element;
  };

  this.getOffset = function () {
    return offset;
  };

  this.setOffset = function (value) {
    offset = value;
  };

  this.getType = function () {
    return type;
  };

  this.isVisible = function () {
    return isVisibleValue;
  };

  this.updateVisibility = function (value) {
    isVisibleValue = value;
  };
};

DrawerObject.HORIZONTAL = 'horizontal';
DrawerObject.VERTICAL = 'vertical';

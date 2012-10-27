goog.provide('andrzejdus.parallaxer.drawer.DrawerObject');

var DrawerObject = function(element, type, offset) {
  var isVisibleValue = true;

  this.getElement = function() {
    return element;
  };

  this.getOffset = function() {
    return offset;
  };

  this.setOffset = function(value) {
    offset = value;
  };

  this.getType = function() {
    return type;
  };

  this.isVisible = function() {
    return isVisibleValue;
  };

  this.updateVisibility = function(value) {
    isVisibleValue = value;
  };
};

DrawerObject.HORIZONTAL = 'horizontal';
DrawerObject.VERTICAL = 'vertical';

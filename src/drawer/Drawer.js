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


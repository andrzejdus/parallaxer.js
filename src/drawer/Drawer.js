goog.provide('andrzejdus.parallaxer.drawer.Drawer');

goog.require('andrzejdus.utils.Log');
goog.require('andrzejdus.parallaxer.drawer.DrawerObject');
goog.require('andrzejdus.parallaxer.drawer.Cache');
goog.require('andrzejdus.parallaxer.drawer.VisibilityChecker');

var Drawer = function() {
  var transformPropertyName = Modernizr.prefixed('transform');
  var isHardwareTransformEnabled = transformPropertyName ? true : false;

  var stateObjects = {};
  var screenObjects = {};
  var stateObjectsToRedraw = {};

  var heightsCache = null;

  var visibilityChecker = new VisibilityChecker();
  
  var construct = Utils.delegate(this, function() {
    heightsCache = new Cache(function onCacheCreate(element) {
    });
  });

  this.addObject = function(id, element, type, offset) {
    stateObjects[id] = new DrawerObject(element, type, offset);
    screenObjects[id] = new DrawerObject(element, type, offset);
    
    stateObjectsToRedraw = {};
    console.log(stateObjects);
  };

  this.startFrame = function() {
    stateObjectsToRedraw = {};
  };

  this.updateOffset = function(id, newOffset) {
    var stateObject = stateObjects[id];
    if (stateObject) {
      stateObject.setOffset(newOffset);
      var element = stateObject.getElement();
      console.log(element);
      stateObject.updateVisibility(
          visibilityChecker.isVisible(
            stateObject.getOffset(), heightsCache.get(element))
      );

      var screenObject = screenObjects[id];

      if (isRedrawNeeded(stateObject, screenObject, id)) {
        stateObjectsToRedraw[id] = stateObject;
      }
    }
    else {
      console.error('Unknown object id ' + id);
    }
  };
  
  this.draw = Utils.delegate(this, function() {
    for (var id in stateObjectsToRedraw) {
      var stateObject = stateObjectsToRedraw[id];
      
      var element = stateObject.getElement();
      
      if (element) {
        if (isHardwareTransformEnabled) {
          console.log(element.style);
          element.style[transformPropertyName] =
              'translate' +
              (stateObject.getType() === 'left' ? 'X' : 'Y') +
              '(' + stateObject.getOffset() + 'px)'; 
        }
        else {
          element.style[stateObject.getType()] = stateObject.getOffset() + 'px';
        }
      }

      var screenObject = screenObjects[id];
      updateScreenObject(screenObject, stateObject);
    }
  });

  // TODO remove id
  var isRedrawNeeded = function(stateObject, screenObject, id) {
    var hasVisibilityChanged = stateObject.isVisible() != screenObject.isVisible();
    var hasOffsetChanged = stateObject.getOffset() != screenObject.getOffset(); 

    // TODO create consts for DrawerObject.getType();
    var isRedrawNeededValue = 
        hasVisibilityChanged ||
        (stateObject.isVisible() && hasOffsetChanged) ||
        stateObject.getType() === 'left';

    // TODO remove before release
    if (false && id === '.page0 .layer.starsBack') {
      console.log(stateObject.isVisible() + '!=' + screenObject.isVisible());
      console.log(stateObject.getOffset() + '!=' + screenObject.getOffset());
      console.log(isRedrawNeededValue);
    }

    //return isRedrawNeededValue;

    return true;
  };

  var updateScreenObject = function(screenObject, stateObject) {
    screenObject.setOffset(stateObject.getOffset());
    screenObject.updateVisibility(stateObject.isVisible());
  };
  
  construct();
};


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
    heightsCache = new Cache(function(element) {
      return Number($(element).css('height').replace(/px$/, ''));
    });
  });

  this.addObject = function(element, type, offset) {
    var id = stateObjects.length;
    console.log(id);

    stateObjects[id] = new DrawerObject(element, type, offset);
    screenObjects[id] = new DrawerObject(element, type, offset);
    
    stateObjectsToRedraw = {};

    return id;
  };

  this.startFrame = function() {
    stateObjectsToRedraw = {};
  };

  this.updateOffset = function(name, newOffset) {
    var stateObject = stateObjects[name];
    if (!stateObject) {
      stateObject.setOffset(newOffset);
      stateObject.updateVisibility(
          visibilityChecker.isVisible(stateObject.getOffset(), heightsCache.get(stateObject.element))
      );

      var screenObject = screenObjects[name];

      if (isRedrawNeeded(stateObject, screenObject, name)) {
        stateObjectsToRedraw[name] = stateObject;
      }
    }
    else {
      console.error('Unknown object id');
    }
  };
  
  this.draw = Utils.delegate(this, function() {
    for (var name in stateObjectsToRedraw) {
      var stateObject = stateObjectsToRedraw[name];
      
      var element = stateObject.getElement();
      
      if (element) {
        if (isHardwareTransformEnabled) {
          element.style[transformPropertyName] =
              'translate' +
              (stateObject.getType() === 'left' ? 'X' : 'Y') +
              '(' + stateObject.getOffset() + 'px)'; 
        }
        else {
          element.style[stateObject.getType()] = stateObject.getOffset() + 'px';
        }
      }

      var screenObject = screenObjects[name];
      updateScreenObject(screenObject, stateObject);
    }
  });

  // TODO remove name
  var isRedrawNeeded = function(stateObject, screenObject, name) {
    var hasVisibilityChanged = stateObject.isVisible() != screenObject.isVisible();
    var hasOffsetChanged = stateObject.getOffset() != screenObject.getOffset(); 

    // TODO create consts for DrawerObject.getType();
    var isRedrawNeededValue = 
        hasVisibilityChanged ||
        (stateObject.isVisible() && hasOffsetChanged) ||
        stateObject.getType() === 'left';

    // TODO remove before release
    if (false && name === '.page0 .layer.starsBack') {
      console.log(stateObject.isVisible() + '!=' + screenObject.isVisible());
      console.log(stateObject.getOffset() + '!=' + screenObject.getOffset());
      console.log(isRedrawNeededValue);
    }

    return isRedrawNeededValue;

    //return true;
  };

  var updateScreenObject = function(screenObject, stateObject) {
    screenObject.setOffset(stateObject.getOffset());
    screenObject.updateVisibility(stateObject.isVisible());
  };
  
  construct();
};


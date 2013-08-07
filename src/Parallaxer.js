goog.provide('andrzejdus.parallaxer.Parallaxer');

goog.require('andrzejdus.parallaxer.ParallaxerEvent');
goog.require('andrzejdus.parallaxer.drawer.Drawer');
goog.require('andrzejdus.utils.RequestAnimationFrame');
goog.require('andrzejdus.utils.Log');
goog.require('andrzejdus.utils.Looper');
goog.require('andrzejdus.utils.Utils');
goog.require('andrzejdus.utils.events.EventsManager');

/** @constructor */
var Parallaxer = function(initialScrollPosition) {
  var eventsManager = null;

  var areAllElementsInitialized = null;

  var currentScrollPosition = null;
  var targetScrollPosition = null;

  var isSmoothScrollEnabled = null;
  
  var objects = []; 

  var drawer = new Drawer();
  var looper = null;
  var onLoopFrameHook = null;
  
  var construct = Utils.delegate(this, function() {
    if (initialScrollPosition == undefined) {
      currentScrollPosition = 0;
      targetScrollPosition = 0;
    } else {
      currentScrollPosition = initialScrollPosition;
      targetScrollPosition = initialScrollPosition;
    }

    eventsManager = new EventsManager();
    eventsManager.registerType(ParallaxerEvent.CURRENT_POSITION_CHANGED);
    eventsManager.registerType(ParallaxerEvent.TARGET_POSITION_CHANGED);
    eventsManager.registerType(ParallaxerEvent.AFTER_FIRST_DRAW);
    
    areAllElementsInitialized = false;

    isSmoothScrollEnabled = false;

    looper = new Looper(onLoopFrame);
  });
  
  /*
   * 
   * Public methods
   *
   */

  /*
   * Registers event listener for given event type.
   */
  this.addEventListener = function(type, listener) {
    eventsManager.addEventListener(type, listener);
  };

  /*
   * Unregisters given event listener for given event type.
   */
  this.removeEventListener = function(type, listener) {
    eventsManager.removeEventListener(type, listener);
  };

  /*
   * Registers DOM element to be scrolled by parallaxer.
   *
   * Arguments control scrolling parameters for element.
   */
  this.addElement = function(element, speed, scrollOffset, type) {
    var object = null;

    if (element) {
      // TODO shouldn't this object have definition?
      object = {
          'id': objects.length,
          'element': element,
          'speed': speed,
          'type': type,
          'scrollOffset': scrollOffset
      };
      
      objects.push(object);
    }

    areAllElementsInitialized = false;

    return object;
  };

  this.refresh = function() {
    draw(0, true);
  };

  /*
   * Returns current smooth scroll state.
   */
  this.isSmoothScrollEnabled = function() {
    return isSmoothScrollEnabled;
  };

  /*
   * Enables or disables smooth scroll.
   */
  this.setSmoothScrollEnabled = function(value) {
    isSmoothScrollEnabled = value;
  };

  /*
   * Gets current scroll position, i.e. position on which registered elements were last drawn.
   */
  this.getCurrentScrollPosition = function() {
    return currentScrollPosition;
  };

  /*
   * Gets target scroll position, i.e. position to which elements are scrolled.
   */
  this.getTargetScrollPosition = function() {
    return targetScrollPosition;
  };

  /*
   * Sets target scroll position, i.e. position to which elements are scrolled.
   */
  this.setTargetScrollPosition = function(value) {
    if (targetScrollPosition !== value) {
      targetScrollPosition = value;

      eventsManager.dispatch(ParallaxerEvent.TARGET_POSITION_CHANGED,
          new ParallaxerEvent('scroll', targetScrollPosition));

      if (areAllElementsInitialized) {
        looper.start();
      }
    }
  };

  /*
   * Sets callback that gets executed on every frame draw.
   */
  this.setLoopFrameHook = function(callback) {
      onLoopFrameHook = callback;
  };

  /*
   *
   * Private methods
   *
   */

  var initializeObjects = function() {
    for (var key in objects) {
      var object = objects[key];
      var element = object.element;

      var initialVisiblePosition = 0;
      var elementCssPosition =
          Utils.getComputedStyle(element, object.type == Parallaxer.HORIZONTAL ? 'left' : 'top');
      if (elementCssPosition !== 'auto') {
        initialVisiblePosition += Number(elementCssPosition.replace(/px/, ''));
        element.style[object.type == Parallaxer.HORIZONTAL ? 'left' : 'top'] = '0';
      }
      
      object['initialVisiblePosition'] = initialVisiblePosition;

      drawer.addObject(
          object.id,
          element,
          object.type === Parallaxer.HORIZONTAL ? DrawerObject.HORIZONTAL : DrawerObject.VERTICAL,
          0
      );
    }
  };

  var onLoopFrame = function(deltaTime) {
    var hasChanged = draw(deltaTime, false);

    // stops loop if nothing has changed in last frame
    if (hasChanged === false) {
      looper.stop();
    }

    if (onLoopFrameHook) {
        onLoopFrameHook(deltaTime);
    }
  };


  var draw = function(deltaTime, forceUpdate) {
    var deltaPosition = targetScrollPosition - currentScrollPosition;
    var absDeltaPosition = Math.abs(deltaPosition);

    var hasChanged = false;
    if (absDeltaPosition > 0.2 || forceUpdate) {
      if (areAllElementsInitialized === false) {
        initializeObjects();
      }

      hasChanged = true;

      if (isSmoothScrollEnabled) {
        var change = deltaPosition / 30 * (deltaTime / (1000 / 60));
        
        if (Math.abs(change) < 1) {
          change = (change > 0 ? 1 : -1) * 1;
        }
        currentScrollPosition += change;
        
        if (absDeltaPosition - Math.abs(change) < 0) {
          currentScrollPosition = targetScrollPosition;
        }
      }
      else {
        currentScrollPosition = targetScrollPosition;
      }
      
      eventsManager.dispatch(ParallaxerEvent.CURRENT_POSITION_CHANGED,
          new ParallaxerEvent('loop', currentScrollPosition));

      drawer.startFrame();
      updateOffsets(currentScrollPosition);
      drawer.draw();

      if (areAllElementsInitialized === false) {
        areAllElementsInitialized = true;

        eventsManager.dispatch(ParallaxerEvent.AFTER_FIRST_DRAW,
            new ParallaxerEvent('draw', currentScrollPosition));
      }
    }
    
    return hasChanged;
  };

  var updateOffsets = function(newScrollPosition) {
    for (var key in objects) {
      var object = objects[key];
      
      var offset = Math.floor(
          object.initialVisiblePosition +
          (object.scrollOffset - newScrollPosition) * object.speed
      );
      
      drawer.updateOffset(object.id, offset);
    }
  };

  construct();
};

Parallaxer.HORIZONTAL = 'horizontal';
Parallaxer.VERTICAL = 'vertical';

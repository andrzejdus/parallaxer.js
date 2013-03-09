goog.provide('andrzejdus.parallaxer.ScrollParallaxer');

goog.require('andrzejdus.parallaxer.ScrollParallaxerEvent');
goog.require('andrzejdus.parallaxer.drawer.Drawer');
goog.require('andrzejdus.utils.RequestAnimationFrame');
goog.require('andrzejdus.utils.Log');
goog.require('andrzejdus.utils.Looper');
goog.require('andrzejdus.utils.Utils');
goog.require('andrzejdus.utils.events.EventsManager');

/** @constructor */
var ScrollParallaxer = function(initialScrollPosition) {
  var eventsManager = null;

  var isStarted = null;

  var currentScrollPosition = null;
  var targetScrollPosition = null;

  var isSmoothScrollEnabled = null;
  
  var objects = []; 

  var drawer = new Drawer();
  var looper = null;
  
  var construct = Utils.delegate(this, function() {
    currentScrollPosition = initialScrollPosition;
    targetScrollPosition = initialScrollPosition;

    eventsManager = new EventsManager();
    eventsManager.registerType(ScrollParallaxerEvent.CURRENT_POSITION_CHANGED);
    eventsManager.registerType(ScrollParallaxerEvent.TARGET_POSITION_CHANGED);
    eventsManager.registerType(ScrollParallaxerEvent.AFTER_FIRST_DRAW);
    
    isStarted = false;

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
  // TODO rename to addElement
  this.add = function(element, speed, scrollOffset, type) {
    var object = null;

    if (element) {
      object = {
          'id': objects.length,
          'element': element,
          'speed': speed,
          'type': type,
          'scrollOffset': scrollOffset
      };
      
      objects.push(object);
    }

    return object;
  };

  /*
   * Initializes parallaxer and draws registered elements for the first time.
   *
   * After calling this function parallaxer can be started and stopped.
   */
  // TODO rename to initialize
  this.init = function() {
    initObjects();

    draw(0, true);
      
    eventsManager.dispatch(ScrollParallaxerEvent.AFTER_FIRST_DRAW,
            new ScrollParallaxerEvent('draw', currentScrollPosition));
  };

  /*
   * Starts parallaxer.
   */
  this.start = function() {
    if (isStarted === false) {
      isStarted = true;

      $(window).on('scroll', onScroll);
      $(window).on('resize', onResize);
      
      onScroll();
    }
  };

  /*
   * Stops parallaxer.
   */
  this.stop = function() {
    if (isStarted === true) {
      isStarted = false;

      $(window).off('scroll', onScroll);
      $(window).off('resize', onResize);
    }
  };

  /*
   * Returns current smooth scroll state.
   */
  this.getIsSmoothScrollEnabled = function() {
    return isSmoothScrollEnabled;
  };

  /*
   * Enables or disables smooth scroll.
   */
  this.setIsSmoothScrollEnabled = function(value) {
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
    if (document.body !== undefined &&
        document.body.scrollTop != undefined) {
      document.body.scrollTop = value;
    }
    else {
      document.documentElement.scrollTop = value;
    }
  };

  /*
   *
   * Private methods
   *
   */

  var initObjects = function() {
    for (var key in objects) {
      var object = objects[key];
      var element = object.element;

      var initialVisiblePosition = 0;
      var elementCssPosition =
          Utils.getComputedStyle(element, object.type == ScrollParallaxer.HORIZONTAL ? 'left' : 'top');
      if (elementCssPosition !== 'auto') {
        initialVisiblePosition += Number(elementCssPosition.replace(/px/, ''));
        element.style[object.type == ScrollParallaxer.HORIZONTAL ? 'left' : 'top'] = '0';
      }
      
      object['initialVisiblePosition'] = initialVisiblePosition;

      drawer.addObject(
          object.id,
          element,
          object.type === ScrollParallaxer.HORIZONTAL ? DrawerObject.HORIZONTAL : DrawerObject.VERTICAL,
          0
      );
    }
  };

  var draw = Utils.delegate(this, function(deltaTime, forceUpdate) {
    var deltaPosition = targetScrollPosition - currentScrollPosition;
    
    var absDeltaPosition = Math.abs(deltaPosition);

    var hasChanged = false;
    if (absDeltaPosition > 0.2 || forceUpdate) {
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
      
      eventsManager.dispatch(ScrollParallaxerEvent.CURRENT_POSITION_CHANGED,
          new ScrollParallaxerEvent('loop', currentScrollPosition));

      drawer.startFrame();
      updateOffsets(currentScrollPosition);
      drawer.draw();
    }
    
    return hasChanged;
  });

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

  var onLoopFrame = function(deltaTime) {
    var hasChanged = draw(deltaTime, false);

    // stops loop if nothing has changed in last frame
    if (hasChanged === false) {
      looper.stop();
    }
  };

  var onScroll = Utils.delegate(this, function() {
    var value = 
      (document.body !== undefined && document.body.scrollTop !== undefined) ?
          document.body.scrollTop :
          document.documentElement.scrollTop;

    if (targetScrollPosition !== value) {
      targetScrollPosition = value;

      eventsManager.dispatch(ScrollParallaxerEvent.TARGET_POSITION_CHANGED,
          new ScrollParallaxerEvent('scroll', targetScrollPosition));

      looper.start();
    }
  });
  
  var onResize = function() {
    draw(0, true);
  };

  construct();
};

ScrollParallaxer.HORIZONTAL = 'horizontal';
ScrollParallaxer.VERTICAL = 'vertical';

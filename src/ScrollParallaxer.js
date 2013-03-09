goog.provide('andrzejdus.parallaxer.ScrollParallaxer');

goog.require('andrzejdus.parallaxer.ScrollParallaxerEvent');
goog.require('andrzejdus.parallaxer.drawer.Drawer');
goog.require('andrzejdus.utils.AnimationFrame');
goog.require('andrzejdus.utils.Log');
goog.require('andrzejdus.utils.Utils');
goog.require('andrzejdus.utils.events.EventsManager');

/** @constructor */
var ScrollParallaxer = function() {
  var eventsManager = null;

  var isStarted = null;
  var isFirstDraw = null;
  var isLoopRunning = null;

  var currentScrollPosition = null;
  var targetScrollPosition = null;

  var isSmoothScrollEnabled = null;
  
  var objects = []; 

  var requestAnimationFrameFunction = new AnimationFrame().getRequestFunction();

  var drawer = new Drawer(); 
  
  var construct = Utils.delegate(this, function() {
    eventsManager = new EventsManager();
    eventsManager.registerType(ScrollParallaxerEvent.CURRENT_POSITION_CHANGED);
    eventsManager.registerType(ScrollParallaxerEvent.TARGET_POSITION_CHANGED);
    eventsManager.registerType(ScrollParallaxerEvent.AFTER_FIRST_DRAW);
    
    isStarted = false;
    isFirstDraw = true;
    isLoopRunning = false;

    currentScrollPosition = -675 * 1000 / 450;
    targetScrollPosition = currentScrollPosition;
    
    isSmoothScrollEnabled = false;
  });
  
  /*
   * 
   * Public methods
   *
   */

  this.addEventListener = function(type, target) {
    eventsManager.addEventListener(type, target);
  };

  this.removeEventListener = function(type, target) {
    eventsManager.removeEventListener(type, target);
  };

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

  this.init = function() {
    initObjects();

    draw(0, true);
      
    eventsManager.dispatch(ScrollParallaxerEvent.AFTER_FIRST_DRAW,
            new ScrollParallaxerEvent('draw', currentScrollPosition));
  };
  
  this.start = function() {
    if (isStarted === false) {
      isStarted = true;

      $(window).on('scroll', onScroll);
      $(window).on('resize', onResize);
      
      onScroll();
    }
  };
  
  this.stop = function() {
    if (isStarted === true) {
      isStarted = false;

      $(window).off('scroll', onScroll);
      $(window).off('resize', onResize);
    }
  };

  this.getIsSmoothScrollEnabled = function() {
    return isSmoothScrollEnabled;
  };
  
  this.setIsSmoothScrollEnabled = function(value) {
    isSmoothScrollEnabled = value;
  };
  
  this.getCurrentScrollPosition = function() {
    return currentScrollPosition;
  };
  
  this.getTargetScrollPosition = function() {
    return targetScrollPosition;
  };

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

  var startLoop = function() {
    if (isLoopRunning === false) {
      isLoopRunning = true;

      var lastTime = null;
      var deltaTime = null;
      
      (function loop() {
        if (isLoopRunning === true) {
          var time = new Date().getTime();
          
          if (lastTime === null) {
            lastTime = time - 1;
          }
          
          deltaTime = time - lastTime;

          requestAnimationFrameFunction(loop);

          var hasChanged = draw(deltaTime, false); 

          if (hasChanged === false) {
            stopLoop();
          }

          lastTime = time;
        }
      })();
    }
  };

  var stopLoop = function() {
    isLoopRunning = false;
  };
  
  var draw = Utils.delegate(this, function(deltaTime, forceUpdate) {
    var deltaPosition = targetScrollPosition - currentScrollPosition;
    
    var absDeltaPosition = Math.abs(deltaPosition);

    var hasChanged = false;
    if (absDeltaPosition > 0.2 || forceUpdate) {
      hasChanged = true;

      if (isSmoothScrollEnabled) {
        var change = deltaPosition / 30 * (deltaTime / (1000/60));
        
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

  var onScroll = Utils.delegate(this, function() {
    var value = 
      (document.body !== undefined && document.body.scrollTop !== undefined) ?
          document.body.scrollTop :
          document.documentElement.scrollTop;

    if (targetScrollPosition !== value) {
      targetScrollPosition = value;

      eventsManager.dispatch(ScrollParallaxerEvent.TARGET_POSITION_CHANGED,
          new ScrollParallaxerEvent('scroll', targetScrollPosition));

      startLoop();
    }
  });
  
  var onResize = function() {
    draw(0, true);
  };

  construct();
};

ScrollParallaxer.HORIZONTAL = 'horizontal';
ScrollParallaxer.VERTICAL = 'vertical';

goog.provide('andrzejdus.parallaxer.ScrollParallaxer');

goog.require('andrzejdus.parallaxer.ScrollParallaxerEvent');
goog.require('andrzejdus.parallaxer.drawer.Drawer');
goog.require('andrzejdus.utils.AnimationFrame');
goog.require('andrzejdus.utils.Log');
goog.require('andrzejdus.utils.Utils');
goog.require('andrzejdus.utils.events.EventsManager');

/* TODO
 * - events
 * - pass element to add instead of name
*/

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

//    currentScrollPosition = 0;
    currentScrollPosition = -675 * 1000 / 450;
    targetScrollPosition = currentScrollPosition;
    
    isSmoothScrollEnabled = false;
  });

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
    Log.l('init parallaxer')

    initObjects();

    isFirstDraw = true;
    
    refresh(0, true);
  };
  
  this.start = function() {
    Log.l('stat para')
    if (isStarted === false) {
      isStarted = true;

//      Utils.addEventListener(window, 'scroll', onScroll);
//      Utils.addEventListener(window, 'resize', onResize);
      $(window).on('scroll' , onScroll);
      $(window).on('resize', onResize);
      
      onScroll();
    }
  };
  
  this.stop = function() {
    if (isStarted === true) {
      isStarted = false;

      $(window).off('scroll' ,onScroll);
      $(window).off('resize',onResize);
      
//      Utils.removeEventListener(window, 'scroll', onScroll);
//      Utils.removeEventListener(window, 'resize', onResize);
    }
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
    if (targetScrollPosition !== value) {
      targetScrollPosition = value;
      
      setScrollPosition(targetScrollPosition);
    }
  };
  
  var startLoop = function() {
    if (isLoopRunning === false) {
      Log.l('start loop');
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
          onFrame(deltaTime);

          lastTime = time;
        }
      })();
    }
  };

  var stopLoop = function() {
    Log.l('stop loop');
    isLoopRunning = false;
  };
  
  var onFrame = Utils.delegate(this, function(deltaTime) {
    if (refresh(deltaTime, false) === false) {
      stopLoop();
    }
  });
  
  var delta = null;
  var unsignedDelta = null;
  var hasChanged = false;
  var change = null;
  
  var refresh = Utils.delegate(this, function(deltaTime, forceUpdate) {
    delta = targetScrollPosition - currentScrollPosition;
    
    unsignedDelta = Math.abs(delta);

    hasChanged = false;
    if (unsignedDelta > 0.2 || forceUpdate) {
      hasChanged = true;

      if (isSmoothScrollEnabled) {
        change = delta / 30 * (deltaTime / (1000/60));
        
        if (Math.abs(change) < 1) {
          change = (change > 0 ? 1 : -1) * 1;
        }
        // console.log(change + '/' + delta + '/' +deltaTime);
        currentScrollPosition += change;
        
        if (unsignedDelta  - Math.abs(change) < 0) {
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
      
      draw();
    }
    
    return hasChanged;
  });

  var draw = function() {
    drawer.draw();
  
    if (isFirstDraw === true) {
      eventsManager.dispatch(ScrollParallaxerEvent.AFTER_FIRST_DRAW, new ScrollParallaxerEvent('draw', currentScrollPosition));
      isFirstDraw = false;
    }
  };

  var initObjects = function() {
    for (var key in objects) {
      var object = objects[key];
      var element = object.element;

      var initialVisiblePosition = 0;
      var elementCssPosition = element.css(object.type == ParallaxerGroup.HORIZONTAL ? 'left' : 'top');
      if (elementCssPosition !== 'auto') {
        initialVisiblePosition += Number(elementCssPosition.replace(/px/, ''));
        element.css(object.type == ParallaxerGroup.HORIZONTAL ? 'left' : 'top', '0');
      }
      
      object['initialVisiblePosition'] = initialVisiblePosition;

      object.drawerObjectId = drawer.addObject(element, object.type == ParallaxerGroup.HORIZONTAL ? 'left' : 'top', 0);
    }
  };

  var updateOffsets = function(newScrollPosition, forceUpdate) {
    for (var key in objects) {
      var object = objects[key];
      
      var offset = Math.floor(
          object.initialVisiblePosition +
          (object.scrollOffset - newScrollPosition) * object.speed
      );
      
      drawer.updateOffset(object.element, offset);
    }
  };

  var onScroll = Utils.delegate(this, function() {
    targetScrollPosition = getScrollPosition(); 
   
    eventsManager.dispatch(ScrollParallaxerEvent.TARGET_POSITION_CHANGED, new ScrollParallaxerEvent('scroll', targetScrollPosition));
  
    startLoop();
  });
  
  var onResize = function() {
    refresh(targetScrollPosition, true);
  };
  
  var getScrollPosition = function() {
    return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
  };
  
  var setScrollPosition = function(value) {
    document.getElementsByTagName('body')[0].scrollTop = value;
  };
  
  construct();
};

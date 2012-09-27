goog.provide('andrzejdus.parallaxer.drawer.VisibilityChecker');

var VisibilityChecker = function() {
  var windowTop = null;
  var windowBottom = null;
  
  var construct = Utils.delegate(this, function() {
    updateWindowBounds();
    $(window).on('resize', onResize);
  });

  this.isVisible = function(top, bottom) {
    //console.log(top + "/" + bottom);
    var isVisible = false;

    if ((top >= windowTop && top <= windowBottom)  ||
        (bottom >= windowTop && bottom <= windowBottom) ||
        (top < windowTop && bottom > windowBottom)) {
      isVisible = true;
    }

    return isVisible;
  };
  
  var onResize = function() {
    updateWindowBounds();
  };
  
  var updateWindowBounds = function() {
    windowTop = 0;
    windowBottom = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
    console.log(windowBottom);
  };
  
  construct();
};

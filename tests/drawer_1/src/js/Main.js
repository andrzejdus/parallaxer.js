goog.provide('test.Main');

goog.require('andrzejdus.parallaxer.ScrollParallaxer');

var Main = function() {
  var scrollParallaxer = new ScrollParallaxer();

  scrollParallaxer.add($('.testElement1', 1.5, 0));
  scrollParallaxer.init();
};

goog.exportSymbol('Main', Main);

goog.provide('test.Main');

goog.require('andrzejdus.parallaxer.ScrollParallaxer');

var Main = function() {
  $(window).ready(function onWindowReady() {
    var scrollParallaxer = new ScrollParallaxer();

    scrollParallaxer.add(document.getElementById('testElement1'), 1.5, 0, ScrollParallaxer.VERTICAL);
    scrollParallaxer.init();
    scrollParallaxer.start();
  });
};

goog.exportSymbol('Main', Main);

goog.provide('test.Main');

goog.require('andrzejdus.parallaxer.Parallaxer');

var Main = function() {
  $(window).ready(function onWindowReady() {
    var parallaxer = new Parallaxer();

    parallaxer.add(document.getElementById('testElement1'), 1.5, 0, Parallaxer.VERTICAL);
    parallaxer.init();
    parallaxer.start();
  });
};

goog.exportSymbol('Main', Main);

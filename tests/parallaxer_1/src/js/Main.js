goog.provide('test.Main');

goog.require('andrzejdus.parallaxer.Parallaxer');

var Main = function () {
  $(window).ready(function onWindowReady() {
    var pageBottom = $('body').height();
    $('body').height(pageBottom);

    andrzejdus.parallaxer.Parallaxer.setSmoothScrollEnabled(true);
    andrzejdus.parallaxer.Parallaxer.init();
  });
};

goog.exportSymbol('Main', Main);

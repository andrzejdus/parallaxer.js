goog.provide('test.Main');

goog.require('andrzejdus.parallaxer.Parallaxer');

var Main = function() {
  $(window).ready(function onWindowReady() {
    $('body').height(2000);
    var parallaxer = new Parallaxer();

    parallaxer.addElement(document.getElementById('testElement1'), 1.5, 0, Parallaxer.VERTICAL);
    parallaxer.refresh();

    var onScroll = function() {
        var scrollTop = $(window).scrollTop();
        console.log(scrollTop);
        parallaxer.setTargetScrollPosition(scrollTop);
    };

    $(window).scroll(onScroll);
  });
};

goog.exportSymbol('Main', Main);

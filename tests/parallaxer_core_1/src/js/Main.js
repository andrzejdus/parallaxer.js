goog.provide('test.Main');

goog.require('andrzejdus.parallaxer.ParallaxerCore');
goog.require('andrzejdus.utils.Looper');

var Main = function() {
  $(window).ready(function onWindowReady() {
    //$('body').height(2000);
    var parallaxer = new ParallaxerCore();

    for (var i = 0; i < 200; i++) {
        $('body').append('<div id="testElement' + i + '" style="position: fixed; top: 600px; width: ' + (1400 - i * 2) + 'px; height: 800px; background-color: rgb(' + parseInt(255 / (i / 10)) + ', ' + parseInt(255 / (i / 20)) + ', 150)"></div>');
        parallaxer.addElement(document.getElementById('testElement' + i), 1 + 0.2 * i, 0, ParallaxerCore.VERTICAL);
    }
    parallaxer.refresh();

    var fpsCounter = $('<div id="fps-counter" style="position: fixed; top: 0; right: 0;"></div>');
    $('body').append(fpsCounter);

    var framesCounter = 0;
    var startTime = 0;
    parallaxer.setLoopFrameHook(function(deltaTime) {
        if (startTime === 0) {
            startTime = new Date().getTime();
        }

        if (new Date().getTime() - startTime > 500) {
            //console.log(fpsCounter);
            fpsCounter.html((1000/deltaTime).toFixed(1));
            startTime = 0;
        }
    });

    var pos = 0;
    var step = 1;
    var onLoopFrame = function(deltaTime) {
        pos += step;
        if (pos <= 0) {
            step *= -1;
            pos = 0;
        } else if (pos >= 200) {
            step *= -1;
            pos = 200;
        }

        parallaxer.setTargetScrollPosition(pos);
    };

    var looper = new Looper(onLoopFrame);
    looper.start();
  });
};

goog.exportSymbol('Main', Main);

goog.provide('andrzejdus.parallaxer.ParallaxerEvent');

/** @constructor */
var ParallaxerEvent = function(source)  {
  this.source = source;
}

ParallaxerEvent.CURRENT_POSITION_CHANGED = 'current_position_changed';
ParallaxerEvent.TARGET_POSITION_CHANGED = 'target_position_changed';
ParallaxerEvent.AFTER_FIRST_DRAW = 'after_first_draw';
ParallaxerEvent.AFTER_LOOP_STOP = 'after_loop_stop';


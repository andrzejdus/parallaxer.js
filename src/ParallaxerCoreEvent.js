goog.provide('andrzejdus.parallaxer.ParallaxerCoreEvent');

/** @constructor */
var ParallaxerCoreEvent = function (source) {
  this.source = source;
}

ParallaxerCoreEvent.CURRENT_POSITION_CHANGED = 'current_position_changed';
ParallaxerCoreEvent.TARGET_POSITION_CHANGED = 'target_position_changed';
ParallaxerCoreEvent.AFTER_FIRST_DRAW = 'after_first_draw';
ParallaxerCoreEvent.AFTER_LOOP_STOP = 'after_loop_stop';


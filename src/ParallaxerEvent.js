goog.provide('andrzejdus.parallaxer.ParallaxerEvent');

/** @constructor */
var ParallaxerEvent = function(source, position)  {
  this.source = source;
  this.position = position;
}

ParallaxerEvent.CURRENT_POSITION_CHANGED = 'current_position_changed';
ParallaxerEvent.TARGET_POSITION_CHANGED = 'target_position_changed';
ParallaxerEvent.AFTER_FIRST_DRAW = 'after_first_draw';


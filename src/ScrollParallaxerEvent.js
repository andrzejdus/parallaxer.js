goog.provide('andrzejdus.parallaxer.ScrollParallaxerEvent');

/** @constructor */
var ScrollParallaxerEvent = function(source, position)  {
  this.source = source;
  this.position = position;
}

ScrollParallaxerEvent.CURRENT_POSITION_CHANGED = 'current_position_changed';
ScrollParallaxerEvent.TARGET_POSITION_CHANGED = 'target_position_changed';
ScrollParallaxerEvent.AFTER_FIRST_DRAW = 'after_first_draw';


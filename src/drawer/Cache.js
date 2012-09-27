goog.provide('andrzejdus.parallaxer.drawer.Cache');

var Cache = function(onCreate) {
  var cache = {};

  this.get = function(key) {
    var cachedObject = cache[key];

    if (!cachedObject) {
      
      cachedObject = onCreate(key);
      cache[key] = cachedObject;
    }

    return cachedObject;
  };
};

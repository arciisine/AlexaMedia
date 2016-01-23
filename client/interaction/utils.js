var KEY_CODES = require('./key-codes');

var SPEED_MAP = { slow:1, normal:2, fast:3 };

module.exports = {
  keySender : function(keys) {
    keys = Array.isArray(keys) ? keys : Array.prototype.slice.call(arguments, 0);
    return function(queue) {
      return queue.sendKeys(keys);
    }
  },
  timeline : function(action, duration, defaultSpeed) {
    return function(queue, query) {
      var count = SPEED_MAP[query] || SPEED_MAP[defaultSpeed] || SPEED_MAP.normal;
      
      return queue.sendKeys(KEY_CODES.PAUSE, KEY_CODES.PLAY)
        .then(function() {
          return queue.sendKeysRepeat(count, action);    
        })      
        .delay(duration)
        .then(function() {
          return queue.sendKeys(KEY_CODES.PLAY);
        });
    }
  }
};
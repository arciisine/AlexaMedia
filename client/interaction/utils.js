var KEY_CODES = require('./key-codes');

module.exports = {
  keySender : function(keys) {
    keys = Array.isArray(keys) ? keys : Array.prototype.slice.call(arguments, 0);
    return function(queue) {
      return queue.sendKeys(keys);
    }
  },
  timeline : function(action, speed, duration) {
    var keys = [];
    switch (speed) {
      case 'fast': keys = [action,action,action]; break;
      case 'slow': keys = [action]; break;
      default:     keys = [action,action];
    }
    
    return function(queue) {
      return queue.sendKeys(keys)
        .delay(duration)
        .then(function() {
          return queue.sendKeys(KEY_CODES.PLAY);
        });
    }
  }
};
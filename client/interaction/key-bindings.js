var KEY_CODES = require('./key-codes')

var keySender = function(keys) {
  keys = Array.isArray(keys) ? keys : Array.prototype.slice.call(arguments, 0);
  return function(queue) {
    return queue.sendKeys(keys);
  }
}

module.exports = {
  'rewind':      function(queue) {
    return queue.sendKeys(KEY_CODES.REWIND,KEY_CODES.REWIND,KEY_CODES.REWIND)
      .delay(15000)
      .then(function() {
        return queue.sendKeys(KEY_CODES.PLAY);
      });
  },
  'forward':     keySender(KEY_CODES.FAST_FORWARD,KEY_CODES.FAST_FORWARD,KEY_CODES.FAST_FORWARD),
  'play':        keySender(KEY_CODES.PLAY),
  'pause':       keySender(KEY_CODES.PAUSE),
  'back':        keySender(KEY_CODES.BACK),
  'stop':        keySender(KEY_CODES.STOP),
  'home':        keySender(KEY_CODES.HOME),
  'type':        function(queue, query) { return queue.sendKeys(query); },
  'replay':      function(queue) {
    return queue.sendKeys(KEY_CODES.REWIND,KEY_CODES.REWIND,KEY_CODES.REWIND)
      .delay(1000)
      .then(function() {
        return queue.sendKeys(KEY_CODES.PLAY);
      });
  }
}
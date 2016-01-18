var KEY_CODES = require('./keycodes')
var BaseApp = require('./base');

function Netflix() {}
Netflix.prototype = BaseApp.prototype;
Netflix.prototype.pkg = 'com.netflix.ninja/.MainActivity';

Netflix.prototype.after = function(queue, cb) {
  return BaseApp.wait(function() {
      queue.sendKeys([KEY_CODES.DPAD_LEFT, KEY_CODES.DPAD_LEFT,  KEY_CODES.DPAD_LEFT, KEY_CODES.DPAD_CENTER], BaseApp.wait(cb, 5000));
    }, 12000)
}

Netflix.prototype.find = function(queue, query, cb) {
  queue.sendKeys([
    KEY_CODES.DPAD_UP, 
    null,
    null,
    KEY_CODES.DPAD_CENTER, 
    null,
    null,
    query, 
    KEY_CODES.SPACE, 
    KEY_CODES.DEL,
    ], BaseApp.wait(function() {
      queue.sendKeys([
        KEY_CODES.DPAD_RIGHT,
        KEY_CODES.PLAY
      ], cb);
  }, 5000));
}

module.exports = Netflix;
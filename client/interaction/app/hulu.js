var BaseApp = require('./base');
var KEY_CODES = require('../keycodes')

function HuluKeyboardConverter(query) {
  var pos = 14; //N
  var map = {};
  var alpha = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = 0; i < alpha.length; i++) {
    map[alpha.charAt(i)] = i;
  }

  var keys = [KEY_CODES.DPAD_UP, KEY_CODES.DPAD_CENTER, null];
  var chars = query.toUpperCase().split('');
  for (var j = 0; j < chars.length;j++) {
    var nextPos = map[chars[j]];
    var diff = nextPos - pos;
    while(diff > 0) { keys.push(KEY_CODES.DPAD_RIGHT); diff--; }
    while(diff < 0) { keys.push(KEY_CODES.DPAD_LEFT); diff++; }
    keys.push(KEY_CODES[chars[j]], KEY_CODES.DPAD_CENTER);
    pos = nextPos;
  } 
  
  return keys;
}
  
function Hulu() {}
Hulu.prototype = BaseApp.prototype;
Hulu.prototype.pkg = 'com.hulu.plus/com.hulu.livingroomplus.MainActivity';

Hulu.protoype.after = function(queue, cb) {
  return this.wait(cb, 12000);
}

Hulu.prototype.find =  function(queue, query, cb) {
  queue.sendKeys(HuluKeyboardConverter(query), this.wait(function() {
    queue.sendKeys([
      KEY_CODES.DPAD_DOWN,
      KEY_CODES.DPAD_RIGHT,
      KEY_CODES.DPAD_CENTER
    ], cb);
  }, 7000))
}

module.exports = Hulu;


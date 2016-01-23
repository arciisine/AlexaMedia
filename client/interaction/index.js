var KEY_CODES = require('./key-codes')
var appLookup = require('./app');
var utils = require('./utils');


var actions = module.exports = {
  forward :  utils.timeline(KEY_CODES.FAST_FORWARD, 15000, 'fast'),
  skip    :  utils.timeline(KEY_CODES.FAST_FORWARD, 2000, 'slow'),
  pause   :  utils.keySender(KEY_CODES.PAUSE),
  back    :  utils.keySender(KEY_CODES.BACK),
  stop    :  utils.keySender(KEY_CODES.STOP),
  home    :  utils.keySender(KEY_CODES.HOME),
  type    :  function(queue, query) { return queue.sendKeys(query); },
  rewind  :  utils.timeline(KEY_CODES.REWIND, 15000, 'fast'),
  replay  :  utils.timeline(KEY_CODES.REWIND, 1000, 'slow'),
  watch   :  function(queue, query) { return this.play(queue, query); },
  power   :  utils.keySender(KEY_CODES.POWER),
  reboot  :  function(queue, query) {
    var ON_ENTER = queue.sendKeys.bind(queue, KEY_CODES.DPAD_CENTER);

    return queue.sendKeys(KEY_CODES.HOME)
      .delay(2000)
      .then(function() { return queue.sendKeysRepeat(10, KEY_CODES.DPAD_DOWN); })
      .then(ON_ENTER)
      .delay(1000)
      .then(function() { return queue.sendKeysRepeat(4, KEY_CODES.DPAD_RIGHT); })
      .then(ON_ENTER)
      .delay(1000)
      .then(function() { return queue.sendKeysRepeat(8, KEY_CODES.DPAD_DOWN); })
      .then(ON_ENTER)
      .delay(1000)
      .then(function() { return queue.sendKeys(KEY_CODES.DPAD_LEFT); })
      .then(ON_ENTER);
  },
  play    :  function(queue, query) {
    if (query) {
        var app = appLookup(query);  
        if (!app) {
          return console.log("Error: App not found", query);
        }    
        //Tell the adb queue to run the proper commands to open the app
        return app.open(queue);
    } else {
        return queue.sendKeys(KEY_CODES.PLAY);
    }
  }
}
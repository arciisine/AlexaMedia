var KEY_CODES = require('./key-codes')
var appLookup = require('./app');
var utils = require('./utils');

var actions = module.exports = {
  forward :  utils.timeline(KEY_CODES.FAST_FORWARD, 'fast', 15000),
  skip    :  utils.timeline(KEY_CODES.FAST_FORWARD, 'slow', 2000),
  pause   :  utils.keySender(KEY_CODES.PAUSE),
  back    :  utils.keySender(KEY_CODES.BACK),
  stop    :  utils.keySender(KEY_CODES.STOP),
  home    :  utils.keySender(KEY_CODES.HOME),
  type    :  function(queue, query) { return queue.sendKeys(query); },
  rewind  :  utils.timeline(KEY_CODES.REWIND, 'fast', 15000),
  replay  :  utils.timeline(KEY_CODES.REWIND, 'slow', 1000),
  watch   :  function(queue, query) { return this.play(queue, query); },
  power   :  utils.keySender(KEY_CODES.POWER),
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
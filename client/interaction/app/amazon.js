var KEY_CODES = require('./keycodes')
var BaseApp = require('./base');

function Amazon() {}
Amazon.prototype = BaseApp.prototype;
//Amazon.prototype.pkg = 'com.netflix.ninja/.MainActivity';

Amazon.prototype.find = function(queue, query, cb) {
  queue.sendKeys(
    [KEY_CODES.SEARCH], 
    this.wait(function() {
      queue.sendKeys([
        query, KEY_CODES.SPACE, KEY_CODES.DEL, KEY_CODES.DPAD_DOWN
      ] , this.wait(function() {
        queue.sendKeys([KEY_CODES.DPAD_CENTER], cb);
      }, 1000))
    }, 1000));
}
var Q = require('q');
var KEY_CODES = require('../key-codes')
var BaseApp = require('./base');

function Amazon() {}
Amazon.prototype = BaseApp.prototype;
Amazon.prototype.openApp = function(queue) {
  return queue.sendKeys([KEY_CODES.HOME])
    .then(function() {
      return self.afterOpen(queue);
    })
    .then(function() {
      if (self.query) { //If a query is provided
        return self.findAndPlay(queue, self.query);
      }
    });
}

Amazon.prototype.afterOpen = function() {
  return Q.delay(1000);
}

Amazon.prototype.findAndPlay = function(queue, query) {
  return queue.sendKeys(KEY_CODES.SEARCH)
    .delay(1000)
    .then(function() {
      return queue.sendKeys(query, KEY_CODES.SPACE, KEY_CODES.DEL);
    })
    .delay(1000)
    .then(function() {
      return queue.sendKeys(KEY_CODES.DPAD_DOWN, KEY_CODES.DPAD_CENTER);
    })
    .delay(2000)
    .then(function() {
      return queue.sendKeys(KEY_CODES.DPAD_CENTER, KEY_CODES.DPAD_CENTER);
    });
}

module.exports = Amazon;
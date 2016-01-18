var Q = require('q');
var KEY_CODES = require('../key-codes')
var BaseApp = require('./base');

function Netflix() {}
BaseApp.extend(Netflix);

Netflix.prototype.pkg = 'com.netflix.ninja/.MainActivity';

Netflix.prototype.afterOpen = function(queue) {
  return Q()
    .delay(12000)
    .then(function() {
      return queue.sendKeys([KEY_CODES.DPAD_LEFT, KEY_CODES.DPAD_LEFT,  KEY_CODES.DPAD_LEFT, KEY_CODES.DPAD_CENTER])
    })
    .delay(5000)
}

Netflix.prototype.findAndPlay = function(queue, query) {
  return Q.delay(1)
    .then(function() {
      return queue.sendKeys([KEY_CODES.DPAD_UP]);
    })
    .delay(1000)
    .then(function() {
      return queue.sendKeys([KEY_CODES.DPAD_CENTER]);
    }) 
    .delay(1000)
    .then(function() {
      return queue.sendKeys([
        query, 
        KEY_CODES.SPACE, 
        KEY_CODES.DEL
      ]);
    }) 
    .delay(5000)
    .then(function() {
      return queue.sendKeys([
        KEY_CODES.DPAD_RIGHT,
        KEY_CODES.PLAY
      ]);
    })
}

module.exports = Netflix;
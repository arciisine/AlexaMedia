var exec = require('child_process').exec;
var wait = require('./utils').wait;
var KEY_CODES = require('./keycodes');

module.exports = function Queue() {
  var QUEUE = [];
  var running = false;
  var done = false;
  
  var iterate = function() {
    if (done || !QUEUE.length) {
      running = false;
      return;
    }
    
    var top = QUEUE.shift();
    var cmd = 'adb shell '+top[0];
    var cb = top[1];
    exec(cmd, function() {
      if (cb) cb(iterate);
      else    iterate();
    })
  }
    
  var kill = this.kill = function(){
    QUEUE = [];
    running = false;
    done = false;
  }
  
  var add = this.add = function(cmd, cb) {
    QUEUE.push([cmd, cb]);
    if (!running){
      running = true;
      iterate();
    }  
  }
  
  var sendKeys = this.sendKeys = function(keys, cb) {
    function itr() {
      if (done) return;

      if (keys.length === 0) {
        if (cb) cb();
      } else {
        var k = keys.shift();
        if (typeof k === 'number') {
          add('input keyevent '+k, wait(iterate, 1));
        } else {
          add('input text "'+k+'"', wait(iterate, 1));
        }  
      }
    }
    itr();
  }
  
  this.openApp = function(app, cb) {
    if (done) return;
    
    if (app) {
      sendKeys([KEY_CODES.HOME], wait(function() {
        add('am start -n '+app.pkg, function() {
          if (app.after) app.after(cb);
          else {
            cb()
          }
        })
      }, 2000));
    } else {
      console.log("App not found");
    }
  }
}

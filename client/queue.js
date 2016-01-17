var exec = require('child_process').exec;
var wait = require('./utils').wait;
var KEY_CODES = require('./keycodes');

module.exports = function Queue() {
  var QUEUE = [];
  var running = false;
  var done = false;
  var self = this;
    

  var iterate = function() {
    if (done || !QUEUE.length) {
      running = false;
      return;
    }
    
    var top = QUEUE.shift();
    var cmd = 'adb shell '+top[0];
    var cb = top[1];
    console.log(cmd);
    exec(cmd, function() {
      if (cb) cb();
      iterate();
    })
  }
    
  var kill = this.kill = function(){
    QUEUE = [];
    running = false;
    done = false;
  }
  
  var add = this.add = function(cmd, cb) {
    if (done) return;
    
    QUEUE.push([cmd, cb]);
    console.log("Queueing: "+cmd);
    if (!running){
      running = true;
      iterate();
    }  
  }
  
  var sendKeys = this.sendKeys = function(keys, cb) {
    function itr() {
      if (done) return;
        
      if (keys.length === 0) {
        console.log("DOne with key sequence");
        if (cb) cb();
      } else {
        if (keys[0] === null) {
          keys.shift();
          wait(itr, 1);
        } if (typeof keys[0] === 'number') {
          var out = [];
          while (typeof keys[0] === 'number' && out.length < 40) {
            out.push('input keyevent ' + keys.shift());
          }
          add("'" + out.join(';') +"'",  wait(itr, 1));
        } else {
          var out = [];
          while (typeof keys[0] === 'string') {
            out.push(keys.shift().replace(' ', '%s'));
          }
          add('input text "'+out.join('%s')+'"', wait(itr, 1));
        }  
      }
    }
    itr();
  }
  
  this.openApp = function(app, cb) {
    if (done) return;
    
    if (app) {
      add('am start -W -S -a android.intent.action.MAIN -n '+app.pkg, function() {
        if (app.after) app.after(self)(cb);
        else {
          cb()
        }
      })
    } else {
      console.log("App not found");
    }
  }
}

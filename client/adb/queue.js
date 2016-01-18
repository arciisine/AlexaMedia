var exec = require('child_process').exec;
var wait = require('../utils').wait;

function Queue() {
  this._data = [];
}

Queue.prototype.execute = function(cmd, cb) {
  console.log(cmd);
  exec(cmd, cb);
} 

Queue.prototype.run = function() {
  if (!this.execute || !this._data.length) {
    return;
  }
  
  var top = this._data.shift();
  var cmd = 'echo '+top.cmd;
  
  this.execute(cmd, (function() {
    if (top.cb) top.cb();
    this.run();
  }).bind(this))
}

Queue.prototype.kill = function(){
  console.log("Killing queue");
  this.execute = null;    
}
  
Queue.prototype.add = function(cmd, cb) {    
  this._data.push([cmd, cb]);
  console.log("Queueing: "+cmd);
  if (this._data.length === 1){ //If queue was empty, start running
    this.run();
  }  
}

Queue.prototype.sendKeys = function(keys, cb) {
  keys = keys.slice();

  function itr() {
    var out = [];
    
    if (!this.execute) return;      
            
    if (keys.length === 0) {
      console.log("Done with key sequence");
      if (cb) cb();
    } else {
      if (keys[0] === null || typeof keys[0] === 'number' && keys[0] > 1000) {
        keys.shift();
        wait(itr, keys[0] || 30);
      } if (typeof keys[0] === 'number') {
        while (typeof keys[0] === 'number' && out.length < 40) {
          out.push('input keyevent ' + keys.shift());
        }
        this.add("'" + out.join(';') +"'",  wait(itr, 1));
      } else {
        while (typeof keys[0] === 'string') {
          out.push(keys.shift().replace(/ |[^A-Za-z]/g, '%s'));
        }
        this.add('input text "'+out.join('%s')+'"', wait(itr, 1));
      }  
    }
  }
  itr();
}

Queue.prototype.openApp = function(activity, cb) {
  if (!this.execute) return;
  
  this.add('am start -W -S -a android.intent.action.MAIN -n '+activity, cb);
}

module.exports = Queue;
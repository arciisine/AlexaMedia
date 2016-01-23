var exec = require('child_process').exec;
var Q = require('q');

function Queue() {
  this._data = [];
}

Queue.prototype.execute = function(cmd) {
  console.log(cmd);
  return Q.nfcall(exec, cmd);
} 

Queue.prototype.run = function() {
  if (!this.execute || !this._data.length) {
    return;
  }
  
  var top = this._data.shift();
  var cmd = 'adb shell '+top.cmd;
  
  return this.execute(cmd)
    .then(
      top.def.resolve.bind(top.def), 
      top.def.reject.bind(top.def)
    )
    .then(this.run.bind(this))
}

Queue.prototype.kill = function(){
  console.log("Killing queue");
  this.execute = null;    
}
  
Queue.prototype.add = function(cmd) {
  var def = Q.defer();  
  this._data.push({cmd:cmd, def:def}  );
  console.log("Queueing: "+cmd);
  if (this._data.length === 1){ //If queue was empty, start running
    process.nextTick(this.run.bind(this));
  }  
  return def.promise;
}

Queue.prototype._sendKeySet = function(keys, defer) {
  if (!this.execute) return; 
  
  var out = [];
  var itr = this._sendKeySet.bind(this, keys, defer);
              
  if (keys.length === 0) { //Done
    defer.resolve();    
  } else {
    if (typeof keys[0] === 'number') { //If a keycode
      while (typeof keys[0] === 'number' && out.length < 40) {
        out.push('input keyevent ' + keys.shift());
      }
      this.add("'" + out.join(';') +"'").then(itr);
    } else if (typeof keys[0] === 'string') { //If a text string
      while (typeof keys[0] === 'string') {
        //Remove all non letter characters
        // Replace spaces with '%s'
        out.push(keys.shift().replace(/ |[^A-Za-z]/g, '%s')); 
      }
      this.add('input text "'+out.join('%s')+'"').then(itr);
    } else {
      console.log("Unknown item", keys[0]);
      keys.shift();
      process.nextTick(itr);
    }  
  }
}

Queue.prototype.sendKeys = function(keys) {
  var def = Q.defer();
  keys = Array.isArray(keys) ? keys : Array.prototype.slice.call(arguments, 0);  
  process.nextTick(this._sendKeySet.bind(this, keys.slice(), def));
  return def.promise;
}

Queue.prototype.sendKeysRepeat = function(n, keys) {
  keys = Array.isArray(keys) ? keys : Array.prototype.slice.call(arguments, 1);
  
  var out = [];
  for (var i = 0; i < n; i++) {
    out = out.concat(keys);
  }
  
  return this.sendKeys(out);
}

Queue.prototype.openApp = function(activity) {
  if (!this.execute) return;
  return this.add('am start -W -S -a android.intent.action.MAIN -n '+activity);
}

module.exports = Queue;
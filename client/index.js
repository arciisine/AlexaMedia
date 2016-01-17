var KEY_CODES = require('./keycodes.js');
var listener = require('./listener');
var Queue = require('./queue');
var wait = require('./utils').wait;
var connect = require('./local-connect');

var APP_MAPPINGS = {
  netflix : {
    pkg : 'com.netflix.ninja/.MainActivity',
    after :function(queue) {
      return wait(function(cb) {
        queue.sendKeys([KEY_CODES.DPAD_CENTER], cb);
      }, 12000)
    }
  },
  hulu : {
    pkg : 'com.hulu.plus/com.hulu.livingroomplus.MainActivity',
    after : function(queue) {
      return wait(function(cb) {
        if (cb) cb();
      }, 12000);
    } 
  },
}

var KEY_MAPPING = {
  'rewind':      [KEY_CODES.REWIND],
  'fastforward': [KEY_CODES.FAST_FORWARD],
  'play':        [KEY_CODES.PLAY],
  'pause':       [KEY_CODES.PAUSE],
  'back':        [KEY_CODES.BACK],
  'stop':        [KEY_CODES.STOP],
  'home':        [KEY_CODES.HOME]
}


function doSearch(queue, query, cb) {
  queue.sendKeys([KEY_CODES.SEARCH], wait(function() {
    queue.sendKeys([
      query, KEY_CODES.SPACE, KEY_CODES.DEL, KEY_CODES.DPAD_DOWN
    ] , wait(function() {
      queue.sendKeys([KEY_CODES.DPAD_CENTER], cb);
    }, 1000))
  }, 1000));
}

function playNetflix(queue, query, cb) {
  queue.openApp(APP_MAPPINGS.netflix, wait(function() {
     queue.sendKeys([
       KEY_CODES.DPAD_UP, 
       null,
       KEY_CODES.DPAD_CENTER, 
       null,
       query, 
       KEY_CODES.SPACE, 
       KEY_CODES.DEL,
      ], wait(function() {
        queue.sendKeys([
          KEY_CODES.DPAD_RIGHT,
          KEY_CODES.PLAY
        ], cb);
     }, 5000))
  }, 2000));
}

function playHulu(queue, query, cb) {
  var pos = 14; //N
  var map = {};
  var alpha = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = 0; i < alpha.length; i++) {
    map[alpha.charAt(i)] = i;
  }
  
  function convertTextIntoKeys() {
    var keys = [KEY_CODES.DPAD_UP, KEY_CODES.DPAD_CENTER];
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
  
  queue.openApp(APP_MAPPINGS.hulu, wait(function() {
    queue.sendKeys(convertTextIntoKeys(query), wait(function() {
      queue.sendKeys([
        KEY_CODES.DPAD_DOWN,
        KEY_CODES.DPAD_RIGHT,
        KEY_CODES.DPAD_CENTER
      ], cb);
    }, 7000))
  }, 2000));
}

var queue;

function onAction(action, query) {
  if (queue) queue.kill();
  queue = new Queue();
  
  switch(action) {

    case 'type':         
      return queue.sendKeys([query]);
    case 'netflix':
      return playNetflix(queue, query);
    case 'hulu':
      return playHulu(queue, query);    
    case 'find':
      return doSearch(queue, query);
    case 'start':
    case 'launch':
    case 'open':
        queue.openApp(APP_MAPPINGS[query.unshift()]);
        break;
    default:
      return queue.sendKeys(KEY_MAPPING[action] || []);
  }
}

connect(function(err, res) {
  if (err) {
    console.log("ERror", err);
  } else {
    listener(onAction);
  }
});
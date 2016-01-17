var KEY_CODES = require('./keycodes.js');
var listener = require('./listener');
var Queue = require('./queue');
var wait = require('./utils').wait;

var APP_MAPPINGS = {
  netflix : {
    pkg : 'com.netflix.ninja/.MainActivity',
    after : wait(function(queue, cb) {
      queue.sendKeys([KEY_CODES.ENTER], cb);
    }, 12000)
  },
  hulu : {
    pkg : 'com.hulu.plus/com.hulu.livingroomplus.MainActivity' 
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
      query.join('%s'),
      KEY_CODES.SPACE, KEY_CODES.DEL, KEY_CODES.DPAD_DOWN
    ] , wait(function() {
      queue.sendKeys([KEY_CODES.ENTER], cb);
    }, 1000))
  }, 1000));
}

function playNetflix(queue, query, cb) {
  queue.openApp(APP_MAPPINGS.netflix, wait(function() {
     queue.sendKeys([
       KEY_CODES.DPAD_UP, 
       KEY_CODES.ENTER, 
       query.join('%s'), 
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

var queue;

function onAction(action, query) {
  if (queue) queue.kill();
  queue = new Queue();
  
  switch(action) {

    case 'type':         
      return queue.sendKeys([query.join('%s')]);
    case 'netflix':
      if (query[0] == 'play') query.shift();
      return playNetflix(query);
    case 'find':
      return doSearch(query);
    case 'start':
    case 'launch':
    case 'open':
        queue.openApp(APP_MAPPINGS[query.unshift()]);
        break;
    default:
      return queue.sendKeys(KEY_MAPPING[action] || []);
  }
}

listener(onAction);
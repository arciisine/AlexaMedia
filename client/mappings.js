var KEY_CODES = require('./keycodes.js');
var wait  = require('./utils').wait;

module.exports.extractApp = function getApp(query) {
  var app = 'netflix';
  query = query.replace(/(on|with|in)? (hulu|netflix|amaon)/g, function(all, pre, appFound) {
    app = appFound;
    return '';
  }).replace(/^\s+|\s+$/g, '');
  return {app:APP_MAPPINGS[app.toLowerCase()], query:query};
}

var APP_MAPPINGS = module.exports.APP_MAPPINGS = {
  amazon : {
    find : function(queue, query, cb) {
      queue.sendKeys([KEY_CODES.SEARCH], wait(function() {
        queue.sendKeys([
          query, KEY_CODES.SPACE, KEY_CODES.DEL, KEY_CODES.DPAD_DOWN
        ] , wait(function() {
          queue.sendKeys([KEY_CODES.DPAD_CENTER], cb);
        }, 1000))
      }, 1000));
    }
  },
  netflix : {
    pkg : 'com.netflix.ninja/.MainActivity',
    after :function(queue) {
      return wait(function(cb) {
        queue.sendKeys([KEY_CODES.DPAD_LEFT, KEY_CODES.DPAD_LEFT,  KEY_CODES.DPAD_LEFT, KEY_CODES.DPAD_CENTER], wait(cb, 5000));
      }, 12000)
    },
    find :function(queue, query, cb) {
      queue.sendKeys([
        KEY_CODES.DPAD_UP, 
        null,
        null,
        KEY_CODES.DPAD_CENTER, 
        null,
        null,
        query, 
        KEY_CODES.SPACE, 
        KEY_CODES.DEL,
        ], wait(function() {
          queue.sendKeys([
            KEY_CODES.DPAD_RIGHT,
            KEY_CODES.PLAY
          ], cb);
      }, 5000));
    }
  },
  hulu : {
    pkg : 'com.hulu.plus/com.hulu.livingroomplus.MainActivity',
    after : function(queue) {
      return wait(function(cb) {
        if (cb) cb();
      }, 12000);
    },
    find : function(queue, query, cb) {
      var pos = 14; //N
      var map = {};
      var alpha = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (var i = 0; i < alpha.length; i++) {
        map[alpha.charAt(i)] = i;
      }
      
      function convertTextIntoKeys() {
        var keys = [KEY_CODES.DPAD_UP, KEY_CODES.DPAD_CENTER, null];
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
      
      queue.sendKeys(convertTextIntoKeys(query), wait(function() {
        queue.sendKeys([
          KEY_CODES.DPAD_DOWN,
          KEY_CODES.DPAD_RIGHT,
          KEY_CODES.DPAD_CENTER
        ], cb);
      }, 7000))
    }
  },
}

var KEY_MAPPING = module.exports.KEY_MAPPING = {
  'rewind':      [KEY_CODES.REWIND,KEY_CODES.REWIND,KEY_CODES.REWIND],
  'forward':     [KEY_CODES.FAST_FORWARD,KEY_CODES.FAST_FORWARD,KEY_CODES.FAST_FORWARD],
  'play':        [KEY_CODES.PLAY],
  'pause':       [KEY_CODES.PAUSE],
  'back':        [KEY_CODES.BACK],
  'stop':        [KEY_CODES.STOP],
  'home':        [KEY_CODES.HOME]
}

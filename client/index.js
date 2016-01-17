var KEY_CODES = require('./keycodes.js');
var listener = require('./listener');

var exec = require('child_process').exec;

var APP_MAPPINGS = {
  netflix : {
    pkg : 'com.netflix.ninja/.MainActivity',
    after : function() {
      sendKeys([KEY_CODES.ENTER])
    }
  },
  hulu : {
    pkg : 'com.hulu.livingroomplus/.MainActivity' 
  },
}


function adb(cmd, after) {
  cmd = 'adb shell '+cmd;
  return exec(cmd, function(err, res) {
    if (after) after();
  }); 
}

function sendKeys(keys) {
  keys.forEach(function(k) {
    if (typeof k === 'number') {
      adb('input keyevent '+k);
    } else {
      adb('input text "'+k+'"');
    }
  });
}

function openApp(app) {
  if (app) {
    return adb('am start -n '+app.pkg, app.after);
  } else {
    console.log("App not found");
  }
}

function onAction(action, query) {
  var parts = query.split(' ');
  
  switch(action) {
    case 'play':
      break;
    case 'pause':
      break;
    case 'stop':
      break;
    case 'start':
    case 'launch':
    case 'open':
      openApp(APP_MAPPINGS[parts.shift()]);
      break;
    case 'find':
      break;
  }
}

listener(onAction);
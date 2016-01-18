var AdbQueue = require('./adb/queue');
var adbConnect = require('./adb/connect');
var firebaseListen = require('./firebase/listen');
var interaction = require('./interaction');

var queue;

function onAction(action, query) {
  if (queue) {
    //Kill any running operations, one queue per request
    queue.kill();
    queue = null;
  }
  
  queue = new AdbQueue();
  //Otherwise try to call key of whatever command came in
  var operator = interaction[action];
  if (operator) {
    return operator(queue, query).then(function() {
      queue = null;
    }); 
  } else {
    console.log("Unknown action", action, query);
  }
}

adbConnect().then(
  firebaseListen.bind(null, onAction),
  function(err) {
    console.log("Error", err);
    process.exit(1);
  }
);
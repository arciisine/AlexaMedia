var AdbQueue = require('./adb/queue');
var adbConnect = require('./adb/connect');
var firebaseListen = require('./firebase/listen');
var interaction = require('./interaction');

var queue;

function onAction(action, query) {
  if (queue) {
    //Kill any running operations
    queue.kill();
  }
  queue = new AdbQueue();
  
  if (action === 'play' && query) {
      //Lookup app from query (uses default if app not specified)
      var app = interaction.appLookup(query);  
      if (!app) {
        return console.log("Error: App not found", action, query);
      }    
      //Tell the adb queue to run the proper commands to open the app
      return app.open(queue);
  } else if (action === 'type') {
    //Type out text into form
    return queue.sendKeys([query]);
  } else {
    //Otherwise try to call key of whatever command came in
    return queue.sendKeys(interaction.keyLookup[action] || []);
  }
}

adbConnect().then(
  function() {
    firebaseListen(onAction);
  },
  function(err) {
    console.log("Error", err);
    process.exit(1);
  }
);
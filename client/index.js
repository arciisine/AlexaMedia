var listener = require('./listener');
var Queue = require('./queue');
var wait = require('./utils').wait;
var connect = require('./local-connect');
var mappings = require('./mappings');

var queue;

function onAction(action, query) {
  if (queue) queue.kill();
  queue = new Queue();
  
  switch(action) {
    case 'play':
      if (!query) {
          return queue.sendKeys(mappings.KEY_MAPPING[action] || []);
      }
      
      var item = mappings.extractApp(query);      
      var cb = function() {}
      if (item.query) {
        cb = function() {
          item.app.find(queue, item.query);
        }
      }
      return queue.openApp(item.app, cb);
    case 'type':  return queue.sendKeys([query]);
    default:
      return queue.sendKeys(mappings.KEY_MAPPING[action] || []);
  }
}

connect(function(err, res) {
  if (err) {
    console.log("ERror", err);
  } else {
    listener(onAction);
  }
});
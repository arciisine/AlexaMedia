var Firebase = require('firebase');

var config = require('../config.json').firebase;
var ref = new Firebase("https://"+config.namespace+".firebaseio.com/"+config.topic);
var listeners = [];

function start() {
  ref.authWithCustomToken(config.secret, function(err, res) {
    
    // Listen for changes to our firebase data store
    ref.on("child_added", function(item) {
      //Read action/query from event
      var act = (item.val().action || '').toLowerCase();
      var query = (item.val().query || '').toLowerCase();
      
      //Consume message
      ref.child(item.key()).remove();
      
      //Run listeners
      console.log("RECEIVED:", act, query);
      listeners.forEach(function(f) {
        try {
          f(act, query);
        } catch (e) {
          console.log("Error", e);
        }
      })
    });  
  });
}

module.exports = function(fn) {
  if (listeners.length === 0) {
    start();
  }
  listeners.push(fn);
}
var Firebase = require('firebase');

var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json'));
var ref = new Firebase("https://"+config.namespace+".firebaseio.com/"+config.topic);

var listeners = [];

ref.authWithCustomToken(config.secret, function(err, res) {
  // Listen for changes to the Bitcoin price
  ref.on("child_added", function(item) {
    // Print the value on the LCD
    var act = (item.val().action || '').toLowerCase();
    var query = (item.val().query || '').toLowerCase();
    
    ref.child(item.key()).remove();
    console.log("RECEIVED:", act, query);
    listeners.forEach(function(f) {
      f(act, query);
    })
  });  
});

module.exports = function(fn) {
  listeners.push(fn);
}
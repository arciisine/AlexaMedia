var Firebase = require('firebase');
var config = JSON.parse(require('fs').readFileSync('config.json'));
var ref = new Firebase("https://"+config.namespace+".firebaseio.com/"+config.topic);

ref.authWithCustomToken(config.secret, function(err, res) {
  // Listen for changes to the Bitcoin price
  ref.on("child_added", function(item) {
    // Print the value on the LCD
    console.log(item.val().action);
    ref.child(item.key()).remove();
  });  
});
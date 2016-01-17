var Firebase = require('firebase');
var ref = new Firebase("https://scorching-fire-5002.firebaseio.com/actions");

ref.authWithCustomToken('', function(err, res) {
  // Listen for changes to the Bitcoin price
  ref.on("child_added", function(item) {
    // Print the value on the LCD
    console.log(item.val().action);
    ref.child(item.key()).remove();
  });  
});
var myFirebaseRef = 
new Firebase("https://publicdata-cryptocurrency.firebaseio.com/dogecoin");
lcd.on("ready", function() {
  // Listen for changes to the Bitcoin price
  myFirebaseRef.child("last").on("value", function(snap) {
    // Print the value on the LCD
    lcd.cursor(1, 1).clear().print("Doge: " + snap.val());
  });
});
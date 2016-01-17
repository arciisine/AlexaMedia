var https = require('https');
var URLParser = require('url');

var config = {}//;

exports.handler = function (event, context) {
  try {
    var host = config.namespace + '.firebaseio.com';
    var path = '/'+config.topic+'.json?auth='+config.secret;
      
    var query = event.request.intent.slots.query.value;
    var message = { action : query }; 
    var data = JSON.stringify(message);        
              
    // An object of options to indicate where to post to
    var post_options = {
      host: host,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    // Initiate the request to the HTTP endpoint
    var req = https.request(post_options,function(res) {
      // Data may be chunked
      res.on('data', function() {}); //Do nothing
      res.on('end', function() {
        // When data is done, finish the request
        context.succeed({
          "version": "1.0",
          "response": {
            "card": {
              "type": "Simple",
              "title": "Media Control",
              "content": query
            },
            "shouldEndSession": true
          }        
        });
      });
    });
    
    req.on('error', function(e) {
      context.fail('problem with request: ' + e.message);
    });
    
    // Send the JSON data
    req.write(data);
    req.end();        
  } catch (e) {
    context.fail("Exception: " + e);
  }
};
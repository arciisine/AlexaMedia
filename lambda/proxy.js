var https = require('https');

module.exports = function proxyRequest(config, message, success, failure) {
  var host = config.namespace + '.firebaseio.com';
  var path = '/'+config.topic+'.json?auth='+config.secret;

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
      success()
    });
  });
  
  req.on('error', function(e) {
    failure(e.message);
  });
  
  // Send the JSON data
  req.write(data);
  req.end();
} 

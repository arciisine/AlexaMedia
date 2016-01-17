var https = require('https');
var URLParser = require('url');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.handler = function (event, context) {
    try {
        // A list of URL's to call for each applicationId
        var handlers = {
            //'appId':'url',
            'amzn1.echo-sdk-ams.app.1d56a7d4-6df2-4f5e-938b-a725790ea7b9':'https://tv.arcsine.org'
        };
        
        // Look up the url to call based on the appId
        var url = handlers[event.session.application.applicationId];
        if (!url) { context.fail("No url found for application id"); }
        var parts = URLParser.parse(url);
        
        event.firebaseURL = ''; //Secret
        
        var post_data = JSON.stringify(event);
        
        // An object of options to indicate where to post to
        var post_options = {
            host: parts.hostname,
            port: (parts.port || 443),
            path: parts.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
        // Initiate the request to the HTTP endpoint
        var req = https.request(post_options,function(res) {
            var body = "";
            // Data may be chunked
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                // When data is done, finish the request
                context.succeed(JSON.parse(body));
            });
        });
        req.on('error', function(e) {
            context.fail('problem with request: ' + e.message);
        });
        // Send the JSON data
        req.write(post_data);
        req.end();        
    } catch (e) {
        context.fail("Exception: " + e);
    }
};
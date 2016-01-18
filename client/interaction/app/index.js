var APP_MAPPINGS = module.exports.APP_MAPPINGS = {
  //amazon : require('./amazon'),
  netflix : require('./netflix'),
  hulu : require('./hulu'),
}

var DEFAULT_APP = APP_MAPPINGS[Object.keys(APP_MAPPINGS)[0]];
var APP_REGEX = new RegExp("(on|with|in)? ("+Object.keys(APP_MAPPINGS).join('|')+")", "gi");

module.exports = function getApp(query) {
  var cls = DEFAULT_APP;
     
  //Look for any app name
  query = query.replace(APP_REGEX, function(all, pre, appFound) {
    cls = APP_MAPPINGS[appFound.toLowerCase()];
    return '';
  }).replace(/^\s+|\s+$/g, '');
  
  
  //Instantiate
  var app = new cls();
  app.query = query;
  return app;
}
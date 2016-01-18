var APP_MAPPINGS = module.exports.APP_MAPPINGS = {
  //amazon : require('./app/amazon'),
  netflix : require('./app/netflix'),
  hulu : require('./app/hulu'),
}

var DEFAULT_APP = APP_MAPPINGS[Object.keys(APP_MAPPINGS)[0]];
var APP_REGEX = new RegExp("(on|with|in)? ("+Object.keys(APP_MAPPINGS).join('|')+")", "g");

module.exports = function getApp(query) {
  var app = DEFAULT_APP;
     
  //Look for any app name
  query = query.replace(APP_REGEX, function(all, pre, appFound) {
    app = APP_MAPPINGS[appFound];
    return '';
  }).replace(/^\s+|\s+$/g, '');
  app.query = query;
  return app;
}
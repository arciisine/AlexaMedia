var proxy = require('./proxy');
var config = JSON.parse(require('fs').readFileSync('./config.json'));

var AlexaSkill = require('./alexa-skill');

var MediaControl = function () {
  AlexaSkill.call(this, config.appId);
};

// Extend AlexaSkill
MediaControl.prototype = Object.create(AlexaSkill.prototype);
MediaControl.prototype.constructor = MediaControl;
MediaControl.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) { /* cleanup */ };
MediaControl.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {};
MediaControl.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) { /*cleanup*/ };

MediaControl.prototype.intentHandlers = {
  // register custom intent handlers
  "Media": function (intent, session, response) {      
    var query = intent.slots.query.value || '';
    var action = intent.slots.action.value || '';

    if (action === 'play' && query) {
      session.action = action;
      session.query = query;
      response.ask("Do you want to "+action+" "+query);
    } else {
      proxy(config, action, query, function() {
        response.tellWithCard("", "Media Control", action +" "+query);
      }, function(err) {
        response.tell("Invalid request. "+action+" "+query);
      });
    }
  },
  "AMAZON.YesIntent": function (intent, session, response) {
    var action = session.action || '';
    var query = session.query || '';
    proxy(config, action, query, function() {
      response.tellWithCard("", "Media Control", action +" "+query);
    }, function(err) {
      response.tell("Invalid request. "+action+" "+query);
    });
  },
  "AMAZON.NoIntent": function(intent, session, response) {
     session.action = null;
     session.query = null;
  }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  // Create an instance of the HelloWorld skill.
  var app = new MediaControl();
  app.execute(event, context);
};
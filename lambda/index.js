var proxy = require('./proxy');
var config = require('./config.json');

var proxy_firebase = proxy.bind(null,
  config.firebase.namespace + '.firebaseio.com',
  '/'+config.firebase.topic+'.json?auth='+config.firebase.secret 
)

var AlexaSkill = require('./alexa-skill');

var MediaControl = function () {
  AlexaSkill.call(this, config.alexa.appId);
};

// Extend AlexaSkill
MediaControl.prototype = Object.create(AlexaSkill.prototype);
MediaControl.prototype.constructor = MediaControl;
MediaControl.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) { /* cleanup */ };
MediaControl.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {};
MediaControl.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) { /*cleanup*/ };

MediaControl.prototype.intentHandlers = {
  // register custom intent handlers
  "AlexaMedia": function (intent, session, response) {      
    var query = intent.slots.query.value || '';
    var action = intent.slots.action.value || '';
    var msg =  { action : action, query : query, all : action + " " + query };

    if ((action === 'play' || action === 'watch') && query) {
      session.attributes = msg;
      response.ask("Do you want to "+msg.all);
    } else {
      proxy_firebase(msg, function() {
        response.tell("");
      }, function(err) {
        response.tell("Invalid request. "+msg.all);
      });
    }
  },
  "AMAZON.YesIntent": function (intent, session, response) {
    var msg = session.attributes;
    if (msg) {
      proxy_firebase(msg, function() {
        response.tellWithCard("Will now " + msg.all, "Now Watching", msg.query);
      }, function(err) {
        response.tell("Invalid request. "+msg.all);
      });
    } else {
      response.tell("Invalid request. "+msg.all);
    }
  },
  "AMAZON.NoIntent": function(intent, session, response) {
    session.attributes = {};
    response.tell("Canceled");
  }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  // Create an instance of the HelloWorld skill.
  var app = new MediaControl();
  app.execute(event, context);
};
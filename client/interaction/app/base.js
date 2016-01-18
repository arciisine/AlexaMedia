var wait = require('../../utils').wait;

function BaseApp() {}
BaseApp.prototype.open = function(queue) {          
  var cb = null
  if (this.query) { //If a query is provided
    cb = this.find.bind(this, queue, this.query);
  }
  queue.openApp(this.pkg, this.after.bind(this, queue, cb));
}
BaseApp.prototype.wait = wait;
BaseApp.prototype.after = function(queue, cb) {}
BaseApp.prototype.find = function(queue, query, cb) {}

module.exports = BaseApp;
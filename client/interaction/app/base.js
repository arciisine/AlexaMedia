function BaseApp() {}
BaseApp.prototype.open = function(queue) {
  var self  = this;
  
  return queue.openApp(this.pkg)
    .then(function() {
      return self.after(queue);
    })
    .then(function() {
      if (self.query) { //If a query is provided
        self.find(queue, self.query);
      }
    })
}

BaseApp.prototype.afterOpen = function(queue) {}
BaseApp.prototype.find = function(queue, query) {}

module.exports = BaseApp;
function BaseApp() {}
BaseApp.prototype.open = function(queue) {
  var self  = this;
  
  return queue.openApp(this.pkg)
    .then(function() {
      return self.afterOpen(queue);
    })
    .then(function() {
      if (self.query) { //If a query is provided
        return self.findAndPlay(queue, self.query);
      }
    })
}

BaseApp.prototype.afterOpen = function(queue) {}
BaseApp.prototype.findAndPlay = function(queue, query) {}

BaseApp.extend = function(cls) {
  cls.prototype = new BaseApp();
  cls.prototype.constructor = cls;
}

module.exports = BaseApp;
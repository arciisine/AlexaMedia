module.exports = {
  wait : function (cb, durr) {
    var self = this;
    if (cb) {
      return function(data) {
        setTimeout(function() {
          cb.call(self, data);
        }, durr);
      }
    }
  }
};
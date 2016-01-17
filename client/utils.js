module.exports = {
  wait : function (cb, durr) {
    if (cb) {
      return function(data) {
        setTimeout(function() {
          cb(data);
        }, durr);
      }
    }
  }
};
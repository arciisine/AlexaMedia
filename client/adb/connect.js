var os = require('os');
var portscanner = require('portscanner');
var exec = require('child_process').exec;

function getLocalIp() {
  var ip;
  var ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (!ip) {
          ip = iface.address;
      }
    });
  });
  
  return ip;  
}

function getAdbIP(cb) {
  var mask = getLocalIp().replace(/\d+$/, '');
  var ips = [];
  for (var i = 2; i <= 255; i++) {
    ips.push(mask + i);
  }

  var count = 0;
  
  function checkIP(ip) {
    count++;
    portscanner.checkPortStatus(5555, ip, function(error, port) {
      if (error || port !== 'open') {
        count--;
        itr();
      } else {
        cb(null, ip);
        cb = function() {};          
      }
    });
  }
  
  function itr() {
    if (!ips.length && !count) {
      return cb("Couldn't find an adb device on your network");
    }
    while (ips.length && count < 30) {
      checkIP(ips.shift());
    }
  }
  itr();
}

function adbConnect(cb) {
  getAdbIP(function(err, ip) {
    if (err) return cb(err);
    console.log("Connecting to ", ip);
    
    //Restart and start adb server
    exec('adb kill-server; adb start-server; adb connect '+ip, function(err, res) {
      if (!err) {
        console.log("Connected!");
        cb(err);
      } else {
        cb(null, res);;
      }
    })
  });
} 

module.exports = adbConnect
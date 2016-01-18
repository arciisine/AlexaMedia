var Q = require('q');
var os = require('os');
var portscanner = require('portscanner');
var exec = require('child_process').exec;

function getLocalIp() {
  var def = Q.defer();
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
  
  process.nextTick(function() {
    def.resolve(ip);
  })
  
  return def.promise;
}

function getAdbIP(localIp) {
  var def = Q.defer();
  
  var mask = localIp.replace(/\d+$/, '');
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
        def.resolve(ip);
      }
    });
  }
  
  function itr() {
    if (!ips.length && !count) {
      return def.reject("Couldn't find an adb device on your network");
    }
    while (ips.length && count < 30) {
      checkIP(ips.shift());
    }
  }
  process.nextTick(itr);
  
  return def.promise;
}

function adbConnect() {
  return Q(getLocalIp())
    .then(getAdbIP)
    .then(function(ip) {
      console.log("Connecting to ", ip);
      
      //Restart and start adb server
      return Q.nfcall(exec, 'adb kill-server; adb start-server; adb connect '+ip)
        .then(function(x) { 
          console.log("Connected!");
          return x; 
        })
    });
} 

module.exports = adbConnect
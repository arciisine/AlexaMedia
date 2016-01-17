var os = require('os');
var nmap = require('libnmap');
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

function getFireTVIP(cb) {
  var mask = getLocalIp().replace(/\d+$/, '');
  var key = mask + '2-255';
  nmap.scan({
    ports : '5555-5585',
    range : [key],
  }, function(err, report) {
    if (err) cb(err);
    if (!report || !report[key]) return;

    report = report[key];

    report.host.forEach(function(host) {
      var ip = host.address[0].item.addr;
      host.ports.forEach(function(port) {
        if (port.port && port.port[0].state && port.port[0].state[0].item.state === 'open') { //Open port
          var portId = parseInt(port.port[0].item.portid);
          if (portId >= 5555 && portId <= 5585) {
            //Found it
            cb(null, ip);
            cb = function() {}; //Do nothing if called again
          }
        }
      });
    });
    cb("Couldn't find a firetv on your network");
  });
}


function connect(cb) {
  getFireTVIP(function(err, ip) {
    if (err) return cb(err);
    console.log("Connecting to ", ip);
    exec('adb connect '+ip, function(err, res) {
      if (!err) {
        cb(err);
      } else {
        cb(null, res);;
      }
    })
  });
} 

module.exports = connect
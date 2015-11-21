var name = module.exports.name = "UPnP Protocol Plugin";

var UpnpControlPoint = require("upnp-controlpoint").UpnpControlPoint,
	log = require("../log")
;

module.exports.init = function(callback,callback_args) {
	GLOBAL.add_protocol(this);
}

module.exports.search = function() {
	log.write("Looking for things over UPnP");
	var cp = new UpnpControlPoint();
	cp.on("device", handleDevice);
	cp.search();
}

var handleDevice = function(device) {
	log.write ("Found: " + device.deviceType + " in " + name + ' - Searching for a controller');
	GLOBAL.find_controller(device, name);
};

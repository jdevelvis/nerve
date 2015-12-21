var name = module.exports.name = "UPnP Protocol Plugin";

var UpnpControlPoint = require("upnp-controlpoint").UpnpControlPoint,
	log = require("../log"),
	plugins = null
;

module.exports.init = function(plugins_object) {
//	log.write(plugins_object);
	if (plugins_object != undefined) {
		plugins_object.add_protocol(this);
	} else log.write("Error adding protocol " + name + ", plugins_object is undefined");
}

module.exports.search = function(plugins_object) {
	if (plugins_object != undefined) {
		plugins = plugins_object;
		log.write("Looking for things over UPnP");
		var cp = new UpnpControlPoint();
		cp.on("device", handleDevice);
		cp.search();
	} else return "Plugin Object not passed, cannot load upnp protocol";
}

var handleDevice = function(device) {
	log.write ("Found: " + device.deviceType + " in " + name + ' - Searching for a controller');
	if (plugins != undefined) {
		plugins.find_controller(device, name);
	} else log.write("Error searching for a controller - plugins object not found");
};

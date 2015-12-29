var name = module.exports.name = "UPnP Protocol Plugin";

var UpnpControlPoint = require("upnp-controlpoint").UpnpControlPoint,
	log = require("../log")
;

function upnp() {
	var 	plugins = null,
		things = null
}

upnp.prototype.search = function(plugins_object, things_object) {
	this.plugins = plugins_object;
	this.things = things_object;
	var self = this;

	if (this.plugins != undefined) {
		log.write("Looking for things over UPnP");
		var cp = new UpnpControlPoint();
		cp.on("device", function(device) {
			log.write ("Found: " + device.deviceType + " in " + name + ' - Searching for a controller');
			if (self.plugins != undefined) {
				self.plugins.find_controller(device, name);
			} else log.write("Error searching for a controller - plugins object not found");
		});
		cp.search();
	} else return "Plugin Object not passed, cannot load upnp protocol";
}

module.exports = upnp;

module.exports.init = function(plugins_object, things_object) {
//	log.write(plugins_object);
	if (plugins_object != undefined) {
		plugins_object.add_protocol(this);
	} else log.write("Error adding protocol " + name + ", plugins_object is undefined");
}

//###Need to modify this so we can save the UUIDs and control lights individually!
var wemo = require("upnp-controlpoint/lib/wemo"),
	log = require('../log'),
	path = require('path')
;

function Wemo(device) {
	this.name = "Wemo";
	this.type = '';
	this.connected = false;
	this.device = device;
	this.wemoDevice = null;
	this.state = null;

//	log.write("device type: " + device.deviceType + " location: " + device.location);

        switch(device.deviceType) {
	    //Because WeMo Switches & Outlets are similar
            case wemo.WemoControllee.deviceType:
		this.type = "switch";
		this.name = "WeMo Switch";
            case "urn:Belkin:device:lightswitch:1": //This should probably be added to the wemo.js part of the upnp-controlpoint module
		this.type = "switch";
		this.name = "WeMo Light Switch";

                console.log("======== Wemo Device Found! ========");
//		console.log(device.uuid);
		this.connected = true;
/*		GLOBAL.track_thing(device.uuid, type, 
		  module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length),
		  device, name);
*/
		//###TODO:
		//Listener - does this need to be moved? or does it make
		//more sense to leave it here?
		//Does we need to be able to refer to these controllees later?
		//Or can we set up a new controllee reference each time we 
		//want to issue a command, then kill it?
			//Would that change how we handle the controllees here?
                this.wemoDevice = new wemo.WemoControllee(device);
                this.wemoDevice.on("BinaryState", function(value) {
                        console.log("wemo switch state change: " + value);
                });

/*                setTimeout(function() {
//                        this.wemoDevice.setBinaryState(true);
                }, 4000);
                setTimeout(function() {
//                        this.wemoDevice.setBinaryState(false);
                }, 6000);
*/
		return true;
                break;

            case wemo.WemoSensor.deviceType:
		//###TODO: Update & test this section, as I don't have a sensor
		//to test it with
                this.wemoDevice = new wemo.WemoSensor(device);
                wemoDevice.on("BinaryState", function(value) {
                        console.log("wemo motion sensor state change: " + value);
                });

/*		GLOBAL.track_thing(device.uuid, "sensor", 
		  , module.filename.length),
		  device, "WeMo Sensor");
*/
		this.connected = true;
		return true;
                break;

	    default: 
		return false;
		break;
        }
};

Wemo.prototype.take_action = function(action) {
	log.write("+++Action supplied: " + action);
};

Wemo.prototype.is_connected = function() {
	return this.connected;	
}

Wemo.prototype.uuid = function() {
	return this.device.uuid;
}

Wemo.prototype.name = function() {
	return this.name;
}

Wemo.prototype.type = function() {
	return this.type;
}

Wemo.prototype.state_data = function() {
	return {"available_actions": ["on","off"],
		"available_states": ["on","off"],
		"current_state": this.state};
}

module.exports = Wemo;


//============================================
//Init funciton, set aside because it's static
//============================================

module.exports.init = function() {
	//Add this plugin to the global list of controllers, no instance necessary as this
	//will be instantiated once per device
	GLOBAL.add_controller(
	  module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length),
	  'UPnP Protocol Plugin'
	);

	log.write('Init complete');
};


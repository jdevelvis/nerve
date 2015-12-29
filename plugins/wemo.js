//###Need to modify this so we can save the UUIDs and control lights individually!
var wemo = require("upnp-controlpoint/lib/wemo"),
	log = require('../log'),
	path = require('path')
;

function Wemo(device) {
	log.write("Instantiating Wemo Device Class");
	this._name = "Wemo";
	this._type = '';
	this._connected = false;
	this._device = device;
	this._wemoDevice = null;
	this._state = null;
	this._things = null;
	
	var self = this;

//	log.write("device type: " + device.deviceType + " location: " + device.location);

        switch(device.deviceType) {
	    //Because WeMo Switches & Outlets are similar
            case wemo.WemoControllee.deviceType:
		this._type = "switch";
		this._name = "WeMo Switch";
            case "urn:Belkin:device:lightswitch:1": //This should probably be added to the wemo.js part of the upnp-controlpoint module
		if (this._type == '')
			this._type = "switch";
		if (this._name == '')
			this._name = "WeMo Light Switch";

                console.log("======== Wemo Device Found! ========");
//		console.log(device.uuid);
		this._connected = true;
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
/*
log.write("device.desc: ");
log.write(device.desc);
log.write("Services: ");
log.write(device.services);*/


                this._wemoDevice = new wemo.WemoControllee(device);
                this._wemoDevice.on("BinaryState", function(value) {
                        console.log("wemo switch state change: " + value);
			self._state = value;

			self._things.update(this._uuid, this._name, value);
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
                this._wemoDevice = new wemo.WemoSensor(device);
                this._wemoDevice.on("BinaryState", function(value) {
                        console.log("wemo motion sensor state change: " + value);
                });

/*		GLOBAL.track_thing(device.uuid, "sensor", 
		  , module.filename.length),
		  device, "WeMo Sensor");
*/
		this._connected = true;
		return true;
                break;

	    default: 
		return false;
		break;
        }
};

Wemo.prototype.receive_message = function(message, callback) {
	if (callback == undefined) callback = function() {}

        log.write("Message Received By " + this.uuid());
	log.write("test");
        switch (message.type) {
                case 'command':
			log.write("In Case Command: " + this.uuid());
                        switch (message.command) {
                                case 'on':
                                        log.write("++++++Turning on: " + this.uuid());
		                        this._wemoDevice.setBinaryState(true);
                                        callback(null, '{"response":"Success!"}');
                                        break;
                                case 'off':
                                        log.write("++++++Turning off: " + this.uuid());
		                        this._wemoDevice.setBinaryState(false);
                                        callback(null, '{"response":"Success!"}');
                                        break;
                                default:
                                        callback("Error: Invalid Command Type");
                                        break;
                        }
                        break;
                case 'query':
			log.write("In Case Query: " + this.uuid());
                        switch (message.info) {
                                case 'state':
					//###TODO: State querying
                                        log.write("++++++Querying State: zwave" + this._nodeinfo.nodeid);
                                        callback(null,'{"uuid":"' + this.uuid() + '"}');
                                        break;
                                default:
                                        callback("Error: Invalid Info Type");
                                        break;
                        }
                        break;
                default:
			log.write("In Default Case: " + this.uuid());
                        callback("Error: Invalid Message Type");
                        break;
        }
};

Wemo.prototype.is_connected = function() {
	return this._connected;	
}

Wemo.prototype.uuid = function() {
	return this._device.uuid;
}

Wemo.prototype.name = function() {
	return this._name;
}

Wemo.prototype.type = function() {
	return this._type;
}

Wemo.prototype.room = function() {
        return '';
}

Wemo.prototype.tags = function() {
        return '';
}

Wemo.prototype.state = function() {
	return this._state;
}

module.exports = Wemo;


//============================================
//Init funciton, set aside because it's static
//============================================

module.exports.init = function(plugins, things_object) {
	//Save reference to things objet
	this._things = things_object;

	//Add this plugin to the global list of controllers, no instance necessary as this
	//will be instantiated once per device
	plugins.add_controller(
	  module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length),
	  'UPnP Protocol Plugin'
	);

	log.write('Init complete');
};


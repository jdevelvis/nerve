var 	log = require('../log'),
	path = require('path')
;

function zwaveonoff(nodeinfo, zwave_object) {
	this._name = "ZWave";
	this._type = '';
	this._connected = false;
	this._nodeinfo = nodeinfo;
	this._zwaveDevice = null;
	this._state = null;
	this._zwave = zwave_object; //Reference to the zwave object so we can issue commands
	this._things = null;

	log.write("------------ Node info: ");
	log.write(this._nodeinfo);
	
	if (nodeinfo != undefined && nodeinfo.nodeid != undefined && 
		nodeinfo.producttype != undefined) {
		switch (nodeinfo.producttype) {
			case "0003": //Binary Power Switch
			case "5252": //Duplex Recepticle
			log.write("Successfully created zwave on/off device!");
			this._connected = true;
			this._state = this._nodeinfo.values['37']['0'].value;
			log.write("###### State: " + this._state);
			break;
		}
	}

};

zwaveonoff.prototype.is_connected = function() {
	return this._connected;	
}

zwaveonoff.prototype.uuid = function() {
	return "zwave" + this._nodeinfo.nodeid;
}

zwaveonoff.prototype.name = function() {
	return this._name;
}

zwaveonoff.prototype.type = function() {
	return this._type;
}

zwaveonoff.prototype.room = function() {
	return '';
}

zwaveonoff.prototype.tags = function() {
	return '';
}

zwaveonoff.prototype.state = function() {
	return this._state;
}

zwaveonoff.prototype.receive_message = function(message, callback) {
        log.write("Message Received By zwave" + this._nodeinfo.nodeid);
//	log.write(message.state);
	switch (message.type) {
		case 'command':
			switch (message.state) {
				case 'on':
					log.write("++++++Turning on: zwave" + this._nodeinfo.nodeid);
					this._zwave.switchOn(this._nodeinfo.nodeid);
					callback(null, '{"response":"Success!"}');
					break;
				case 'off':
					log.write("++++++Turning off: zwave" + this._nodeinfo.nodeid);
					this._zwave.switchOff(this._nodeinfo.nodeid);
					callback(null, '{"response":"Success!"}');
					break;
				default:
					callback("Error: Invalid Command Type");
					break;
			}
			break;
		case 'query':
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
		        callback("Error: Invalid Message Type");
			break;
	}
}

module.exports = zwaveonoff;


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
	  'ZWave Protocol Plugin'
	);
};


//Code to load plugins & return object to be used elsewhere

var 	log = require('./log'),
	plugin_db = require('./db'),
	async = require('async'),
	things = null,
	protocols = [],
	controllers = []
;

//----------------------------
//Init function opens and loads the database
//----------------------------
module.exports.init = function(self, things_object) {
	//For some reason, self wasn't getting the object I expected, so I made the code pass the object it's self. Not solid coding, but it worked :)
	//###TODO: Fix this eventually

//	var self = this; 
	things = things_object;
	//Load plugins based on config db

	//###Removed DB access to prevent DB collision with things.db
	//Not sure why, but it was writing things.db rows to plugins.db
	//plugin_db.init('db/plugins.db', function(err) {
	//	if (!err) {
			log.write("Loading Plugins");
			//Get list of plugin files
			var fs = require('fs'),
				p = null;

			fs.readdir(__dirname + '/plugins', function(err, files) {
			    if (err) return; //If we got an error, move on
			    async.each(files, function(f, callback) {
				//If this isn't a file, move on
				if (!fs.lstatSync('./plugins/' + f).isFile()) return; 
			        
				log.write('Loading plugin file: ' + f);
				p = require('./plugins/' + f);
				p.init(self);
			    }, function(err) {
				log.write("Error initializing plugins: " + err)
				return "Error initializing plugins: " + err;
			    });
			});
			return "Plugins loaded";
}

//----------------------------
//Add a plugin to the active plugin db
//----------------------------
module.exports.add = function(file, callback) {
	//###Todo: Needs to check if the plugin is already active

	//Create a record from the filename & insert it into the db
	record = {path:file};
/*	plugin_db.insert(record,function(err, response) {
		if (!err) callback(response);
		else callback(null, err);
	});
*/
}

//----------------------------
//Remove a plugin from the active plugin db
//----------------------------
module.exports.remove = function(file, callback) {
	//Create a record from the filename & insert it into the db
	record = {path:file};
/*	plugin_db.remove(record,{},function(err, response) {
		if (!err) callback(); //Success! We removed the plugin from the active plugins
		else callback(err);
	});
*/
}

//----------------------------
//List the active plugins
//----------------------------
module.exports.list = function(callback) {
}

//----------------------------
//Add a protocol to the list
//----------------------------
module.exports.add_protocol = function(plugin) {
        if (plugin.name in protocols) {
                log.write("Error - Possible Plugin Name Collision: Protocol '" + plugin.name);
        } else {
                if (!protocols[plugin.name]) protocols[plugin.name] = [];
                protocols[plugin.name].push({plugin: plugin,searching:false});
                log.write("=============== New protocol added: " + plugin.name);
        }
}

//----------------------------
//Add a controller to the list
//----------------------------
module.exports.add_controller = function(plugin_path, protocol_name) {
        if (!controllers[protocol_name]) controllers[protocol_name] = [];
        controllers[protocol_name].push(plugin_path);
        log.write("========= New controller added: " + plugin_path);
}

//----------------------------
//Search for a controller for a thing
//----------------------------
module.exports.find_controller = function(device, name, protocol_object) {
        //Check if name exists in the controllers array. If not, there are no controllers to find, move on
        if (controllers[name] == undefined) return false;

        log.write("!!! Finding controller in " + name);
        //There is a controllers[name]! Now loop through it
//        keys = Object.keys(controllers[name]);
        for (var i=0; i < controllers[name].length; i++) {
                var thing = null;
//              log.write(controllers[name]);
                controller = require('./plugins/' + controllers[name][i]);
                log.write("Creating Thing: ");
                if (protocol_object != undefined)
                        thing = new controller(device, protocol_object);
                else //No protocol_object passed, must not be needed for this protocol
                        thing = new controller(device);

//              log.write(thing);

                if (thing == null) log.write("!!!!!!!!!! No plugin found");
//              log.write("------------ checking connection ------------")
                if (thing.is_connected()) {
                        log.write("Thing connected!");
//			log.write(things);
                        things.track_thing(thing);
                } else log.write("Not connected to " + thing.name() + "...");
        }
}

module.exports.protocols = function() {
	return protocols;
}

module.exports.controllers = function() {
	return controllers;
}

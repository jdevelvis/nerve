//Load global vars and initialize loops in child processes

var 	things = require('./things'),
	plugins = require('./plugins'),
	search = require('./search'),
	listen = require('./listen'),
	log = require('./log'),
	async = require('async'),
	ws_server = require('./ws_server.js')
;

//Initialize the global vars
GLOBAL.protocols = [];
GLOBAL.controllers = [];
GLOBAL.things = [];

//Global functions. Yes, I realize global functions aren't ideal -  
//I'll come back and fix this eventually. Unless you want to :)
GLOBAL.add_protocol = function(plugin) {
	if (plugin.name in GLOBAL.protocols) {
		log.write("Error - Possible Plugin Name Collision: Protocol '" + plugin.name + "' already exists!");
	} else {
		if (!GLOBAL.protocols[plugin.name]) GLOBAL.protocols[plugin.name] = [];
		GLOBAL.protocols[plugin.name].push({plugin: plugin,searching:false});
		log.write("=============== New protocol added: " + plugin.name);
//		log.write(GLOBAL.protocols);
	}
}

GLOBAL.add_controller = function(plugin_path, protocol_name) {
	if (!GLOBAL.controllers[protocol_name]) GLOBAL.controllers[protocol_name] = [];
	GLOBAL.controllers[protocol_name].push(plugin_path);
	log.write("========= New controller added: " + plugin_path);
}

GLOBAL.find_controller = function(device, name) {
	//Check if name exists in the controllers array. If not, there are no controllers to find, move on
	if (GLOBAL.controllers[name] == undefined) return false;

	log.write("!!! Finding controller in " + name);
	//There is a GLOBAL.controllers[name]! Now loop through it
//        keys = Object.keys(GLOBAL.controllers[name]);
        for (var i=0; i < GLOBAL.controllers[name].length; i++) {
		var thing = null;
                controller = require('./plugins/' + GLOBAL.controllers[name][i]);
//		log.write("Creating Thing: ");
		thing = new controller(device);
//		log.write(thing);

		if (thing == null) log.write("!!!!!!!!!! No plugin found");
//		log.write("------------ checking connection ------------")
               	if (thing.is_connected()) { 
			log.write("Thing connected!");
			GLOBAL.track_thing(thing);			
		} else log.write("Not connected...");
        }
}

GLOBAL.track_thing = function(t) {
	//Add a thing to the database
	//Things are required to have the following parameters:
	//	uuid - uuid for the device
	//	state_data - JSON data about the state of the thing. If not supplied, "on" and "off" are assumed
	//Optional (Note: these may be overridden by the user):
	//	name - Name to use for device
	//	type - Type of device
	//	tags - Default tags for device

	if (t == null) {
		log.write ("ERROR: Missing thing object!");
		return false; 
	}
	log.write('~~~~ New thing found. Searching for: ' + t.uuid()); 
//	log.write(t);

	//Check if thing is in the DB already, add it if it's not. Update activity timestamp if it is
	things.get_thing(t.uuid(),function(err, thing) {
		if (err != null) {
			log.write('~Error while searching for thing: ' + err);
			return;
		}
		if (thing == null) {
			log.write('~Thing not found in db, creating new thing');
			//Create new thing
			things.add_thing(id, plugin, name, null, null, function(err, record_id) {
				if (err) {
					log.write("~Error adding thing '" + id + "' to DB: " + err);
					return;
				}
				if (record_id) {
					//Woohoo!
					log.write("~Thing successfully added!");
					return;
				}
			});
		} else {
			log.write("~Thing found: Updating activity timestamp");
		
			//Update last active data for thing
			things.update_activity(t.uuid());
			return;
		}
	});
	
	//Add thing to Global Thing Object Array
	if (GLOBAL.things[t.uuid()] != undefined) {
		log.write("...............Thing exists in array!");
	} else {
		log.write("...............Thing doesn't exist in array, adding!");
		GLOBAL.things[t.uuid()] = t;
	}
}

GLOBAL.get_thing = function(id) {
	//Check if thing is active in array
	//If not, check DB. Any idea why it's not active?
	//Return thing JSON: id, thing data, name, plugin, etc
}

//Load plugins & hubs
//This has to be async, because the plugins have to be loaded 
//before the search loop runs
async.series([things.init, plugins.init, search.init, listen.init, ws_server.init], function(err, results) {
	if (err) log.write("An error occurred: " + err);
	else log.write(results);
});

setTimeout(function() { 
	//log.write("~~~~~~~~ FINAL CHECK OF THING OBJECT ARRAY ~~~~~~~~"); 
	//log.write(GLOBAL.things); 
	//log.write(GLOBAL.things['Lightswitch-1_0-221339K13013A6'].take_action('{"action":"off"}'));
},5000);

/*### Old Code, leaving for a bit to make sure I don't need it
plugins.init(function (err) {
	if (err) log.write('Error initializing plugins: ' + err);
	else {
		log.write("searching...");

		search.init(function() {
	        	//Initialize listen loop
	        	listen.init(function (err) {
				log.write("--- Initializing The Listen Loop ---");
				if (err) log.write('Error initializing Listen loop: ' + err);
				else {
					//We're off and running!
				}
			});
		});
	}

});
*/

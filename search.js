//Code to initialize the search loop and save/log connected devices

//Doesn't need to run all the time, just once every so often? What about updates from the hubs? 
//Can those be called as events?

var log = require("./log");

//----------------------------
//Init function opens and loads the database
//----------------------------
module.exports.init = function(plugins, things) {
	log.write ("--- Searching For Things via Protocols ---");

	try {
		protocols = plugins.protocols();
		keys = Object.keys(protocols);
		for (var i=0; i < keys.length; i++) {
			log.write("Starting search for: " + keys[i]);
			element = protocols[keys[i]][0];
       			element.plugin.search(plugins);
		}
		return 'Protocols Loaded';
	} catch (e) {
		return "Something happened: " + e;
	}
}

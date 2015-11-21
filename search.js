//Code to initialize the search loop and save/log connected devices

//Doesn't need to run all the time, just once every so often? What about updates from the hubs? 
//Can those be called as events?

var log = require("./log");

//----------------------------
//Init function opens and loads the database
//----------------------------
module.exports.init = function(callback) {
	log.write ("--- Searching For Things via Protocols ---");

try {
	keys = Object.keys(GLOBAL.protocols);
	for (var i=0; i < keys.length; i++) {
		element = GLOBAL.protocols[keys[i]][0];
       		element.plugin.search();
	}
	callback(null,'Protocols Loaded');
} catch (e) {
	callback("Something happened: " + e,'');
}

//	setTimeout(search,10000); //###TODO: Set timeout longer? This is only really important as we load plugins
}

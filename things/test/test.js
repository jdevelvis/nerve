//Example thing plugin file

//Load the plugin helper functions
var helper = require('../../plugin_helper.js');

//----------------------------
//Load plugin initially, let the plugin tell the system where it should go
//----------------------------
module.exports.init = function () {
	//This function will be run for all plugins. All code required to load the plugin 
	//should be placed here
	var self = this;

	//Add this plugin to the list of thing plugins
	helper.add_thing(self);
}


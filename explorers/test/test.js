//Example explorer plugin file

//Load the plugin helper functions
var helper = require('../../plugin_helper.js'),
	events = require('events')
;

var Plugin = function() {
    //This function will be run for all plugins. All code required to load the plugin
   	//should be placed here
    var self = this;

	console.log('init');

    //Finally, add this plugin to the list of protocol plugins
	//###    helper.add_explorer(self);
}
Plugin.prototype = new events.EventEmitter;

//------------------------
//Function to search for things
//------------------------
Plugin.prototype.search = function () {
	var self = this;

	//### Need Search Code Here!

	//!!!!!!!!!!!! Your code MUST emit the found event for the system to initiate the new thing!
	self.emit('found', {data:"data"});
}

//Finally, complete the module
module.exports = Plugin;

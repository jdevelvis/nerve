//Load global vars and initialize loops in child processes

var spawn = require('child_process').spawn,
	plugins = require('./plugin'),
	search = require('./search'),
	listen = require('./listen')
;

//Initialize the global vars
GLOBAL.protocol_plugins = [];
GLOBAL.thing_plugins = [];

//Load plugins & hubs
plugins.init(function (err,text) {
	if (err) console.log(text);
	else {
		//Initialize search loop
		search.init(function (err,text) {
    		if (err) console.log(text);
    		else {
	        	//Initialize listen loop
	        	listen.init(function (err,text) {
				    if (err) console.log(text);
				    else {
						//We're off and running!
				    }
				});
		    }
		});
	}
});

//Load global vars and initialize loops in child processes

var 	things = require('./things'),
	plugins = require('./plugins'),
	search = require('./search'),
	listen = require('./listen'),
	log = require('./log'),
	async = require('async'),
	ws_server = require('./ws_server.js')
;

//Load plugins & hubs
//This has to be async, because the plugins have to be loaded 
//before the search loop runs
async.series( [ ws_server.init,
		function(callback) { things.init(ws_server, callback); }, 
		function(callback) { plugins.init(plugins, things); callback(); }, 
		function(callback) { search.init(plugins, things); callback(); }
	      ], function(err, results) {
	if (err) log.write("An error occurred: " + err);
	else log.write(results);
});

setTimeout(function() { 
	log.write("~~~~~~~~ 90 SECOND CHECK OF THING OBJECT ARRAY ~~~~~~~~"); 
	log.write(things.things()); 
},15000);

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

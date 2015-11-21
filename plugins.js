//Code to load plugins & return object to be used elsewhere

var 	log = require('./log'),
	plugin_db = require('./db'),
	async = require('async')
;

//----------------------------
//Init function opens and loads the database
//----------------------------
module.exports.init = function(callback) {
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
				p.init();
			    }, function(err) {
				log.write("Error initializing plugins: " + err)
			    });
			});
			
			callback(null,'Plugins Loaded');
//		}
	//	else callback(err,'');
	//});
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
/*   plugin_db.find({},{},function(err, plugins) { //Use {},{} because we want the entire list
        if (!err) callback(plugins); //Success! Return the list of plugins
        else callback(null, err);
    });
*/
}

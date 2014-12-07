//Code to load plugins & return object to be used elsewhere

var db = require('./db');

//----------------------------
//Init function opens and loads the database
//----------------------------
module.exports.init = function(callback) {
	//Load plugins based on config db
	db.init('db/plugins.db', function(err) {
		if (!err) callback();
		else callback(err);
	});
}

//----------------------------
//Add a plugin to the active plugin db
//----------------------------
module.exports.add = function(file, callback) {
	//###Todo: Needs to check if the plugin is already active

	//Create a record from the filename & insert it into the db
	record = {path:file};
	db.insert(record,function(err, response) {
		if (!err) callback(response);
		else callback(null, err);
	});
}

//----------------------------
//Remove a plugin from the active plugin db
//----------------------------
module.exports.remove = function(file, callback) {
	//Create a record from the filename & insert it into the db
	record = {path:file};
	db.remove(record,{},function(err, response) {
		if (!err) callback(); //Success! We removed the plugin from the active plugins
		else callback(err);
	});
}

//----------------------------
//List the active plugins
//----------------------------
module.exports.list = function(callback) {
    db.find({},{},function(err, plugins) { //Use {},{} because we want the entire list
        if (!err) callback(plugins); //Success! Return the list of plugins
        else callback(null, err);
    });
}

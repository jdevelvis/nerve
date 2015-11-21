//Database logic, separated out to maintain consistency

// Type 2: Persistent datastore with manual loading
var Datastore = require('nedb'), 
	isJSON = require('./isJSON'),
	_ = require('underscore'),
	db = null,
	log = require('./log')
;

//----------------------------
//Initialize the DB
//----------------------------
module.exports.init = function(path, callback) {
	//Try to load the DB, if you fail, throw error
	try {
		db = new Datastore({filename: path, autoload:true});
		callback(null,true);
	} catch (e) {
		callback("Error loading DB: " + e);
	}
}

//----------------------------
//Retrieve data from DB
//----------------------------
module.exports.find = function(find, options, callback){
	//Make sure the DB is loaded
	if (db == null) callback("The database isn't loaded! Cannot find records.");

	if (!options) options = {};

//	log.write(find);
	db.find(find, options, function(err,docs) {
//		log.write("Find Returned: " + docs + " Error? " + err);
	        if (!err) {
    		        callback(null, docs);
       		} else {
	        	callback("Error: " + err);
		}
	});
}

//----------------------------
//Insert into DB
//----------------------------
module.exports.insert = function (record, callback) {
	//Quick check to verify the record data structure
	if (!isJSON(record)) { callback (null, "Error: You didn't pass in JSON data for the record"); }
	
	//Fire the insert command here
	db.insert(record, function(err,newDoc) { 
		if (!err) {
			callback(null, newDoc._id);
		} else {
			callback("Error: " + err);
		}
	});
}

//----------------------------
//Update record
//----------------------------
module.exports.update = function (query,update,options,callback) {
	if (_.isNumber(query)) query = { _id: query };

	//If options = null, set it to {} to prevent Object.keys error
	if (!options) options = {};

	db.update(query,update,options, function(err, numReplaced) {
		if (!err) 
			callback(null, numReplaced);
		else
			callback("There was an error while updating the record! " + err);
	});
}

//----------------------------
//Delete record
//----------------------------
module.exports.remove = function (query, options, callback) {
	if (_.isNumber(query)) query = { _id: query };

	//If options = null, set it to {} to prevent Object.keys error
	if (!options) options = {};

	db.remove(query,options,function(err, numRemoved) {
		if (!err)
			callback(null, numRemoved);
		else
			callback("There was an error while removing the record! " + err);
	});
}

//----------------------------
//----------------------------
//----------------------------
//----------------------------
//----------------------------
//----------------------------
//----------------------------
//----------------------------
//----------------------------


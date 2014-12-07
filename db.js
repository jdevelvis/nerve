//Database logic, separated out to maintain consistency

// Type 2: Persistent datastore with manual loading
var Datastore = require('nedb'), 
	isJSON = require('./isJSON'),
	_ = require('underscore'),
	db = null
;

//----------------------------
//Initialize the DB
//----------------------------
module.exports.init = function(path, callback) {
	//Try to load the DB, if you fail, throw error
	try {
		db = new Datastore({filename: path, autoload:true});
		callback(false);
	} catch (e) {
		callback("Error loading DB: " + e);
	}
}

//----------------------------
//Retrieve data from DB
//----------------------------
module.exports.find = function(find, options, callback) {
	//Make sure the DB is loaded
	if (db == null) callback(null, "The database isn't loaded! Cannot find records.");

	try {
		db.find(find, options, function(err,docs) {
	        if (!err) {
    	        callback(docs, false);
        	} else {
	            callback(null, "Error: " + err);
    	    }
		});
	} catch (e) {
		callback(null, "Error finding data from DB: " + e);
	}
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
			callback(newDoc._id);
		} else {
			callback(null, "Error: " + err);
		}
	});
}

//----------------------------
//Update record
//----------------------------
module.exports.update = function (query,update,options,callback) {
	if (_.isNumeric(query)) query = { _id: query };
	db.update(query,update,options, function(err, numReplaced) {
		if (!err) 
			callback(numReplaced);
		else
			callback(null,"There was an error while updating the record! " + err);
	});
}

//----------------------------
//Delete record
//----------------------------
module.exports.remove = function (query, options, callback) {
	if (_.isNumber(query)) query = { _id: query };
	db.remove(query,options,function(err, numRemoved) {
		if (!err)
			callback(numRemoved);
		else
			callback(null, "There was an error while removing the record! " + err);
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


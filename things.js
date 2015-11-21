//Logic for working with things, abstracted so we have a single common access point

//DB Schema
//_id: auto-generated 16-character alphanumerical string
//uuid: Unique identifier for the Thing
//plugin: Which plugin this thing should use
//name: string with the name of the thing, typically given by the user
//room: name of the room in which the device exists, typically given by the user
//tags: tags that apply to this thing, typically given by the user

var thing_db = require('./db'),
	log = require('./log')
;

module.exports.init = function(callback) {
	thing_db.init('db/things.db', function(err, success) {
		callback(null,'Successfully loaded thing DB');
	});
}

module.exports.get_thing = function(uuid, callback) {
	log.write('Getting thing: ' + uuid);
	thing_db.find({'uuid':uuid}, null, function(err, docs) {
		log.write("~In get_thing db.find: " + docs);
		if (docs instanceof Array) {
			log.write("~docs is an Array");
			if (docs.length > 0) {
				callback(null, docs[0]); //We should only ever have 1 thing to return, so simply return the first member
				//###Potential issues from the code above? Any opportunity to have uuid collisions?
			} else {
				callback(err, null);
			}
		} else { 
			log.write("Nothing found for " + uuid + "\n Error? " + err);
			callback(err, null);
		}
	});
}

module.exports.add_thing = function(uuid, plugin, name, room, tags, callback) {
	thing_db.insert({'uuid':uuid, 'plugin': plugin, 'name':name, 'room':room, 'tags':tags, 'last_active':Date.now()},
	  function(err,record_id) {
		if (err) log.write ("Error: " + err);
		else callback(err,record_id);
 	  });
}

module.exports.update_activity = function(uuid, options, callback) {
	thing_db.update({'uuid':uuid},{ $set: { last_active: Date.now() } }, options, function(err, result) {
		log.write('Activity Updated for ' + uuid);
		if (callback != null) {
			if (err) callback(err);
			else callback(null, uuid);
		}
	});
}

module.exports.send_message = function(message, callback) {
	get_thing(message.uuid, function (err, t) {
		log.write("Found the thing, issuing command");
		thing = require('./plugins/' + t.plugin);
		thing.send_message(message);
	});
}

//Logic for working with things, abstracted so we have a single common access point

//DB Schema
//_id: auto-generated 16-character alphanumerical string
//uuid: Unique identifier for the Thing
//name: string with the name of the thing, typically given by the user
//room: name of the room in which the device exists, typically given by the user
//tags: tags that apply to this thing, typically given by the user

var thing_db = require('./db'),
	log = require('./log'),
	_ = require('underscore'),
	ws = null,
	_things = []
;

module.exports.init = function(ws_server, callback) {
	this.ws = ws_server;
	thing_db.init('db/things.db', function(err, success) {
		callback(null,'Successfully loaded thing DB');
	});
}

var get_thing = module.exports.get_thing = function(uuid, callback) {
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

var add_thing = module.exports.add_thing = function(uuid, name, room, tags, callback) {
	thing_db.insert({'uuid':uuid, 'name':name, 'room':room, 'tags':tags, 'last_active':Date.now()},
	  function(err,record_id) {
		if (err) log.write ("Error: " + err);
		else callback(err,record_id);
 	  });
}

var update_activity = module.exports.update_activity = function(uuid, options, callback) {
	thing_db.update({'uuid':uuid},{ $set: { last_active: Date.now() } }, options, function(err, result) {
		log.write('Activity Updated for ' + uuid);
		if (callback != null) {
			if (err) callback(err);
			else callback(null, uuid);
		}
	});
}

var receive_message = module.exports.receive_message = function(message, callback) {
	if (message != undefined && typeof message == 'string')
		message = JSON.parse(message);

	if (message.uuid != undefined && message.uuid != '') {
		if (_things[message.uuid] != undefined)
			_things[message.uuid].receive_message(message,callback);
		else 
			callback("Error: Cannot find '" + message.uuid + "'");
	} else {
		callback('No uuid attached to the message');
	}
}

//================================

//--------------------------------
//Track a thing - add to the DB, 
//--------------------------------
var track_thing = module.exports.track_thing = function(t, wss) {
        //Add a thing to the database
        //Things are required to have the following parameters:
        //      uuid - uuid for the device
        //      state_data - JSON data about the state of the thing. If not supplied, "on" and "off" are assumed
        //Optional (Note: these may be overridden by the user):
        //      name - Name to use for device
	//	room - Name of the room the device is in
        //      type - Type of device
        //      tags - Default tags for device

        if (t == null) {
                log.write ("ERROR: Missing thing object!");
                return false;
        }
        log.write('~~~~ New thing found. Searching for: ' + t.uuid());
//      log.write(t);

        //Check if thing is in the DB already, add it if it's not. Update activity timestamp if it is
        get_thing(t.uuid(),function(err, thing) {
                if (err != null) {
                        log.write('~Error while searching for thing: ' + err);
                        return;
                }
                if (thing == null) {
                        log.write('~Thing not found in db, creating new thing');
                        //Create new thing

                        add_thing(t.uuid(), t.name(), t.room(), t.tags(), function(err, record_id) {
                                if (err) {
                                        log.write("~Error adding thing '" + id + "' to DB: " + err);
                                        return;
                                }
                                if (record_id) {
                                        //Woohoo!
                                        log.write("~Thing successfully added!");
                                        log.write("~Thing successfully added!");
                                        return;
                                }
                        });
                } else {
                        log.write("~Thing found: Updating activity timestamp");

                        //Update last active data for thing
                        update_activity(t.uuid());
                        return;
                }
        });

        //Add thing to Thing Object Array
        if (_things[t.uuid()] != undefined) {
                log.write("...............Thing exists in array!");
		//Send update to connected clients
		this.ws.broadcast("update_thing","0","success",'{"uuid":"' + t.uuid() + '","name":"' + t.name() + '","state":"' + t.state_data() + '"}');
        } else {
                log.write("...............Thing doesn't exist in array, adding!");
                _things[t.uuid()] = t;
		//Send new thing info to connected clients
		this.ws.broadcast("new_thing","0","success",'{"uuid":"' + t.uuid() + '","name":"' + t.name() + '","state":"' + t.state_data() + '"}');
        }
}

var list_things = module.exports.list_things = function() {
	var arr = [];
	for (var key in _things) {
		arr.push({"uuid":key, "name": _things[key]._name, "state":_things[key]._state});
//		log.write(arr[key]);
	}
	return arr;
}

module.exports.things = function() {
	return _things;
}

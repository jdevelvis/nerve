//###TODO: Add login capabilities if required by admin settings
//Should have secure option as well

var ws = require('ws'),
	log = require('./log'),
	isJSON = require('./isJSON'),
	things = require('./things'),
	db = require('nedb')
;

module.exports.init = function() {
/*	var WebSocketServer = require('ws').Server
	  , wss = new WebSocketServer({port: 8080});
	wss.on('connection', function(ws) {
		//Fire handshake
		console.log('Connection initiated, awaiting commands');

		//We need to wait on messages to verify the handshake
	    	ws.on('message', function(message) {
			//Is this a handshake message?
			//Or is this client verified already
			if (isJSON(message)) {
				message = JSON.parse(message);
       				console.log('received: %s', message);
				ws.send("Sending " + message.command + " to " + message.uuid);
				
				things.send_message(message,function(err, t) {
					if (err) {
						log.write("Error: " + err);
					} else {
						log.write("Message sent:");
						log.write(message);
						ws.send("Success!");								
					}
				});
			} else {
				ws.send("Error: Messages must be JSON format. You sent '" + message + "'");
			}
	    	});

		//Send message to initiate handshake
		ws.send('{"status": "waiting"}');
	});
*/
}

module.exports.init();

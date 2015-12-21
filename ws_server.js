//###TODO: Add login capabilities if required by admin settings
//Should have secure option as well

var log = require('./log'),
	isJSON = require('./isJSON'),
	things = require('./things'),
	db = require('nedb')
;

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080})
;


module.exports.init = function(callback) {
//	this.wss = new WebSocketServer({port: 8080});

	log.write('####### Initiating wss Connection');

	wss.on('connection', function(ws) {
		//###TODO: Begin handshake
		console.log('Connection initiated, awaiting commands');

		//Listen for messages
	    	ws.on('message', function(message) {
			//###TODO: Implement handshake verification

			if (isJSON(message)) {
				message = JSON.parse(message);
				switch (message.type) {
					case 'list_things':
						//Send list of thing IDs, names, & states
						log.write("Listing things...");
						var arr = things.list_things();
						var data = '';
						for (var i=0; i<arr.length; i++) {
							data += JSON.stringify(arr[i]) + ",";
						}
						data = "[" + data.substring(0,data.length-1) + "]";
						ws.send('{"response":"list_things","conversation_id":"' + message.conversation_id + '","outcome":"success","data":' + data + "}");
					break;
					case 'command':
//       				log.write('Received message:');
//				log.write(message);
				//ws.send("Sending " + message.command + " to " + message.uuid);
				
						things.receive_message(message,function(err, t) {
							if (err) {
								log.write("Error: " + err);
								ws.send('{"response":"command","conversation_id":"'+message.conversation_id+'","outcome":"error","data":"'+err+'"}');
							} else {
								log.write("Message retreived and passed on:");
								log.write(message);
								ws.send('{"response":"command","conversation_id":"'+message.conversation_id+'","outcome":"success"}');
							}
						});
					break;
					default:
				}
			} else {
				message = message.replace('"','\"');
				ws.send('{"response":"message","outcome":"error","data":"Error: Messages must be JSON format. You sent: ' + message + '"}');
			}
	    	});

		//Send message to initiate handshake
		ws.send('{"response": "connected"}');
	});
	callback();
}

module.exports.broadcast = function(response, conversation_id, outcome, data) {
	if (wss != undefined) {
		wss.clients.forEach(function each(client) {
			response = response.replace(/"/g,'\\\"');
			outcome = outcome.replace(/"/g,'\\\"');
			conversation_id = conversation_id.replace(/"/g,'\\\"');
			data = data.replace(/"/g,'\\\"');
			client.send('{"response":"' + response + '","conversation_id":"' + conversation_id + '","outcome":"' + outcome +'","data":"' + data + '"}');
			log.write('{"response":"' + response + '","conversation_id":"' + conversation_id + '","outcome":"' + outcome +'","data":"' + data + '"}');
		});
	}
/*
	self = this;
	log.write("in ws.send");
	log.write(this.ws);
	log.write(self.ws);
	log.write(ws);
	if (self.ws != undefined) {
		log.write("Sending new message: " + data);
		self.ws.send('{"response":"' + response + '","conversation_id":"' + conversation_id + '","outcome":"' + outcome +'","data":"' + data + '"}');
	}
*/
}

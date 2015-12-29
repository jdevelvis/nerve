//Need to update and split this into 2 plugins - protocol & controller

var name = module.exports.name = "ZWave Protocol Plugin";
var OpenZWave = require('openzwave'),
	log = require("../log"),
	path = require('path'),
	self = null
;

function zwave() {
	//###TODO: Might have to scan ttyUSB slots to get the right one. Can we get away from having to know exactly which ttyUSB slot is the zwave device? That's a pain for the user
	//Workaround might be to add a plugin setting page with button to test available USB slots?
	this.z = new OpenZWave('/dev/ttyUSB0',{saveconfig: true});
	this.nodes = [];
	this.plugins = null;
	this.things = null;
	self = this;


	var handleDevice = function(device) {
		log.write ("Found: " + device.deviceType + " in " + name);

	//	log.write (GLOBAL.things[name]);
	};

	this.z.on('driver ready', function(homeid) {
        	console.log('scanning homeid=0x%s...', homeid.toString(16));
	});

	this.z.on('driver failed', function() {
        	console.log('failed to start driver');
	        self.z.disconnect();
        	process.exit();
	});

	this.z.on('node added', function(nodeid) {
        	self.nodes[nodeid] = {
                	manufacturer: '',
	                manufacturerid: '',
        	        product: '',
                	producttype: '',
	                productid: '',
        	        type: '',
                	name: '',
	                loc: '',
        	        classes: {},
                	ready: false,
	        };
	});

	this.z.on('value added', function(nodeid, comclass, value) {
		nodes = self.nodes;
        	if (!nodes[nodeid]['classes'][comclass])
                	nodes[nodeid]['classes'][comclass] = {};
	        nodes[nodeid]['classes'][comclass][value.index] = value;
	});

	this.z.on('value changed', function(nodeid, comclass, value) {
		nodes = self.nodes;
        	if (nodes[nodeid]['ready']) {
                	console.log('node%d: changed: %d:%s:%s->%s', nodeid, comclass,
                        	    value['label'],
                	            nodes[nodeid]['classes'][comclass][value.index]['value'],
        	                    value['value']);
	        }
	        nodes[nodeid]['classes'][comclass][value.index] = value;

		//Have to tell the things class an change in value has occurred
		self.things.update("zwave" + nodeid, nodes[nodeid]['classes'][comclass]);
	});

	this.z.on('value removed', function(nodeid, comclass, index) {
		nodes = self.nodes;
        	if (nodes[nodeid]['classes'][comclass] &&
        	    nodes[nodeid]['classes'][comclass][index])
                	delete nodes[nodeid]['classes'][comclass][index];
		//###TODO: update clients that a value has been removed
	});

	this.z.on('node ready', function(nodeid, nodeinfo) {
		nodes = self.nodes;
        	nodes[nodeid]['manufacturer'] = nodeinfo.manufacturer;
	        nodes[nodeid]['manufacturerid'] = nodeinfo.manufacturerid;
        	nodes[nodeid]['product'] = nodeinfo.product;
	        nodes[nodeid]['producttype'] = nodeinfo.producttype;
        	nodes[nodeid]['productid'] = nodeinfo.productid;
	        nodes[nodeid]['type'] = nodeinfo.type;
        	nodes[nodeid]['name'] = nodeinfo.name;
	        nodes[nodeid]['loc'] = nodeinfo.loc;
        	nodes[nodeid]['ready'] = true;
/*        console.log('node%d: %s, %s', nodeid,
                    nodeinfo.manufacturer ? nodeinfo.manufacturer
                                          : 'id=' + nodeinfo.manufacturerid,
                    nodeinfo.product ? nodeinfo.product
                                     : 'product=' + nodeinfo.productid +
                                       ', type=' + nodeinfo.producttype);
*/
	        console.log('node%d: name="%s", type="%s", location="%s"', nodeid,
        	            nodeinfo.name,
                	    nodeinfo.type,
	                    nodeinfo.loc);

	        for (comclass in nodes[nodeid]['classes']) 
			{
			//console.log(comclass);
			switch (comclass) {
        	            case 0x25: // COMMAND_CLASS_SWITCH_BINARY
                	    case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
                        	self.z.enablePoll(nodeid, comclass);
        	                break;
	                }
                	var values = nodes[nodeid]['classes'][comclass];
	                console.log('node%d: class %d', nodeid, comclass);
        	        for (idx in values) {
				console.log('idx: %d, node%d: %s=%s', idx, nodeid, values[idx]['label'], 
				  values[idx]['value']);
			}

		}
		nodeinfo.values = nodes[nodeid]['classes'];
		nodeinfo.nodeid = nodeid;
		log.write("Attempting to add zwave device:")
		log.write (nodeinfo);
		self.plugins.find_controller(nodeinfo, name, self.z);

/*
        GLOBAL.add_thing('zwave' + nodeid, nodeinfo.type,
          module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length),
          nodeinfo, 'ZWave ' + nodeinfo.type);
*/

	});

	this.z.on('notification', function(nodeid, notif) {
        	switch (notif) {
	        case 0:
        	        console.log('node%d: message complete', nodeid);
                	break;
	        case 1:
        	        console.log('node%d: timeout', nodeid);
                	break;
	        case 2:
        	        console.log('node%d: nop', nodeid);
                	break;
	        case 3:
        	        console.log('node%d: node awake', nodeid);
                	break;
	        case 4:
        	        console.log('node%d: node sleep', nodeid);
                	break;
	        case 5:
        	        console.log('node%d: node dead', nodeid);
                	break;
	        case 6:
        	        console.log('node%d: node alive', nodeid);
                	break;
        	}
	});

	this.z.on('scan complete', function() {
        	console.log('initial scan complete...');
	});

	process.on('SIGINT', function() {
        	console.log('disconnecting...');
	        self.z.disconnect();
        	process.exit();
	});
}

zwave.prototype.search = function(plugins_object, things_object) {
	log.write(this);
	this.plugins = plugins_object;
	this.things = things_object;

	this.connect();
}

zwave.prototype.connect = function() {
	log.write("&&&&&&&&&&&&&& Connecting via zwave");

	this.z.connect();
}

module.exports = zwave;

//=========================================
//Init function
//=========================================
module.exports.init = function(plugins_object, things_object) {
	self = this;

	if (plugins_object != undefined) {
		plugins_object.add_protocol(this);
	} else log.write("Error adding protocol " + name + ", plugins_object is undefined");
}

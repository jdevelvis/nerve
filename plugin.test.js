var plugins = require('./plugin');

plugins.init(function() {
//	plugins.add('test2.js', function(err) {
		plugins.list(function(records, err) {
			if (!err) console.log(JSON.stringify(records));
			else console.log(err);
		});
//	});
});


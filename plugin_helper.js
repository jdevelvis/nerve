//Helper class for plugins

//----------------------------
//Delete record
//----------------------------
module.exports.add_explorer = function (file) {
	GLOBAL.explorers.push(file);
}

module.exports.add_thing = function (file) {
	GLOBAL.things.push(file);
}

//Module to determine if a variable is JSON - works for both strings and JSON object variables

module.exports = function(json) {
	try {
		if (typeof json == 'object') {
			json = JSON.stringify(json);
			json = JSON.parse(json);
			return true; //If we get here, it's JSON
		} else if (typeof json == 'string') {
			json = JSON.parse(json);
			return true; //If we get here, it's JSON
		} else { 
			return false; //If we get here, it's not JSON (it's some other object)
		}
	} catch (e) {
		return false; //If there was an error, this wasn't JSON
	}
}

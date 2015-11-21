module.exports.write = function(text, write_to_console) {
	if (typeof write_to_console === 'undefined') write_to_console=true;
	//###TODO: Save to log file
	if (write_to_console) console.log(text);
}

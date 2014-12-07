/*var events = require('events'),
util = require('util');
 
var Foo = function(initial_no) { this.count = initial_no; };
 
Foo.prototype = new events.EventEmitter;
 
Foo.prototype.increment = function() {
var self = this;
setInterval(function() {
if(self.count % 2 === 0) self.emit('even');
self.count++;
}, 300);
};
 
var lol = new Foo(1);
 
lol.on('even', function() {
util.puts('Number is even! :: ' + this.count);
}).increment(); 
*/

test = new require('./test');

t = new test();

t.search();

t.on('found',function (data) {
	console.log('found! ' + JSON.stringify(data,null,4));
});


setTimeout(function() {},1000);


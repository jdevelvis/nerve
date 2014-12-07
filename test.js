var isJSON = require('./isJSON').isJSON;

testJSON = {id:"12",data:"123456"};
testJSONString = '{"id":"23","data":"asdfjkl"}';

console.log(isJSON(testJSON));
console.log(isJSON(testJSONString));
console.log(isJSON('{id:"34",data:"56"}'));
console.log(isJSON(Date));
console.log('--------------');

console.log(typeof testJSON);
console.log(typeof testJSONString);

j1 = JSON.parse(testJSONString);
console.log(j1.id);


testJSON = JSON.stringify(testJSON);
testJSONString = JSON.stringify(testJSONString);

testJSON = JSON.parse(testJSON);
testJSONString = JSON.parse(testJSONString);

console.log(testJSON.id);
console.log(testJSONString.id);


//j1 = JSON.parse(testJSON);
//j2 = JSON.parse(testJSONString);

//console.log(j1.id);
//console.log(j2.id);

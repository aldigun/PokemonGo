var request = require("request");
var config = require("json!../config/config.json");


var url = config.serverURL + config.coordinate.longitude + "/" + config.coordinate.latitude;
// request({
//     url: url,
//     json: true
// }, function (error, response, body) {

//     if (!error && response.statusCode === 200) {
//         console.log(body) // Print the json response
//     }
// })
var https = require('https');

// Need to move this to static config file, Need a new API source and parsing. Pokevision is no longer working.
var config = {
  "coordinate":{
    "latitude": 37.398647458996365,
    "longitude": -121.9859755039215
  },
  "serverURL": {
    "host": "pokevision.com",
    "path": "/map/data/37.398647459/-121.985975504"
  },
  "includeList": [],
  "doNotIncludeList": []
};

// Build poke Library Array.. Need to be optimized
var fs = require('fs');
var buffer = fs.readFileSync("./pokemon.csv", 'utf8').toString().split("\n");
buffer.shift();

pokemonLib = [];
for (var index = 0; index < buffer.length; index++) {
  var line = buffer[index].split(",");
  pokemonLib[line[0]] = line[1];
}


var options = {
    host: config.serverURL.host,
    path: config.serverURL.path
}
var request = https.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {

      try {
        jsonData = JSON.parse(data);
//          jsonData = {"status":"success",
// "pokemon":[
//   {
//     "id":"29552382",
//     "data":"[]",
//     "expiration_time":1469141251,
//     "pokemonId":"52",
//     "latitude":37.391913310255,
//     "longitude":-121.98147980288,
//     "uid":"808fc9dcdab:23",
//     "is_alive":true
//   },
//   {
//     "id":"29698449",
//     "data":"[]",
//     "expiration_time":1469141375,
//     "pokemonId":"41",
//     "latitude":37.397913111614,
//     "longitude":-121.99693888973,
//     "uid":"808fb62967b:41",
//     "is_alive":true
//   },
//   {
//     "id":"29835933",
//     "data":"[]",
//     "expiration_time":1469141231,
//     "pokemonId":"58",
//     "latitude":37.399003346849,
//     "longitude":-121.98609998867,
//     "uid":"808fc9d0d95:58",
//     "is_alive":true
//   },
//   {
//     "id":"29918689",
//     "data":"[]",
//     "expiration_time":1469141541,
//     "pokemonId":"46",
//     "latitude":37.391671808865,
//     "longitude":-121.98103554397,
//     "uid":"808fc9c32e7:46",
//     "is_alive":true
//   },
//   {
//     "id":"30189856",
//     "data":"[]",
//     "expiration_time":1469141334,
//     "pokemonId":"27",
//     "latitude":37.395149469965,
//     "longitude":-121.98867654605,
//     "uid":"808fc9d9ddd:46",
//     "is_alive":true
//   },
//   {
//     "id":"30189895",
//     "data":"[]",
//     "expiration_time":1469141438,
//     "pokemonId":"46",
//     "latitude":37.395749952886,
//     "longitude":-121.98867654605,
//     "uid":"808fc9d9ddd:46",
//     "is_alive":true
//   }
// ]};
        // process the data
        if (jsonData && jsonData.pokemon && jsonData.pokemon.length > 0) {
          var filteredPokemon = "TEST!\n";
          var currentTime = Math.floor((new Date).getTime() / 1000);
          var pokemons = jsonData.pokemon;

          for (var index = 0; index < pokemons.length; index++) {
            var pokemon = pokemons[index];
            var name = pokemonLib[pokemon.pokemonId];
            var distance = getDistanceFromLatLonInMeter(config.coordinate.latitude, config.coordinate.longitude, pokemon.latitude, pokemon.longitude);
            var until = pokemon.expiration_time - currentTime;
            filteredPokemon += name + " - " + distance + " meter - until " + until + " s\n";
          }
          console.log(filteredPokemon);
          sendData(filteredPokemon);
        }
      } catch (e) {}

    });
});
request.on('error', function (e) {
    console.log(e.message);
});
request.end();



var sendData = function (stringInput) {
  var postData = JSON.stringify({
    "text": stringInput
  });

  var options = {
    hostname: 'hooks.slack.com',
    path: '/services/T0251HS4D/B1U34U0CW/0c6YgxvlYXlmRDdkftt2K5jS',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  var req = https.request(options, function (res) {
    res.on('data', function (chunk) {
      console.log(chunk);
    });
    res.on('end', function () {
      console.log('No more data in response.');
    });
  });

  req.on('error', function (e) {
    console.log("problem with request: " + e.message);
  });

  // write data to request body
  req.write(postData);
  req.end();
};

function getDistanceFromLatLonInMeter(lat1,lon1,lat2,lon2) {
  var R = 6371000; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return Math.floor(d);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
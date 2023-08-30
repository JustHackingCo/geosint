const fs = require("fs");
const https = require("https");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 6958;
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json());

const coords = require('./challs.json');
console.log(coords);

app.get(`/`, function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

for (const [comp, challs] of Object.entries(coords)) {
    for (const [name, {pano, lat, lng, flag}] of Object.entries(challs)) {
    	app.get(`/${comp}-${name}`, function(req, res) {
    	    res.sendFile(__dirname+'/chall.html');
   	 });

    	app.post(`/${comp}-${name}/submit`, (req, res) => {
	    //console.log(req.body);
	    const [ guess_lat, guess_lng ] = req.body;
	    //console.log("lat: " + guess_lat + "\nlng: " + guess_lng);
	    var dist = distance(guess_lat, guess_lng, lat, lng, 'K');
	    //console.log("dist: " + dist);
	    if (dist == 0.0) {
	    	res.send("yes, " + flag);
	    } else {
	    	res.send("not here");
	    }
    	});
    }
}


// Honestly no idea if this is accurate or not :shrug:
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return (dist / 1.609).toFixed(1);
    }
}

// HTTPS
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

https.createServer(options, app).listen(port, function (req, res) {
  console.log(`Server started at port ${port}`);
});

// HTTP
//app.listen(port, () => console.log('Example app is listening on port ' + port +'.'));

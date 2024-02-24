const fs = require("fs");
const https = require("https");
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 6958;
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const defaults = require('./defaults.json');
const info_keys = ["img", "width", "height"];
let challsLastModifiedTime = 0;
let coords = JSON.parse(fs.readFileSync('./challs.json', 'utf8'));
let info = parse_public_info(coords)

console.log(coords);
console.log(info);

app.get(`/`, function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

for (const [comp, challs] of Object.entries(coords)) {
    for (const [name, {pano, lat, lng, flag}] of Object.entries(challs)) {
    	app.get(`/${comp}-${name}`, function(req, res) {
    	    res.render('chall',{'API_KEY': process.env.MAPS_API_KEY});
   	 });

    	app.post(`/${comp}-${name}/submit`, (req, res) => {
	    //console.log(req.body);
	    const [ guess_lat, guess_lng ] = req.body;
	    //console.log("lat: " + guess_lat + "\nlng: " + guess_lng);
	    let dist = distance(guess_lat, guess_lng, lat, lng, 'K');
	    //console.log("dist: " + dist);
	    if (dist == 0.0) {
            console.log(`Correct guess for ${comp}/${name} from ${req.ip}`)
	    	res.send("yes, " + get_flag(comp,name));
	    } else {
	    	res.send("not here");
	    }
    	});
    }
}

app.get('/info.json', (req, res) => {
    coords, info = get_challenge_info(coords);
    console.log(info);
    res.json(info)
});

function get_challenge_info(current_info) {
    fs.stat('./challs.json', (err, stats) => {
        if (err) {
            return res.status(500).send("Error reading file stats");
        }

        const currentModifiedTime = new Date(stats.mtime).getTime();
        if (currentModifiedTime > challsLastModifiedTime) {
            let newData = JSON.parse(fs.readFileSync('./challs.json', 'utf8'));
            console.log("Reading in new challenges.");
            console.log(newData);
            current_info = newData;
            info = parse_public_info(current_info);
            console.log(info);
        }
    });
    return current_info, info
}

function parse_public_info(challenge_info) {
    const newData = {};
    for (const [comp, challs] of Object.entries(challenge_info)) {
        newData[comp] = {}; 
        for (const [name, properties] of Object.entries(challs)) {
            newData[comp][name] = {};
            for (const property of info_keys) {
                const value = properties.hasOwnProperty(property) ? properties[property] : defaults[property];
                newData[comp][name][property] = value;
            }
        }
    }

    return newData
}

function get_flag(comp, name) {
    let file = coords[comp][name]['flag_file'];
    let {flag} = coords[comp][name];
    if (file) {
        let secret = path.join('/run/secrets/',file);
        if (fs.existsSync(file)) {
            console.log(`reading file from ${file}`)
            flag = fs.readFileSync(file);
        } else if (fs.existsSync(secret)) {
            console.log(`reading file from ${secret}`)
            flag = fs.readFileSync(secret);
        }
    }
    return flag;
}

// Honestly no idea if this is accurate or not :shrug:
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        let radlat1 = Math.PI * lat1/180;
        let radlat2 = Math.PI * lat2/180;
        let theta = lon1-lon2;
        let radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.min(dist, 1);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist *= 1.609344 }
        if (unit=="N") { dist *= 0.8684 }
        return (dist / 1.609).toFixed(1);
    }
}

if (process.env.SECURE) {
    // HTTPS
    let key = (process.env.HTTPS_KEY | "server.key");
    let cert = (process.env.HTTPS_CERT | "server.cert");

    const options = {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert),
    };

    https.createServer(options, app).listen(port, function (req, res) {
    console.log(`Server started at port ${port}`);
    });
} else {
    // HTTP
    app.listen(port, () => console.log(`Sever started on port ${port}`));
};




const fs = require('fs');
const fetch = require('node-fetch');

// Read the coordinates from the JSON file
const coords = require('./challs.json');
console.log(coords);

var url;
async function pull(coords) {
for (const [name, {pano, lat, lng, maxZ}] of Object.entries(coords)) {
    for (let z = 0; z <= maxZ; z++) {
    	for (let x = 0; x < 2**z; x++) {
	    for (let y = 0; y < 2**(z-1); y++) {
	    	//url = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${pano}&output=tile&x=${x}&y=${y}&zoom=${z}&nbt=1&fover=2`
		url = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid=${pano}&output=tile&x=${x}&y=${y}&zoom=${z}&nbt=1&fover=2`
		var resp = await fetch(url);
		const contentType = resp.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    console.log(`ERROR from ${name} Tile (${x}, ${y}, ${z})`);
		} else {
		    var blob = await resp.blob();
		    var ab = await blob.arrayBuffer();
		    var fileStream = fs.createWriteStream(`./public/img/${name}/tile_${x}_${y}_${z}.jpeg`);
		    fileStream.write(new Uint8Array(ab));
		    fileStream.end();
		    console.log(`Received ${name} Tile (${x}, ${y}, ${z})`);
		}
	    }
	}
    }
}
}

pull(coords);
console.log("done");


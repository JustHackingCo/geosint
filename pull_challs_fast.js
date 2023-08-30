const fs = require('fs');
const fetch = require('node-fetch');

// Read the coordinates from the JSON file
const coords = require('./challs.json');
console.log(coords);

var url;

async function saveStreetViewTile(x, y, z, comp, name, imgDir, resp) {
    const contentType = resp.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1 && contentType.indexOf("application/json") !== 0) {
        console.log(`ERROR from ${comp}-${name} Tile (${x}, ${y}, ${z}) --- ${contentType.indexOf("application/json")}`);
    } else {
        resp.blob().then(blob => blob.arrayBuffer())
                   .then(ab => {
		       const fileName = `${imgDir}/tile_${x}_${y}_${z}.jpeg`;
                       const fileStream = fs.createWriteStream(fileName);
                       fileStream.write(new Uint8Array(ab));
                       fileStream.end();
                       console.log(`Received ${comp}-${name} Tile (${x}, ${y}, ${z}) ---> ${fileName}`);
                   }).catch(error => {
                       console.error('Error fetching Street View image:', error);
                   });
    }
}

async function pull(coords) {
    for (const [comp, challs] of Object.entries(coords)) {
	compDir = `./public/img/${comp}`
	fs.mkdir(compDir, { recursive: true }, (err) => {if (err) console.error(`Error creating directory: ${err}`);});
    	for (const [name, {panoType, pano, lat, lng, maxZ}] of Object.entries(challs)) {
	    // Make appropriate directories
            imgDir = `./public/img/${comp}/${name}`
            fs.mkdir(imgDir, { recursive: true }, (err) => {if (err) console.error(`Error creating directory: ${err}`);});

	    // Pull Images
    	    for (let z = 0; z <= maxZ; z++) {
            	for (let x = 0; x < 2**z; x++) {
            	    for (let y = 0; y < 2**(z-1); y++) {
                    	if (panoType == 0) {
                    	    url = `https://lh3.ggpht.com/p/${pano}=x${x}-y${y}-z${z}`;
                    	} else {
                    	    url = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid=${pano}&output=tile&x=${x}&y=${y}&zoom=${z}&nbt=1&fover=2`;
                    	}

                    	await fetch(url).then(resp => saveStreetViewTile(x, y, z, comp, name, imgDir, resp));
                        /*    const contentType = resp.headers.get("content-type");
                            if (contentType && contentType.indexOf("application/json") !== -1) {
                            	console.log(`ERROR from ${comp}-${name} Tile (${x}, ${y}, ${z})`);
                            } else {
                            	resp.blob().then(blob => blob.arrayBuffer())
                            	.then(ab => {
                                    const fileStream = fs.createWriteStream(`${imgDir}/tile_${x}_${y}_${z}.jpeg`);
                                    fileStream.write(new Uint8Array(ab));
                                    fileStream.end();
                                    console.log(`Received ${comp}-${name} Tile (${x}, ${y}, ${z})`);
                            	}).catch(error => {
                                    console.error('Error fetching Street View image:', error);
                            	});
                            }
                    	}); */
        	    }
            	}
    	    }
    	}
    }
}

pull(coords);
console.log("done");

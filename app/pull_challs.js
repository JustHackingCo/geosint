const fs = require('fs');
const fetch = require('node-fetch');
const chokidar = require('chokidar');

let url;
let directoryPath;

async function pull(challenges) {
    for (const [comp, challs] of Object.entries(challenges)) {
    	for (const [name, {panoType, pano, maxZ}] of Object.entries(challs)) {
	    if (pano === null) {
			console.log(`Skipping tile retrieval for ${name}.`)
			continue;
		}
		// Make appropriate directories
	    imgDir = `./public/img/${comp}/${name}`
	    fs.mkdir(imgDir, { recursive: true }, (err) => {
			if (err) {
				console.error(`Error creating directory: ${err}`);
			} else {
				console.log(`${imgDir} created successfully.`);
			}
		});
	    	// Pull images
    	    for (let z = 0; z <= maxZ; z++) {
            	for (let x = 0; x < 2**z; x++) {
            	    for (let y = 0; y < 2**(z-1); y++) {
                    	if (panoType == 0) {
                    	    url = `https://lh3.ggpht.com/p/${pano}=x${x}-y${y}-z${z}`;
                    	} else {
                    	    url = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid=${pano}&output=tile&x=${x}&y=${y}&zoom=${z}&nbt=1&fover=2`;
                    	}
                    	let resp = await fetch(url);
                    	const contentType = resp.headers.get("content-type");
                    	if (contentType && contentType.indexOf("application/json") !== -1) {
                    	    console.log(`ERROR from ${comp}-${name} Tile (${x}, ${y}, ${z})`);
                    	} else {
                    	    let blob = await resp.blob();
                    	    let ab = await blob.arrayBuffer();
                    	    let fileStream = fs.createWriteStream(`${imgDir}/tile_${x}_${y}_${z}.jpeg`);
                    	    fileStream.write(new Uint8Array(ab));
                    	    fileStream.end();
                    	    console.log(`Received ${name} Tile (${x}, ${y}, ${z})`);
                    	}
            	    }
            	}
    	    }
    	}
    }
}

function watchJsonFile() {
    const watcher = chokidar.watch('challs.json');
    watcher.on('change', (path) => {
        console.log(`File ${path} has been modified. Processing...`);
		let challenges = require('./challs.json');
        pull(challenges); 
    });
}

if (process.argv[2] === 'continuous') {
    console.log('Continuous mode is enabled. Watching for changes...');
	watchJsonFile(); 
} else {
    let challenges = require('./challs.json');
	console.log('Processing challenges.');
	pull(challenges);
}

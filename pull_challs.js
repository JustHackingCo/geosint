const fs = require('fs');
const vm = require('vm');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

// Create a new JSDOM instance with the HTML content
const jsdom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {});

// Read the coordinates from the JSON file
const coords = require('./challs.json');
console.log(coords);

var script;
var context = vm.createContext({console, setTimeout, fetch, fs, window: jsdom.window, document: jsdom.window.document});
for (const [name, {pano, lat, lng}] of Object.entries(coords)) {
    for (let z = 0; z < 6; z++) {
    	for (let x = 0; x < 2**z; x++) {
	    for (let y = 0; y < 2**(z-1); y++) {
    	    	script = new vm.Script(`
	    	    'use strict';
	    	    const url_${x}_${y}_${z}_${name} = \`https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${pano}&output=tile&x=${x}&y=${y}&zoom=${z}&nbt=1&fover=2\`;

    	    	    fetch(url_${x}_${y}_${z}_${name})
      	      	    	.then(response => response.blob())
       	    	     	.then(blob => blob.arrayBuffer())
		    	.then(ab => {
		    	    const fileStream = fs.createWriteStream('./img/${name}/tile_${x}_${y}_${z}.jpeg');
			    fileStream.write(new Uint8Array(ab));
			    fileStream.end();
			    console.log('Received Tile (${x}, ${y}, ${z})');
      	            	})
      	       	    	.catch(error => {
        	    	    console.error('Error fetching Street View image:', error);
      	    	    	});
    	    	`);
    
    	    	script.runInContext(context);
	    }
	}
    }
}

/* jshint esversion: 6 */
/* jshint node: true */
'use strict';

let map;
let markers = [];
let guess_coordinates = [];
let check_count = 0;
let pano_width = 32;
let pano_height = 16;
let center_loc = {lat: 0.00, lng: 0.00};

// list of icon names
let iconNames = ['cat.ico', 'gamer.ico', 'hacker.ico', 'pizza.ico', 'taco.ico', 'galaxy_brain.ico', 'frogchamp.ico', 'hamhands.ico', 'justin.ico', 'caleb.ico'];

// Get challName
let link = document.location.href.split("/");
let challComp;
if (link[link.length - 1].length == 0) {
    challComp = link[link.length - 2];
} else {
    challComp = link[link.length - 1];
}
let parts = challComp.split("-");
let compName = parts[0];
let challName = parts[1];
let heading = 0;

async function initialize() {
    let panoInfo;
    check_count = 0;

    // GET info.json
    let xhr = new XMLHttpRequest();
    xhr.open("GET", '/info.json', false); // false for synchronous request
    xhr.send( null );
    if (xhr.status == 200) {
    	let infoJson = JSON.parse(xhr.responseText);
    	if (infoJson.hasOwnProperty(compName) && infoJson[compName].hasOwnProperty(challName)) {
	    panoInfo = infoJson[compName][challName];
	    if (panoInfo.hasOwnProperty("width") && panoInfo.hasOwnProperty("height")) {
	    	pano_width = panoInfo.width;
	    	pano_height = panoInfo.height;
	    }
	    if (panoInfo.hasOwnProperty("heading")) {
		heading = panoInfo.heading;
		console.log(`now have heading ${heading}`);
	    }
	}
    }
    
    document.getElementById('chall-title').innerHTML = '<h2>' + challName + '</h2>';
    document.getElementById('chall-result').innerHTML = "Result: ";

    // Map and Map options
    let map = new google.maps.Map(document.getElementById('map'), {
      center: center_loc,
      zoom: 1,
      streetViewControl: false,
      disableDefaultUI: true,
      draggableCursor: 'crosshair',
    });

    // Add Map's Zoom Controls
    let zoomControlDiv = document.createElement('div');
    let zoomControl = new mapZoomControl(zoomControlDiv, map);
    zoomControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(zoomControlDiv);

    // Map Listener 
    google.maps.event.addListener(map, 'click', function(event) {
	placeMarker(event.latLng);
        if (check_count == 0){
          check_count += 1;
	  let sb = document.getElementById("submit");
	  sb.style.backgroundColor = "rgb(109, 185, 52)";
	  sb.style.color = "black";
	  sb.innerHTML = "Submit";
        }
     });
     
    // Map Marker Options
    function placeMarker(location) {
    	deleteMarkers();
        guess_coordinates = [];
	
	
	let cookies = document.cookie.split('; ');
	let icon = 'hacker.ico';
	for (const cookie of cookies) {
    	    let parts = cookie.split('=');
    	    if (parts[0] == "icon" && iconNames.includes(parts[1])) {
        	icon = parts[1];
    	    }
	}
	
        let marker = new google.maps.Marker({
            position: location, 
            map: map,
	    icon: `/img/icons/${icon}`, // get user's icon choice
        });
        markers.push(marker);
        guess_coordinates.push(marker.getPosition().lat(),marker.getPosition().lng());
    }

    // Street View
    let pano = document.getElementById('pano');
    let panoOptions = {
	pano: challName,
	visible: true,
	panControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER},
	zoomControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER}
    };
    const panorama = new google.maps.StreetViewPanorama(pano, panoOptions);
    panorama.registerPanoProvider(getCustomPanorama, {cors: true});
}

// Return a pano image given the panoID.
function getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {
    const origin = document.location.origin;
    return `${origin}/img/${compName}/${challName}/tile_${tileX}_${tileY}_${zoom}.jpeg`;
}

// Construct the appropriate StreetViewPanoramaData given the passed pano IDs.
function getCustomPanorama(pano) {
    return {
	tiles: {
	    tileSize: new google.maps.Size(512, 512),
	    worldSize: new google.maps.Size(512*pano_width, 512*pano_height),
	    centerHeading: heading,
	    getTileUrl: getCustomPanoramaTileUrl,
	},
    };
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
     	markers[i].setMap(map);
    }
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    setMapOnAll(null); // clear markers
    markers = [];
}

// Checks distance from challenge location. If close enough, give flag
function submit() {
    const json = JSON.stringify(guess_coordinates);
    console.log(json);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", document.location.href + "/submit", false); // false for synchronous request
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(json);
    
    let resp = xhr.responseText;
    console.log("response: " + resp);
    document.getElementById("chall-result").innerHTML = resp;
}


// ZoomControl adds +/- button for the map
function mapZoomControl(controlDiv, map) {

    // Creating divs & styles for custom zoom control
    controlDiv.style.padding = '5px';

    // Set CSS for the control wrapper
    let controlWrapper = document.createElement('div');
    controlWrapper.style.backgroundColor = 'transparent';
    controlWrapper.style.cursor = 'pointer';
    controlWrapper.style.textAlign = 'center';
    controlWrapper.style.width = '32px'; 
    controlWrapper.style.height = '64px';
    controlWrapper.style.marginLeft = '2px';
    controlWrapper.style.marginRight = '2px';
    controlDiv.appendChild(controlWrapper);

    // Set CSS for the zoomIn
    let zoomInButton = document.createElement('div');
    zoomInButton.style.width = '24px'; 
    zoomInButton.style.height = '24px';
    zoomInButton.style.borderRadius = '24px';
    zoomInButton.style.marginBottom = '6px';
    zoomInButton.style.backgroundColor = 'white';
    zoomInButton.style.backgroundImage = 'url("/img/plus_sign.svg")';
    controlWrapper.appendChild(zoomInButton);

    // Set CSS for the zoomOut
    let zoomOutButton = document.createElement('div');
    zoomOutButton.style.width = '24px'; 
    zoomOutButton.style.height = '24px';
    zoomOutButton.style.borderRadius = '24px';
    zoomOutButton.style.marginTop = '6px';
    zoomOutButton.style.backgroundColor = 'white';
    zoomOutButton.style.backgroundImage = 'url("/img/minus_sign.svg")';
    controlWrapper.appendChild(zoomOutButton);

    // Setup the click event listener - zoomIn

    google.maps.event.addDomListener(zoomInButton, 'click', function() {
	map.setZoom(map.getZoom() + 1);
	console.log("Zoom: " + map.getZoom());
	mapZoomEvent(zoomOutButton, zoomInButton, map);
    });

    // Setup the click event listener - zoomOut
    google.maps.event.addDomListener(zoomOutButton, 'click', function() {
    	map.setZoom(map.getZoom() - 1);
    	console.log("Zoom: " + map.getZoom());
    	mapZoomEvent(zoomOutButton, zoomInButton, map);
    });  
}

function mapZoomEvent(zoomOutButton, zoomInButton, map) {
    if (map.getZoom() == 22) {
        zoomInButton.style.backgroundColor = 'rgb(255,255,255,0.5)';
    } else if (map.getZoom() == 0) {
        zoomOutButton.style.backgroundColor = 'rgb(255,255,255,0.5)';
    } else {
        zoomInButton.style.backgroundColor = 'white';
        zoomOutButton.style.backgroundColor = 'white';
    }
}

// panoramaZoomControl adds +/- button for the panorama
function panoramaZoomControl(controlDiv, map) {
    // TODO - add custom pano buttons	
}



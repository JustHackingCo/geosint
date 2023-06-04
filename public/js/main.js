'use strict';

var iconNames = ['cat', 'gamer', 'hacker', 'pizza', 'taco', 'galaxy_brain', 'frogchamp', 'hamhands', 'justin', 'caleb'];

// unset style for all icons
function clearIconStyles() {
    var icons = document.getElementsByTagName('img');
    for (const element of icons) {
        element.style = '';
    }
}

// setIcon() runs when user clicks on specific icon
function setIcon(obj) {
    clearIconStyles();
    obj.style = 'background: #e4e4e4;';

    // set user cookie to icon
    var parts = obj.src.split("/");
    var iconName = parts[parts.length - 1];
    document.cookie = `icon=${iconName}`;
}

function setIcons() {
    const iconsDiv = document.getElementById("icons");
    for (const iconName of iconNames) {
        const icon = document.createElement("img");
	icon.id = "icon";
	icon.src = `/img/icons/${iconName}.ico`;
	icon.onclick = function() {setIcon(this);};
	iconsDiv.appendChild(icon);
    }
}

// setCards() runs on body load
function setCards() {
    // GET info.json
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/info.json', false); // false for synchronous request
    xhr.send( null );
    if (xhr.status != 200) {
	return;
    }

    var infoJson = JSON.parse(xhr.responseText);
    var buttons = document.getElementsByTagName('button');
    const compsDiv = document.getElementById("competitions");

    // Make the competitions div structure
    for (const comp in infoJson) {
	const challs = infoJson[comp];
	const challSelectDiv = document.createElement("div");
	challSelectDiv.id = "chall-select";
	
	// Competition title
	const challTitle = document.createElement("h4");
  	challTitle.id = "chall-title";
  	challTitle.textContent = `${comp}:`;
  	challSelectDiv.appendChild(challTitle);

	// Cards div structure
	const cardsDiv = document.createElement("div");
  	cardsDiv.id = "cards";
	for (const challName in challs) {
	    const challInfo = challs[challName];
	    const button = document.createElement("button");
    	    button.id = "chall-card";
    	    button.textContent = challName; // TODO - add regex to grab number instead of full challName
    	    button.onclick = function() {
      	    	window.location = `/${comp}-${challName}`;
    	    };
	    
	    if (challInfo.hasOwnProperty("img")) {
		var img = challInfo.img;
		button.style.backgroundImage = `url('../img/${comp}/${challName}/${img}')`;
	    }

    	    cardsDiv.appendChild(button);
	}

	challSelectDiv.appendChild(cardsDiv);
  	compsDiv.appendChild(challSelectDiv);
    }

    setIcons();
} 


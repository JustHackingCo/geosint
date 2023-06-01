'use strict';

function setIcon(obj) {
    // unset style for icons, set style for current object
    var icons = document.getElementsByTagName('img');
    for (const element of icons) {
    	element.style = '';
    }
    obj.style = 'background: #e4e4e4;';

    // set user cookie to icon
    var parts = obj.src.split("/");
    var iconName = parts[parts.length - 1];
    //console.log("iconName: " + iconName);
    document.cookie = `icon=${iconName}`;
}

function setImages() {
    // GET info.json
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/info.json', false); // false for synchronous request
    xhr.send( null );
    console.log(xhr.status);
    if (xhr.status == 200) {
        var infoJson = JSON.parse(xhr.responseText);
	var buttons = document.getElementsByTagName('button');
	for (var challName in infoJson) {
	    var panoInfo = infoJson[challName];
        
            if (panoInfo.hasOwnProperty("img")) {
          	var img = panoInfo.img;
          	//console.log(challName + ": " + img);
		for (var i = 0; i < buttons.length; i++) {
		    var buttonText = buttons[i].textContent;
		    if (buttonText.includes(challName)) {
			buttons[i].style.backgroundImage = "url('../img/" + challName + "/" + img + "')";
			console.log("Button text: " + buttonText);
			break;
		    }
		}
            }
	}
    } 
}

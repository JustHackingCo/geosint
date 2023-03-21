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

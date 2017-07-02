var i;
iconURL = chrome.extension.getURL("/icons/button-icon.png");

// check elements mouse is hover
document.addEventListener("mouseover", addCropLink, true);
document.addEventListener("mouseout", removeCropLink, true);

// add crop link if element is image
function addCropLink(){
	var target = event.target;
	if (target instanceof HTMLImageElement){
		var hoverDiv = document.createElement("div");
		hoverDiv.setAttribute("class", "resizeMyPhoto");
		hoverDiv.setAttribute("id", "resizeMyPhoto");
		var cropLink = document.createElement("a");
		cropLink.innerHTML += "Crop/Resize";
		cropLink.href = chrome.extension.getURL("index.html#");
		cropLink.href = cropLink.href + target.src
		hoverDiv.appendChild(cropLink);
		target.parentNode.insertBefore(hoverDiv, target.nextSibling);
	}
}

// remove crop link if element is image
function removeCropLink(){
	var target = event.target;
	if (target instanceof HTMLImageElement){
		var hoverDiv = document.getElementById("resizeMyPhoto");
		hoverDiv.parentNode.removeChild(hoverDiv);
	}
}
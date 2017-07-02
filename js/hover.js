var i;
iconURL = chrome.extension.getURL("/icons/button-icon.png");

// check elements mouse is hover
document.addEventListener("mouseover", addCropLink, true);
document.addEventListener("mouseout", removeCropLink, true);

// add crop link if element is image
function addCropLink(){
	var target = event.target;
	if (target instanceof HTMLImageElement){
		var cropLink = document.createElement("a");
		cropLink.setAttribute("class", "resizeMyPhoto");
		cropLink.setAttribute("id", "resizeMyPhoto");
		cropLink.setAttribute("target", "_blank");
		cropLink.innerHTML += "Crop/Resize";
		cropLink.href = chrome.extension.getURL("index.html#");
		cropLink.href = cropLink.href + target.src;
		target.parentNode.style.position = "relative";
		target.parentNode.style.display = "inline-block";
		target.parentNode.insertBefore(cropLink, target.nextSibling);
	}
}

// remove crop link if element is image
function removeCropLink(){
	var target = event.target;
	if (target instanceof HTMLImageElement){
		var cropLink = document.getElementById("resizeMyPhoto");
		cropLink.parentNode.removeChild(cropLink);
	}
}
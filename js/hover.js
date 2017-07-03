iconURL = chrome.extension.getURL("/icons/button-icon.png");

// check elements mouse is hover
document.addEventListener("mouseover", setLink, true);

// handles creating of the crop link
function setLink(){
	var target = event.target;
	if (target instanceof HTMLImageElement){
		// make sure no links are visible
		var cropLink = document.getElementById("resizeMyPhoto");
		if (cropLink !== null){
			cropLink.parentNode.removeChild(cropLink);
		}
		// create the link
		else{
			cropLink = document.createElement("a");
			cropLink.setAttribute("class", "resizeMyPhoto");
			cropLink.setAttribute("id", "resizeMyPhoto");
			cropLink.setAttribute("target", "_blank");
			cropLink.innerHTML += "Crop/Resize";
			cropLink.href = chrome.extension.getURL("index.html#") + target.src;
			target.parentNode.style.position = "relative";
			target.parentNode.style.display = "inline-block";
			target.parentNode.insertBefore(cropLink, target.nextSibling);
		}
	}
	else{
		var cropLink = document.getElementById("resizeMyPhoto");
		// make sure mouse is not on link
		if(target == cropLink || cropLink == null){
			return;
		}
		// remove the link
		else{
			cropLink.parentNode.removeChild(cropLink);
		}
	} 
}
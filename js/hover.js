iconURL = chrome.extension.getURL("/icons/button-icon.png");

// check elements mouse is hover
document.addEventListener("mouseover", setLink, true);

// handles creating of the crop link
function setLink(){
	var target = event.target;
	if (target instanceof HTMLImageElement){
		// make sure no links are visible
		var cropLink = document.getElementById("resizeMyPhoto");
		var cropDiv = document.getElementById("resizeMyPhotoDiv");
		if (cropDiv !== null){
			var fragment = document.createDocumentFragment();
			fragment.appendChild(cropDiv.firstElementChild);
			cropDiv.removeChild(cropLink);
			cropDiv.parentNode.replaceChild(fragment, cropDiv);
		}
		// create the link
		else{
			cropDiv = document.createElement("div");
			cropDiv.setAttribute("id", "resizeMyPhotoDiv");
			target.parentNode.appendChild(cropDiv);
			cropDiv.appendChild(target);
			cropLink = document.createElement("a");
			cropLink.setAttribute("class", "resizeMyPhoto");
			cropLink.setAttribute("id", "resizeMyPhoto");
			cropLink.setAttribute("target", "_blank");
			cropLink.innerHTML += "Crop/Resize";
			cropLink.href = chrome.extension.getURL("index.html#") + target.src;
			cropDiv.appendChild(cropLink);
		}
	}
	else{
		var cropLink = document.getElementById("resizeMyPhoto");
		var cropDiv = document.getElementById("resizeMyPhotoDiv");
		// make sure mouse is not on link
		if(target == cropLink || cropLink == null){
			return;
		}
		// remove the link
		else{
			var fragment = document.createDocumentFragment();
			fragment.appendChild(cropDiv.firstElementChild);
			cropDiv.removeChild(cropLink);
			cropDiv.parentNode.replaceChild(fragment, cropDiv);
		}
	}
}
var i;

if (document.readyState == "complete"){
	var imagesList = document.images;
	for (i = 0; i < imagesList.length; i++) {
		addCropLink(imagesList[i]);
	}
}
else{
	document.onreadystatechange = function () {
		if (document.readyState == "complete"){
			var imagesList = document.images;
			for (i = 0; i < imagesList.length; i++) {
				addCropLink(imagesList[i]);
			}
		}
	}
}

function addCropLink(image){
	var hoverDiv = document.createElement("div");
	var cropLink = document.createElement("a");
	cropLink.href = chrome.extension.getURL("index.html#");
	cropLink.href = cropLink.href + image.src
	hoverDiv.appendChild(cropLink);
	image.parentNode.insertBefore(hoverDiv, image.nextSibling);
}
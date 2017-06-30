debugger;
document.onreadystatechange = function () {
	if (document.readyState == "complete"){
		console.log("resize.myphoto extention loaded");
		var imagesList = document.images;
		var i;
		var hoverDiv = document.createElement("div");
		var cropLink = document.createElement("a");
		cropLink.href = chrome.extension.getURL("index.html");

		console.log(imagesList);
		for (i = 0; i < imagesList.length; i++) {
			cropLink.href = cropLink.href + "#" + imagesList[i].src
			hoverDiv.appendChild(cropLink);
			imagesList[i].parentNode.insertBefore(hoverDiv, imagesList[i].nextSibling);
		}
	}
}
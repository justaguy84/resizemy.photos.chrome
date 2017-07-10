iconURL = chrome.extension.getURL("/icons/button-icon.png");

// check extention status
chrome.runtime.sendMessage({status: "getStatus"}, function(response) {
	if (response.status == 'true'){
		createLink();
    	// check elements mouse is hover
		document.addEventListener("mousemove", setLink, true);
	}
	else{
		document.body.removeChild(cropperExtension.link);
   		document.removeEventListener("mousemove", setLink, true);
   	}
});

// wait for massage from background script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.status == 'true'){
    	createLink();
    	// check elements mouse is hover
		document.addEventListener("mousemove", setLink, true);
	}
	else{
		document.body.removeChild(cropperExtension.link);
   		document.removeEventListener("mousemove", setLink, true);
   	}
});

var cropperExtension = {};
function createLink() {
  var link = document.createElement("a");
  link.innerHTML += "Crop/Resize";
  link.setAttribute("id","resizeMyPhoto");
  link.setAttribute("target", "_blank");
  document.body.appendChild (link);
  cropperExtension.link = link;
};
function setLinkVisibility(shouldShow) {
  var link = cropperExtension.link;
  var displayValue = shouldShow ? "block" : "none";
  if (shouldShow) {
    var pos = getPosition(cropperExtension.curImage);
    link.style.top = (pos.top + 10) + "px";
    link.style.left = (pos.left + 10) + "px"
    link.href = chrome.extension.getURL("index.html#") + cropperExtension.curImage.src; 
    console.log("showing link",pos);
  }
  link.style.display = displayValue;
}
function getPosition(el) {
  var bodyRect = document.body.getBoundingClientRect(),
    elemRect = el.getBoundingClientRect(),
    top   = elemRect.top - bodyRect.top,
    left  = elemRect.left - bodyRect.left;
  return {left:left, top:top};
}
function setLink(e){
	if (e.srcElement.nodeName === "IMG" && e.srcElement !== cropperExtension.curImage && e.srcElement.width >= 150) {
    	console.log("new image hover", e.srcElement);
	    cropperExtension.curImage = e.srcElement;
    	setLinkVisibility (true);
  	} else if (e.srcElement.nodeName !== "IMG" && e.srcElement !== cropperExtension.link) {
    	//we are off the image and off the link, hide the link
	    console.log("out of image")
    	cropperExtension.curImage = null;
    	setLinkVisibility(false);
  	}
}
/*
// handles creating of the crop link
function setLink(){
	var target = event.target;
	if (target instanceof HTMLImageElement && target.width >= 150){
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
		cropLink.style.marginTop = target.style.marginTop;
		cropDiv.appendChild(cropLink);
		cropDiv.appendChild(cropLink);
	}
	else{
		var cropLink = document.getElementById("resizeMyPhoto");
		var cropDiv = document.getElementById("resizeMyPhotoDiv");
		// make sure mouse is not on link
		if(target === cropLink || cropLink === null){
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
}*/
// check extention status
chrome.runtime.sendMessage({status: "getStatus"}, function(response) {
	if (response.status == 'true'){
		createLink();
    	// check elements mouse is hover
		document.addEventListener("mousemove", setLink, true);
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
    link.style.right = (pos.right + 10) + "px"
    link.href = chrome.extension.getURL("index.html#") + cropperExtension.curImage.src; 
  }
  link.style.display = displayValue;
}
function getPosition(el) {
  var bodyRect = document.body.getBoundingClientRect(),
    elemRect = el.getBoundingClientRect(),
    top   = elemRect.top - bodyRect.top,
    right  = bodyRect.right - elemRect.right;
  return {right:right, top:top};
}
function setLink(e){
	if (e.srcElement.nodeName === "IMG" && e.srcElement !== cropperExtension.curImage && e.srcElement.width >= 150) {
	    cropperExtension.curImage = e.srcElement;
    	setLinkVisibility (true);
  	} else if (e.srcElement.nodeName !== "IMG" && e.srcElement !== cropperExtension.link) {
    	//we are off the image and off the link, hide the link
    	cropperExtension.curImage = null;
    	setLinkVisibility(false);
  	}
}
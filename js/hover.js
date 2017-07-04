iconURL = chrome.extension.getURL("/icons/button-icon.png");

//prepare google analytics tracking
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-101979275-1', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/hover.html');

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
			ga('send', 'event', 'image', 'link created');
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
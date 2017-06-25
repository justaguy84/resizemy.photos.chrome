function scanImages() {
  
  var images = document.getElementsByTagName('img');
  for(var i = 0; i < images.length; i++)
    {
        var img = images[i];
        console.debug(img.src);
        if(img.src.length > 0)
        {
          img.style.border = "thick solid #0000FF";
            //addModel(img)
        }
    }
}


function addModel(referenceNode){
  var el = document.createElement("span");
  el.innerHTML = "test";
  referenceNode.after(el);
}

document.addEventListener('DOMContentLoaded', function() {
  scanImages();
});
//prepare google analytics tracking
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-101979275-1', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/cropper.html');

window.onload = function () {

  'use strict';

  //set vars for common elements
  var Cropper = window.Cropper;
  var container = document.getElementById('img-container');
  var prepareImage = document.getElementById('prepareImage');
  var custom = document.getElementById('custom');
  var preset = document.getElementById('preset');
  var presetGroups = document.getElementById('preset-groups');
  var download = document.getElementById('download');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  var fileName = document.getElementById('file-name');
  var fileSize = document.getElementById('file-size');
  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  //usful functions
  function updateImageInfo(name,w,h){
    fileName.innerHTML = name;
    fileSize.innerHTML = 'Original size: ' + w + 'x' + h;
  }
  function  updateWHInputs(w,h){
    dataHeight.value = Math.round(h);
    dataWidth.value = Math.round(w);
  }
  function removeActive(object){
    object.classList.remove("active");
  }
  function addActive(object){
    object.classList.add("active");
  }

  //prepare cropper options
  var options = {
    aspectRatio: 16 / 9,
    zoomable: false,
    checkCrossOrigin: true,
    ready: function (e) {
      console.log(e.type);
      },
    cropstart: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropmove: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropend: function (e) {
      console.log(e.type, e.detail.action);
    },
    crop: function (e) {
      var data = e.detail;
      console.log(e.type);
    },
    zoom: function (e) {
      console.log(e.type, e.detail.ratio);
    }
  };

  // prepare image
  var imageUrl = window.location.hash.substring(1);
  var image = container.getElementsByTagName('img').item(0);
  if (imageUrl){
    image.src = imageUrl;
    ga('send', 'event', 'image', 'image loaded',imageUrl);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", imageUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        new Cropper(image, {
          ready: function () {
            cropper['replace'](imageUrl);
          }
        });
      }
    }
    xhr.send();
  }
  image.onload = function(){
    var imageName = image.getAttribute('src');
    var imageWidth = image.naturalWidth;
    var imageHeight = image.naturalHeight;

    // preset info on page
    updateImageInfo(imageName,imageWidth,imageHeight);
    updateWHInputs(imageWidth,imageHeight);
  }

  //create cropper
  var cropper = new Cropper(image, options);
  
  //preset tabs
  presetGroups.onclick = function (event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    if (target.type !== ''){
      removeActive($("#preset-groups >li.active")[0]);
      var socialTarget = '#'+target.parentElement.className;
      addActive(target.parentElement);
      removeActive($("#standard >div.active")[0]);
      addActive($(socialTarget)[0]);
    }
  }

  // set active part
  custom.onclick = function (event){
    addActive(this);
    removeActive(preset);
  }
  preset.onclick = function (event){
    addActive(this);
    removeActive(custom);
  }

  
  // set image/cropper size
  // handle custom input:
  custom.oninput = function (event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var data;
    var imageData;
    var croppertimer
    var keepRatio = document.getElementById("keep-ratio").checked;

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };
    if (!cropper || (target.type === undefined)) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }
    if (keepRatio){
      if (target.id === 'dataWidth'){
          dataHeight.value = Math.round(target.value * (image.naturalHeight/image.naturalWidth));
        }
      else if (target.id === 'dataHeight') {
          dataWidth.value = Math.round(target.value * (image.naturalWidth/image.naturalHeight));
      }
      imageData = cropper['getImageData']();
      options['aspectRatio'] = imageData.aspectRatio;
      options['top'] = 0;
      options['left'] = 0;
      options['autoCropArea'] = 1;
    }
    else{
      options['aspectRatio'] = Math.round(dataWidth.value/dataHeight.value);
    }

    // Restart
    delay(function(){
      addActive($('#custom-sizes input')[0]);
      removeActive($('.box.btn.active')[0]);
      prepareImage.setAttribute('data-option', '{ "width": '+dataWidth.value+', "height": '+dataHeight.value+' }');
      ga('send', 'event', 'image', 'image cropped','{ "width": '+dataWidth.value+', "height": '+dataHeight.value+' }');
      target.disabled = true;
      cropper.destroy();
      cropper = new Cropper(image, options);
      target.disabled = false;
    },1000);
  }

  preset.onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var data;
    var imageData;

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };

    if (!cropper || (target.type === undefined)) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }
    
    //set preset sizes
    options[target.name] = target.value;
    addActive(target.parentNode);
    removeActive($('#custom-sizes input')[0]);
    removeActive($('.box.btn.active')[0]);
    prepareImage.setAttribute('data-option', data.option);
    ga('send', 'event', 'image', 'image cropped',data.option);
    options.ready = function () {
      console.log('ready');
    };
    // Restart
    cropper.destroy();
    cropper = new Cropper(image, options);
  };

  // set download button
  download.onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var result;
    var input;
    var data;
    var cropedImageName = "cropped.";
    var cropedImageType;

    if (!cropper) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option'),
    };

    if (data.method === 'getCroppedCanvas') {
      data.optionJson = JSON.parse(data.option);
      result = cropper[data.method](data.optionJson, data.secondOption);
      if (result) {
        // prepare image and auto download
            
        // get filetype and set download name
        cropedImageType = $('input[name="fileType"]:checked').val();
        if (cropedImageType === 'image/jpeg'){
          cropedImageName = cropedImageName + 'jpg';
        }
        else{
          cropedImageName = cropedImageName + 'png';
        }

       //draw image
        //$('#getCroppedCanvasModal').find('.modal-body').html(result);

        // start auto download of image
        var a = $("<a>").attr("href", result.toDataURL(cropedImageType)).attr("download", cropedImageName).appendTo("body");
        a[0].click();
        a.remove();
        ga('send', 'event', 'image', 'image downloaded',data.option);
      }
    }
  };

};
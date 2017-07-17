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
  var preset = document.getElementById('preset');
  var crop = document.getElementById('crop');
  var resize = document.getElementById('resize');
  var presetGroups = document.getElementById('preset-groups');
  var download = document.getElementById('download');
  var dataWidth = document.getElementById('dataWidth');
  var dataHeight = document.getElementById('dataHeight');
  var cropDataWidth = document.getElementById('cropDataWidth');
  var cropDataHeight = document.getElementById('cropDataHeight');
  var fileName = document.getElementById('file-name');
  var fileSize = document.getElementById('file-size');
  var cutomCrop = document.getElementById('cutomCrop');
  var freeMode = document.getElementById('freeMode');
  var resizePercent = document.getElementById('resizePercent');
  var resizeCustom = document.getElementById('resizeCustom');
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
    dataWidth.value = Math.round(w);
    dataHeight.value = Math.round(h);
  }
  function updateCropWHInputs(w,h){
    cropDataWidth.value = Math.round(w);
    cropDataHeight.value = Math.round(h);
  }
  function removeClass(object,css){
    if (object){
      object.classList.remove(css);
    }
  }
  function addClass(object,css){
    if (object) {
      object.classList.add(css);
    }
  }
  function checkActive(css){
    return (document.querySelector(css));
  }
  function prepareDownload(fileName,width,height){
    prepareImage.setAttribute('data-option', '{ "width": '+Math.round(width)+', "height": '+Math.round(height)+' }');
    prepareImage.setAttribute('data-file-name',fileName+'-'+Math.round(width)+'x'+Math.round(height));
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
      if (checkActive('.active-section').id == 'crop' && freeMode.checked==true){
        updateCropWHInputs(Math.round(data.width),Math.round(data.height));
        prepareDownload('freeMode',data.width,data.height);
        delay(function(){
          ga('send', 'event', 'image', 'image cropped','{ "width": '+Math.round(data.width)+', "height": '+Math.round(data.height)+' }');
        },1000);
      }
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
      removeClass($("#preset-groups >li.active-preset-category")[0],"active-preset-category");
      var socialTarget = '#'+target.parentElement.className;
      addClass(target.parentElement,"active-preset-category");
      removeClass($("#standard >div.active-preset-category")[0],"active-preset-category");
      addClass($(socialTarget)[0],"active-preset-category");
    }
  }

  // set active part
  resize.onclick = function (event){
    removeClass(checkActive('.active-section'),"active-section");
    addClass(this,"active-section");
  }
  preset.onclick = function (event){
    removeClass(checkActive('.active-section'),"active-section");
    addClass(this,"active-section");
  }
  crop.onclick = function (event){
    removeClass(checkActive('.active-section'),"active-section");
    addClass(this,"active-section");
  }

  preset.onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var data;

    data = {
      option: target.getAttribute('data-option')
    };

    if (!cropper || (target.type === undefined)) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }
    
    //set preset sizes
    data.optionJson = JSON.parse(data.option);
    cutomCrop.checked = true;
    updateCropWHInputs(data.optionJson.width,data.optionJson.height);
    removeClass($('.box.btn.active-item')[0],"active-item");
    addClass(target.parentNode,"active-item");
    removeClass($('#custom-sizes input')[0],"active-item");
    prepareDownload(target.id,data.optionJson.width,data.optionJson.height);
    ga('send', 'event', 'image', 'image cropped',data.option);
    options.ready = function () {
      console.log('ready');
    };
    // Restart
    cropper.setAspectRatio(target.value);
  };

  freeMode.onclick = function(event){
    cropper.setAspectRatio("NaN");
  };

  cutomCrop.onclick = function(event){
    updateCropWHInputs(Math.round(image.naturalWidth),Math.round(image.naturalHeight));
    cropper.setAspectRatio(Math.round(image.naturalWidth)/Math.round(image.naturalHeight));
    prepareDownload('custom-crop',Math.round(image.naturalWidth),Math.round(image.naturalHeight));
    delay(function(){
      ga('send', 'event', 'image', 'image cropped','{ "width": '+Math.round(image.naturalWidth)+', "height": '+Math.round(image.naturalHeight)+' }');
    },1000);
  };

  crop.oninput = function(event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var fileName = "custom-crop";
    cutomCrop.checked = true;

    if (!cropper || (target.type === undefined)) {
      return;
    }

    cropper.setAspectRatio(Math.round(cropDataWidth.value) / Math.round(cropDataHeight.value));
    prepareDownload(fileName,Math.round(cropDataWidth.value),Math.round(cropDataHeight.value));
    delay(function(){
      ga('send', 'event', 'image', 'image cropped','{ "width": '+dataWidth.value+', "height": '+dataHeight.value+' }');
    },1000);
  }

  // set image/cropper size
  // handle custom input:
  resize.oninput = function (event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var imageData;
    var croppertimer;
    var fileName;
    

    if (!cropper || (target.type === undefined)) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }
    if (target.id === 'dataWidth'){
        dataHeight.value = Math.round(target.value * (image.naturalHeight/image.naturalWidth));
        resizeCustom.checked = true;
        fileName = "resize-custom";
        datePercent.value = (100/(image.naturalWidth / target.value))/100;
        datePercentValue.innerHTML = (100/(image.naturalWidth / target.value)).toFixed(2);
      }
    else if (target.id === 'dataHeight') {
        dataWidth.value = Math.round(target.value * (image.naturalWidth/image.naturalHeight));
        resizeCustom.checked = true;
        fileName = "resize-custom";
        datePercent.value = (100/(image.naturalHeight / target.value))/100;
        datePercentValue.innerHTML = (100/(image.naturalHeight / target.value)).toFixed(2);
    }
    else if (target.id === 'datePercent'){
      updateWHInputs (Math.round(image.naturalWidth * target.value),Math.round(image.naturalHeight * target.value))
      datePercentValue.innerHTML = Math.round(target.value *100);
      resizePercent.checked = true;
      fileName = "resize-percent";
    }
    imageData = cropper['getImageData']();
    options['aspectRatio'] = imageData.aspectRatio;
    options['top'] = 0;
    options['left'] = 0;
    options['autoCropArea'] = 1;

    // Restart
    delay(function(){
      addClass($('#custom-sizes input')[0],"active-item");
      removeClass($('.box.btn.active')[0],"active-item");
      prepareDownload(fileName,dataWidth.value,dataHeight.value);
      ga('send', 'event', 'image', 'image cropped','{ "width": '+dataWidth.value+', "height": '+dataHeight.value+' }');
      target.disabled = true;
      cropper.destroy();
      cropper = new Cropper(image, options);
      target.disabled = false;
    },1000);
  }

  // set download button
  download.onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var result;
    var input;
    var data;
    var croppedImageName;
    var croppedImageType;

    if (!cropper) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      option: target.getAttribute('data-option'),
      fileName: target.getAttribute('data-file-name'),
    };

    if (data.method === 'getCroppedCanvas') {
      data.optionJson = JSON.parse(data.option);
      croppedImageName = data.fileName;
      result = cropper[data.method](data.optionJson);
      if (result) {
        // prepare image and auto download
            
        // get filetype and set download name
        croppedImageType = $('input[name="fileType"]:checked').val();
        if (croppedImageType === 'image/jpeg'){
          croppedImageName = croppedImageName + '.jpg';
        }
        else{
          croppedImageName = croppedImageName + '.png';
        }

       //draw image
        //$('#getCroppedCanvasModal').find('.modal-body').html(result);

        // start auto download of image
        var a = $("<a>").attr("href", result.toDataURL(croppedImageType)).attr("download", croppedImageName).appendTo("body");
        a[0].click();
        a.remove();
        ga('send', 'event', 'image', 'image downloaded',croppedImageName);
      }
    }
  };

};
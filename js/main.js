window.onload = function () {

  'use strict';
  //set vars for common elements
  var Cropper = window.Cropper;
  var container = document.querySelector('#img-container');
  var image = container.getElementsByTagName('img').item(0);
  var imageName = image.getAttribute('src');
  var imageWidth = image.naturalWidth;
  var imageHeight = image.naturalHeight;
  var prepareImage = document.getElementById('prepareImage');
  var actions = document.getElementById('editor');
  var download = document.getElementById('download');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');

  //prepare cropper options
  var options = {
        aspectRatio: 16 / 9,
        zoomable: false,
        preview: '.img-preview',
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

  //create cropper    
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;

  //socail tabs
  actions.querySelector('#social-icons').onclick = function (event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    if (target.type !== ''){
      var socialTarget = '#'+target.parentElement.className;
      var boxes = document.getElementById('social-boxes');
      $("#social-boxes >div.active").removeClass("active");
      boxes.querySelector(socialTarget).classList.add("active");
    }
  }

  // set image/cropper size
  actions.onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var isRadio;
    var isText;
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

    isRadio = target.type === 'radio';
    isText = target.type === 'text';

    //set preset sizes
    if (isRadio) {
      options[target.name] = target.value;
      $('.box.btn.active').removeClass('active');
      $('#custom-sizes input').removeClass('active');
      target.parentNode.classList.add("active");
      prepareImage.setAttribute('data-option', data.option);
      options.ready = function () {
        console.log('ready');
      };
    }

    //set custom size
    if(isText){
      if (target.id === 'dataWidth'){
        dataHeight.value = Math.round(target.value * (image.naturalHeight/image.naturalWidth));
      }
      else if (target.id === 'dataHeight') {
        dataWidth.value = Math.round(target.value * (image.naturalWidth/image.naturalHeight));
      }
      $('.box.btn.active').removeClass('active');
      $('#custom-sizes input').addClass('active');
      prepareImage.setAttribute('data-option', '{ "width": '+dataWidth.value+', "height": '+dataHeight.value+' }');
      imageData = cropper['getImageData']();
      options['aspectRatio'] = imageData.aspectRatio;
      options['top'] = 0;
      options['left'] = 0;
      options['autoCropArea'] = 1;
    }

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
      secondOption: target.getAttribute('data-second-option')
    };

    if (data.method === 'getCroppedCanvas') {
      data.option = JSON.parse(data.option);
      result = cropper[data.method](data.option, data.secondOption);
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
      }
    }
  };

  // preset info on page
  document.getElementById('file-name').innerHTML = imageName;
  document.getElementById('file-size').innerHTML = 'Original size: ' + imageWidth + 'x' + imageHeight;
  dataHeight.value = Math.round(imageHeight);
  dataWidth.value = Math.round(imageWidth);
};
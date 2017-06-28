window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('#img-container');
  var image = container.getElementsByTagName('img').item(0);
  var imageName = image.getAttribute('src');
  var imageWidth = image.naturalWidth;
  var imageHeight = image.naturalHeight;
  var imageRatio = image.aspectRatio;
  var info = document.getElementById('info');
  var download = document.getElementById('download-btn');
  var prepareImage = document.getElementById('prepareImage');
  var actions = document.getElementById('wrapper');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
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
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;
  var uploadedImageURL;

  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  //socail tabs
  actions.querySelector('#social-icons').onclick = function (event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var socialTarget = '#'+target.parentElement.className;
    var boxes = document.getElementById('social-boxes');

    $("#social-boxes >div.active").removeClass("active");
    boxes.querySelector(socialTarget).classList.add("active")
  }

  // Options
  actions.querySelector('#editor').onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropBoxData;
    var canvasData;
    var isRadio;
    var isText;
    var data;
    var imageData;
    var result;

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };

    if (!cropper) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }

    isRadio = target.type === 'radio';
    isText = target.type === 'text';

    if (isRadio) {
      options[target.name] = target.value;
      $('.box.btn.active').removeClass('active');
      target.parentNode.classList.add("active");
      prepareImage.setAttribute('data-option', data.option);
      options.ready = function () {
        console.log('ready');
      };
    }

    if(isText){
      if (target.id === 'dataWidth'){
        dataHeight.value = Math.round(target.value * (image.naturalHeight/image.naturalWidth));
      }
      else if (target.id === 'dataHeight') {
        dataWidth.value = Math.round(target.value * (image.naturalWidth/image.naturalHeight));
      }
      $('.box.btn.active').removeClass('active');
      prepareImage.setAttribute('data-option', '{ "width": '+dataWidth.value+', "height": '+dataHeight.value+' }');
      imageData = cropper['getImageData']();
      //result = cropper['setCropBoxData'](imageData,null);
      options['aspectRatio'] = imageData.aspectRatio;
      options['top'] = 0;
      options['left'] = 0;
      options['autoCropArea'] = 1;
      //result = cropper['setCropBoxData'](JSON.parse('{"left":0,"top":0,"width": '+image.naturalWidth+', "height": '+image.naturalHeight+', "aspectRatio": '+image.aspectRatio+' }'), null);
      //return;
    }

    // Restart
    cropper.destroy();
    cropper = new Cropper(image, options);
  };
  // Methods
  actions.querySelector('#download').onclick = function (event) {
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

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      if (data.method === 'getCroppedCanvas') {
        data.option = JSON.parse(data.option);
      }

      result = cropper[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'getCroppedCanvas':
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
            $('#getCroppedCanvasModal').find('.modal-body').html(result);

            // start auto download of image
            var a = $("<a>").attr("href", result.toDataURL(cropedImageType)).attr("download", cropedImageName).appendTo("body");
            a[0].click();
            a.remove();

          }

          break;

        case 'destroy':
          cropper = null;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            image.src = originalImageURL;
          }

          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  };

  document.getElementById('file-name').innerHTML = imageName;
  document.getElementById('file-size').innerHTML = 'Original size: ' + imageWidth + 'x' + imageHeight;
  dataHeight.value = Math.round(imageHeight);
  dataWidth.value = Math.round(imageWidth);
};
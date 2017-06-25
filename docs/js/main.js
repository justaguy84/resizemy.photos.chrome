window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('#img-container');
  var image = container.getElementsByTagName('img').item(0);
  var imageName = image.getAttribute('src');
  var imageWidth = image.naturalWidth;
  var imageHeight = image.naturalHeight;
  var info = document.getElementById('info');
  var download = document.getElementById('download');
  var actions = document.getElementById('left-side');
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
          dataHeight.value = Math.round(data.height);
          dataWidth.value = Math.round(data.width);
        },
        zoom: function (e) {
          console.log(e.type, e.detail.ratio);
        }
      };
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;
  var uploadedImageURL;

  // Options
  actions.querySelector('#crop-standard').onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropBoxData;
    var canvasData;
    var isRadio;

    if (!cropper) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }

    isRadio = target.type === 'radio';

    if (isRadio) {
      options[target.name] = target.value;
      options.ready = function () {
        console.log('ready');
      };
    }

    // Restart
    cropper.destroy();
    cropper = new Cropper(image, options);
  }

  document.getElementById('file-name').innerHTML = imageName;
  document.getElementById('file-size').innerHTML = 'Original size: ' + imageWidth + 'x' + imageHeight;
};
window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('#img-container');
  var image = container.getElementsByTagName('img').item(0);
  var download = document.getElementById('download');
  var actions = document.getElementById('left-side');
  var dataX = document.getElementById('dataX');
  var dataY = document.getElementById('dataY');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  var dataRotate = document.getElementById('dataRotate');
  var dataScaleX = document.getElementById('dataScaleX');
  var dataScaleY = document.getElementById('dataScaleY');
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
          dataX.value = Math.round(data.x);
          dataY.value = Math.round(data.y);
          dataHeight.value = Math.round(data.height);
          dataWidth.value = Math.round(data.width);
          dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
          dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
          dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
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
    var isCheckbox;
    var isRadio;

    if (!cropper) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }

    isCheckbox = target.type === 'checkbox';
    isRadio = target.type === 'radio';

    if (isCheckbox || isRadio) {
      if (isCheckbox) {
        options[target.name] = target.checked;
        cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();

        options.ready = function () {
          console.log('ready');
          cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
        };
      } else {
        options[target.name] = target.value;
        options.ready = function () {
          console.log('ready');
        };
      }

      // Restart
      cropper.destroy();
      cropper = new Cropper(image, options);
    }
  };
};
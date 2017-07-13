//prepare google analytics tracking
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-101979275-1', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
      ga('send', 'event', 'extention', 'installed');
    }
});

// start extention as active
var status = true;

// set toggle of extention on browser action click and notify content script
chrome.browserAction.onClicked.addListener(function(tabs) {
  if (status == 'true'){
    status = false;
    chrome.browserAction.setIcon({path: "icons/128-off.png"});
  } 
  else{
    status = true;
    chrome.browserAction.setIcon({path: "icons/128-on.png"});
  }
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {status: status});
  });
});

// check status on tab update and notify content script
chrome.tabs.onActivated.addListener(function() {
  if (status == 'true'){
    chrome.browserAction.setIcon({path: "icons/128-on.png"});
  } 
  else{
    chrome.browserAction.setIcon({path: "icons/128-off.png"});
  }
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {status: status});
  });
});

//send extention status on request
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.status == "getStatus")
      sendResponse({status: status});
});

// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler() {
  return function(info, tab) {

    // The srcUrl property is only available for image elements.
    var url = 'index.html#' + info.srcUrl;

    // Create a new window to the info page.
    chrome.tabs.create({ url: url });
  };
};

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "crop image",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : getClickHandler()
});

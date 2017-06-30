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

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "js/hover.js"});
});

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "crop image",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : getClickHandler()
});

// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getDomainFromUrl(url){
    var host = "null";
    if(typeof url == "undefined" || null == url)
         url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if(typeof match != "undefined" && null != match)
         host = match[1];
    return host;
}


'use strict';
/* global chrome */
chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.executeScript({
        file: 'js/inject.js'
    });
    chrome.tabs.insertCSS({
        file: 'styles/page.css'
    });
    chrome.tabs.insertCSS({
        file: 'styles/modal.css'
    });
});
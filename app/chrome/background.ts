/// <reference path='../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../typings/es6-shim/es6-shim.d.ts'/>

'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
  console.log('currentVersion', chrome.runtime.getManifest().version);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.tab == null) {
    console.log("Tab cannot be null");
    return;
  }
  if (request.sc_ext_setBadgeText_request) {
    chrome.action.setBadgeText({ tabId: sender.tab.id, text: request.modulesCount });
  }
  if (request.sc_ext_setIcon_request) {
    chrome.action.setIcon({
      path: chrome.runtime.getURL(request.newIconPath),
      tabId: sender.tab.id
    });
  }
  chrome.action.setPopup({
    tabId: sender.tab.id,
    popup: 'chrome/popup/popup.html'
  });
  chrome.action.setBadgeBackgroundColor({ color: '#666' });

  if (request.sc_ext_checkVersion_request) {
    console.log(chrome.runtime.getManifest().version);
    console.log(request.version);

    if (request.version == null || request.version != chrome.runtime.getManifest().version) {
      chrome.action.setBadgeText({ tabId: sender.tab.id, text: "NEW", });
      chrome.action.setPopup({
        tabId: sender.tab.id,
        popup: 'chrome/popup/popup-new-version.html'
      });
    }
  }
});
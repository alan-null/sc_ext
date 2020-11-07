/// <reference path='../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../typings/es6-shim/es6-shim.d.ts'/>

'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
  console.log('currentVersion', chrome.runtime.getManifest().version);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.sc_ext_setBadgeText_request) {
    chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: request.modulesCount });
  }
  if (request.sc_ext_setIcon_request) {
    chrome.browserAction.setIcon({
      path: request.newIconPath,
      tabId: sender.tab.id
    });
  }
  chrome.browserAction.setPopup({
    tabId: sender.tab.id,
    popup: 'chrome/popup/popup.html'
  });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#666' });

  if (request.sc_ext_checkVersion_request) {
    console.log(chrome.runtime.getManifest().version);
    console.log(request.version);

    if (request.version == null || request.version != chrome.runtime.getManifest().version) {
      chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: "NEW", });
      chrome.browserAction.setPopup({
        tabId: sender.tab.id,
        popup: 'chrome/popup/popup-new-version.html'
      });
    }
  }
});
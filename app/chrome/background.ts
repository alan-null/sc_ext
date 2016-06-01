/// <reference path='../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../typings/es6-shim/es6-shim.d.ts'/>

'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: request.modulesCount, });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#666' });

  chrome.browserAction.setIcon({
    path: request.newIconPath,
    tabId: sender.tab.id
  });

  chrome.browserAction.setPopup({
    tabId: sender.tab.id,
    popup: 'chrome/popup/popup.html'
  });
});
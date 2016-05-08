/// <reference path='../../typings/chrome/chrome.d.ts'/>
'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    chrome.browserAction.setIcon({
      path: request.newIconPath,
      tabId: sender.tab.id
    });

    chrome.browserAction.setPopup({
      tabId: sender.tab.id,
      popup: 'popup.html'
    });
  });


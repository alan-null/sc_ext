/// <reference path='../../../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../../options/providers/OptionsProvider.ts'/>
/// <reference path='../../../options/models/LinkItem.ts'/>


'use strict';

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
        sc_ext_setVersion_request: true,
        version: chrome.runtime.getManifest().version
    }, () => {
        document.getElementById("link").click();
    });
});
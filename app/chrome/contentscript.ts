/// <reference path='../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../typings/es6-shim/es6-shim.d.ts'/>
/// <reference path='../common/_all.ts'/>

'use strict';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.sc_ext_setVersion_request) {
        if (chrome.storage) {
            SitecoreExtensions.Common.GlobalStorage.set("sc-ext::version", request.version);
        }
    }

});
'use strict';

function dispatchEvent(name, parameters) {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, true, true, parameters);
    document.dispatchEvent(evt);
};

var common = scExt.htmlHelpers.createElement('script', {
    src: chrome.extension.getURL('/scripts/sc_ext-common.js'),
});

var script = scExt.htmlHelpers.createElement('script', {
    src: chrome.extension.getURL('/scripts/sc_ext.js'),
});
script.onload = function () {
    this.parentNode.removeChild(this);
};

common.onload = function () {
    var url = chrome.runtime.getURL('');
    dispatchEvent('setStore', { url: url });
    scExt.htmlHelpers.injectScript(script);
    this.parentNode.removeChild(this);
};
scExt.htmlHelpers.injectScript(common);

chrome.runtime.sendMessage({ 'newIconPath': 'images/icon-128.png' });
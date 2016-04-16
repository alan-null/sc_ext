'use strict';

var common = scExt.htmlHelpers.createElement('script', {
    src: chrome.extension.getURL('/scripts/sc_ext-common.js'),
    onload: function () {
        this.parentNode.removeChild(this);
    }
});

var script = scExt.htmlHelpers.createElement('script', {
    src: chrome.extension.getURL('/scripts/sc_ext.js'),
    onload: function () {
        this.parentNode.removeChild(this);
    }
});

common.onload = function () {
    scExt.htmlHelpers.injectScript(script);

};
scExt.htmlHelpers.injectScript(common);

chrome.runtime.sendMessage({ 'newIconPath': 'images/icon-128.png' });
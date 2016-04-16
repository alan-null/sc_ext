'use strict';

var script = document.createElement('script');
script.src = chrome.extension.getURL('/scripts/sc_ext.js');
script.onload = function () {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(script);

chrome.runtime.sendMessage({ 'newIconPath': 'images/icon-128.png' });
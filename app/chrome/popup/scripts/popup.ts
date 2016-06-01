/// <reference path='../../../../typings/chrome/chrome.d.ts'/>
'use strict';

document.getElementById('go-to-options').addEventListener('click', function () {
    window.open(chrome.runtime.getURL('options/options.html'));
});
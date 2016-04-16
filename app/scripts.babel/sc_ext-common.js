'use strict';
var scExt = {};

scExt.htmlHelpers = {
  createElement: function (tagName, attributes) {
    var element = document.createElement(tagName);
    for (var attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        element.setAttribute(attr, attributes[attr]);
      }
    }
    return element;
  },
  injectScript: function (scriptElement) {
    (document.head || document.documentElement).appendChild(scriptElement);
  }
};
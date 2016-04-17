'use strict';
var scExt = {};

function Store() { }
Store.prototype.set = function (key, value) {
  this[key] = value;
};
Store.prototype.get = function (key) {
  return this[key];
};
Store.prototype.setStore = function (values) {
  for (var key in values) {
    this[key] = values[key];
  }
};

scExt.htmlHelpers = {
  store: new Store(),
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


document.addEventListener('setStore', function (e) {
  scExt.htmlHelpers.store.setStore(e.detail);
});
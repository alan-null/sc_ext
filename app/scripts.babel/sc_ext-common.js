'use strict';
var scExt = {};

function Store() {}
Store.prototype.set = function(key, value) {
    this[key] = value;
};
Store.prototype.get = function(key) {
    return this[key];
};
Store.prototype.setStore = function(values) {
    for (var key in values) {
        this[key] = values[key];
    }
};

scExt.htmlHelpers = {
    store: new Store(),
    createElement: function(tagName, attributes) {
        var element = document.createElement(tagName);
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                element.setAttribute(attr, attributes[attr]);
            }
        }
        return element;
    },
    injectScript: function(scriptElement) {
        (document.head || document.documentElement).appendChild(scriptElement);
    },
    triggerEventOnSelector: function(selector, event) {
        var sections = document.querySelectorAll(selector)
        this.triggerEventOnCollection(sections, event);
    },
    triggerEventOnCollection: function(elements, event) {
        for (var i = 0; i < elements.length; i++) {
            this.triggerEventOnElement(elements[i], event)
        }
    },
    triggerEventOnElement: function(element, event) {
        var evnt = element[event];
        if (typeof(evnt) == 'function') {
            evnt.call(element);
        }
    },
    /**
     * Observe DOM element and waits until specific criteria are meet, then execute callback 
     * @param {Element} parent element to observe changes
     * @param {Number} ticksCount determines number of miliseconds per each tick
     * @param {Number} count is a numbeer of 10ms ticks between each check
     * @param {Function} predicate determines whether certain criteria are meet. If true callback function will be executed                 
     * @param  {Function} callback called when predicate returns true                  
     **/
    observe: function(parent, tick, ticksCount, predicate, callback) {
        if (ticksCount < 0) {
            return;
        }
        if (predicate()) {
            callback();
        } else {
            setTimeout(function() {
                scExt.htmlHelpers.observe(parent, tick, --ticksCount, predicate, callback)
            }, tick);
        }
    },
    addProxy: function(object, functionName, proxyFn) {
        var proxied = object.prototype[functionName];
        object.prototype[functionName] = function() {
            proxyFn();
            return proxied.apply(this, arguments);
        }
    },
    addFlowConditionToEvent: function(object, functionName, conditionFn) {
        var proxied = object.prototype[functionName];
        object.prototype[functionName] = function() {
            if (conditionFn.apply(this, arguments)) {
                return proxied.apply(this, arguments);
            }
        }
    }
};

scExt.libraries = {};

document.addEventListener('setStore', function(e) {
    scExt.htmlHelpers.store.setStore(e.detail);
});
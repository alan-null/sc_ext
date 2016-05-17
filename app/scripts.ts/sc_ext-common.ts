'use strict';
namespace SitecoreExtensions {
    export class HTMLHelpers {
        static createElement<T>(tagName, attributes?, dataset?): T {
            var element = document.createElement(tagName);
            for (var attr in attributes) {
                if (attributes.hasOwnProperty(attr)) {
                    element.setAttribute(attr, attributes[attr]);
                }
            }
            for (var d in dataset) {
                element.dataset[d] = dataset[d];
            }
            return <any>element;
        }
        static injectScript(scriptElement) {
            (document.head || document.documentElement).appendChild(scriptElement);
        }
        static triggerEventOnSelector(selector, event) {
            var sections = document.querySelectorAll(selector)
            this.triggerEventOnCollection(sections, event);
        }
        static triggerEventOnCollection(elements, event) {
            for (var i = 0; i < elements.length; i++) {
                this.triggerEventOnElement(elements[i], event)
            }
        }
        static triggerEventOnElement(element, event) {
            var evnt = element[event];
            if (typeof (evnt) == 'function') {
                evnt.call(element);
            }
        }
        /**
         * Observe DOM element and waits until specific criteria are meet, then execute callback 
         * @param {Element} parent element to observe changes
         * @param {Number} ticksCount determines number of miliseconds per each tick
         * @param {Number} count is a numbeer of 10ms ticks between each check
         * @param {Function} predicate determines whether certain criteria are meet. If true callback function will be executed                 
         * @param  {Function} callback called when predicate returns true                  
         **/
        static observe(parent, tick, ticksCount, predicate, callback) {
            if (ticksCount < 0) {
                return;
            }
            if (predicate()) {
                callback();
            } else {
                setTimeout(function () {
                    HTMLHelpers.observe(parent, tick, --ticksCount, predicate, callback)
                }, tick);
            }
        }
        static addProxy(operand, functionName, proxyFn) {
            if (typeof operand == "function") {
                return this.addProxyToFunction(operand, functionName, proxyFn);
            } else {
                return this.addProxyToObject(operand, functionName, proxyFn);
            }
        }
        private static addProxyToFunction(fn, functionName, proxyFn) {
            var proxied = fn.prototype[functionName];
            fn.prototype[functionName] = function () {
                var result = proxied.apply(this, arguments);
                proxyFn();
                return result;
            }
        }

        private static addProxyToObject(obj, functionName, proxyFn) {
            var proxied = obj[functionName];
            obj[functionName] = function () {
                var result = proxied.apply(this, arguments);
                proxyFn();
                return result;
            }
        }

        static addFlowConditionToEvent(object, functionName, conditionFn) {
            var proxied = object.prototype[functionName];
            object.prototype[functionName] = function () {
                if (conditionFn.apply(this, arguments)) {
                    return proxied.apply(this, arguments);
                }
            }
        }
    }

    export var Libraries = new Array<any>();
}

namespace SitecoreExtensions.Types {
    export interface IDictionary {
        add(key: string, value: any): void;
        remove(key: string): void;
        containsKey(key: string): boolean;
        keys(): string[];
        values(): any[];
    }

    export class Dictionary {
        _keys: string[] = new Array<string>()
        _values: any[] = new Array<string>()

        constructor(init: { key: string; value: any; }[]) {
            for (var x = 0; x < init.length; x++) {
                this[init[x].key] = init[x].value;
                this._keys.push(init[x].key);
                this._values.push(init[x].value);
            }
        }

        add(key: string, value: any) {
            this[key] = value;
            this._keys.push(key);
            this._values.push(value);
        }

        remove(key: string) {
            var index = this._keys.indexOf(key, 0);
            this._keys.splice(index, 1);
            this._values.splice(index, 1);

            delete this[key];
        }

        keys(): string[] {
            return this._keys;
        }

        values(): any[] {
            return this._values;
        }

        containsKey(key: string) {
            if (typeof this[key] === "undefined") {
                return false;
            }
            return true;
        }

        toLookup(): IDictionary {
            return this;
        }
    }
}

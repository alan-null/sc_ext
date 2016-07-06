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

        static selectNodeContent(node: Node): void {
            var range, selection;
            if (window.getSelection && document.createRange) {
                selection = window.getSelection();
                range = document.createRange() as Range;
                range.selectNodeContents(node);
                selection.removeAllRanges();
                selection.addRange(range);
            } else if ((document as any).selection && (document.body as any).createTextRange) {
                range = (document.body as any).createTextRange();
                range.moveToElementText(this);
                range.select();
            }
        }
    }
}


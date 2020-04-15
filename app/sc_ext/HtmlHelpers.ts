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
            var sections = document.querySelectorAll(selector);
            this.triggerEventOnCollection(sections, event);
        }
        static triggerEventOnCollection(elements, event) {
            for (var i = 0; i < elements.length; i++) {
                this.triggerEventOnElement(elements[i], event);
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
                    HTMLHelpers.observe(parent, tick, --ticksCount, predicate, callback);
                }, tick);
            }
        }

        static addFlowConditionToEvent(object, functionName, conditionFn) {
            var proxied = object.prototype[functionName];
            object.prototype[functionName] = function () {
                if (conditionFn.apply(this, arguments)) {
                    return proxied.apply(this, arguments);
                }
            };
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

        static getElement(node: any, predicate: any): any {
            while (node && node.tagName && node.tagName != "BODY" && !predicate(node)) {
                node = node.parentElement;
            }
            if (node && node.tagName != "BODY") {
                return node;
            } else {
                return null;
            }
        }

        static postponeAction(predicate: any, action: any, delay: number, ticks: number) {
            if (ticks > 0) {
                if (predicate()) {
                    action();
                } else {
                    setTimeout(() => {
                        this.postponeAction(predicate, action, delay, --ticks);
                    }, delay);
                }
            }
        }

        static addProxy(operand, functionName, proxyFn) {
            if (typeof operand == "function") {
                return this.addProxyToFunction(operand, functionName, proxyFn);
            } else {
                return this.addProxyToObject(operand, functionName, proxyFn);
            }
        }

        static scrollToElement(element: HTMLElement, parent: HTMLElement) {
            parent.scrollTop = element.offsetTop - parent.clientHeight / 2;
        }

        static copyTextToClipboard(text: string) {
            let textArea = HTMLHelpers.createElement("textarea") as HTMLTextAreaElement;
            textArea.style.position = 'fixed';
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
            } catch (err) {
                console.log('Unable to copy text');
            }
            document.body.removeChild(textArea);
        }

        private static logError(error: any) {
            console.log("An error occured in the proxy function.");
            console.log("Please report it here: https://github.com/alan-null/sc_ext/issues/new");
            console.log(error);
        }

        private static addProxyToFunction(fn, functionName, proxyFn) {
            var proxied = fn.prototype[functionName];
            fn.prototype[functionName] = function () {
                var result = proxied.apply(this, arguments);
                try {
                    proxyFn(arguments);
                } catch (error) {
                    HTMLHelpers.logError(error);
                }
                return result;
            };
        }

        private static addProxyToObject(obj, functionName, proxyFn) {
            var proxied = obj[functionName];
            obj[functionName] = function () {
                var result = proxied.apply(this, arguments);
                try {
                    proxyFn(arguments);
                } catch (error) {
                    HTMLHelpers.logError(error);
                }
                return result;
            };
        }

        public selectText(node) {
            let body = (document.body as any);
            if (body.createTextRange) {
                const range = body.createTextRange();
                range.moveToElementText(node);
                range.select();
            } else if (window.getSelection) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(node);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                console.warn("Could not select text in node: Unsupported browser.");
            }
        }
    }
}


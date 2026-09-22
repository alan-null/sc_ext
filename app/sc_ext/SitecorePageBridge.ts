namespace SitecoreExtensions {
    var pageEventHandlers: { [event: string]: Array<(payload?: any) => void> } = {};

    // Isolated world half of the transport; the main world half lives in app/sc_ext/page/PageBridge.page.ts.
    export class SitecorePageBridge {
        public static form = {
            invoke: function () { SitecorePageBridge.invoke('scForm', 'invoke', Array.prototype.slice.call(arguments)); },
            postEvent: function () { SitecorePageBridge.invoke('scForm', 'postEvent', Array.prototype.slice.call(arguments)); },
            postRequest: function () { SitecorePageBridge.invoke('scForm', 'postRequest', Array.prototype.slice.call(arguments)); },
            resume: function () { SitecorePageBridge.invoke('scForm', 'resume', Array.prototype.slice.call(arguments)); }
        };

        public static sitecore = function () { };

        public static invoke(target: string, method: string, args?: any[]): void {
            var payload = args || [];
            if (method == 'postEvent') {
                // DOM nodes are not cloneable across worlds; the page substitutes its own document.
                payload[0] = null;
            }
            window.postMessage({
                sc_ext_page_call: true,
                target: target,
                method: method,
                args: payload
            }, '*');
        }

        public static on(event: string, handler: (payload?: any) => void): void {
            var handlers = pageEventHandlers[event];
            if (!handlers) {
                handlers = pageEventHandlers[event] = [];
            }
            handlers.push(handler);
        }

        public static dispatch(event: string, payload?: any): void {
            var handlers = pageEventHandlers[event];
            if (!handlers) {
                return;
            }
            handlers.forEach(handler => {
                try {
                    handler(payload);
                } catch (error) {
                    console.error('sc_ext page event handler failed: ' + event, error);
                }
            });
        }
    }

    SitecorePageBridge.sitecore.prototype.postEvent = function () {
        SitecorePageBridge.invoke('scSitecore', 'postEvent', Array.prototype.slice.call(arguments));
    };
    SitecorePageBridge.sitecore.prototype.onKeyDown = function () {
        SitecorePageBridge.invoke('scSitecore', 'onKeyDown', Array.prototype.slice.call(arguments));
    };

    window.addEventListener('message', (event: MessageEvent) => {
        var data = event.data;
        if (event.source !== window || !data || data.sc_ext_page_event !== true || typeof data.name !== 'string') {
            return;
        }
        SitecorePageBridge.dispatch(data.name, data.payload);
    });

    window['scForm'] = SitecorePageBridge.form;
    window['scSitecore'] = SitecorePageBridge.sitecore;
}
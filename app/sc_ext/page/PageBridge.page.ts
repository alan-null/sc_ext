// Main world half of the extension. Runs at document_start, has access to page globals (Sitecore, scForm).
// Transport only: agents register themselves, registration is the allowlist.
namespace ScExtPage {
    export type Handlers = { [method: string]: (...args: any[]) => void };

    var agents: { [name: string]: Handlers } = {};
    var owns = Object.prototype.hasOwnProperty;

    export function register(name: string, handlers: Handlers): void {
        agents[name] = handlers;
    }

    // Page -> isolated world. Payload must be structured-cloneable.
    export function emit(name: string, payload?: any): void {
        window.postMessage({ sc_ext_page_event: true, name: name, payload: payload }, '*');
    }

    export function proxy(target: any, method: string, after: () => void): void {
        var original = target && target[method];
        if (typeof original !== 'function') {
            return;
        }
        target[method] = function () {
            var result = original.apply(this, arguments);
            try {
                after();
            } catch (error) {
                console.error('sc_ext page proxy failed: ' + method, error);
            }
            return result;
        };
    }

    function forwarder(globalName: string, methods: string[]): Handlers {
        var handlers: Handlers = {};
        methods.forEach(function (method) {
            handlers[method] = function (...args: any[]) {
                var target = window[globalName];
                if (!target || typeof target[method] !== 'function') {
                    return;
                }
                if (method === 'postEvent') {
                    args[0] = document;
                }
                target[method].apply(target, args);
            };
        });
        return handlers;
    }

    // Sitecore rerenders chunks of the page through these; everything that decorates the DOM needs to know.
    function watchPageActivity(attempts: number): void {
        var form = window['scForm'];
        var sitecore = window['scSitecore'];
        if (!form && !sitecore) {
            if (attempts > 0) {
                setTimeout(function () { watchPageActivity(attempts - 1); }, 250);
            }
            return;
        }
        var changed = function () { emit('page:changed'); };
        proxy(form, 'invoke', changed);
        proxy(form, 'resume', changed);
        proxy(typeof sitecore === 'function' ? sitecore.prototype : sitecore, 'postEvent', changed);
    }

    window.addEventListener('message', function (event: MessageEvent) {
        var data = event.data;
        if (event.source !== window || !data || data.sc_ext_page_call !== true) {
            return;
        }
        if (!owns.call(agents, data.target)) {
            return;
        }
        var agent = agents[data.target];
        if (!owns.call(agent, data.method) || typeof agent[data.method] !== 'function') {
            return;
        }
        try {
            agent[data.method].apply(agent, data.args || []);
        } catch (error) {
            console.error('sc_ext page bridge failed: ' + data.target + '.' + data.method, error);
        }
    });

    register('scForm', forwarder('scForm', ['invoke', 'postEvent', 'postRequest', 'resume']));
    register('scSitecore', forwarder('scSitecore', ['postEvent']));

    watchPageActivity(40);
}

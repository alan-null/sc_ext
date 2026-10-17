// Main world half of the extension. Runs at document_start, has access to page globals (Sitecore, scForm).
// Transport only: agents register themselves, registration is the allowlist.
namespace ScExtPage {
    export type Handlers = { [method: string]: (...args: any[]) => void };

    export type Validators = { [method: string]: (args: any[]) => boolean };

    var validators: { [name: string]: Validators } = {};
    var agents: { [name: string]: Handlers } = {};
    var owns = Object.prototype.hasOwnProperty;

    export function register(name: string, handlers: Handlers, checks: Validators): void {
        agents[name] = handlers;
        validators[name] = checks;
    }

    export function noArgs(args: any[]): boolean {
        return args.length === 0;
    }

    // Use an indexed loop so sparse arrays cannot skip validation.
    function stringArgs(args: any[], min: number, max: number): boolean {
        if (args.length < min || args.length > max) {
            return false;
        }
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] !== 'string') {
                return false;
            }
        }
        return true;
    }

    function postEventArgs(args: any[]): boolean {
        return args.length === 3 && args[0] === null
            && typeof args[1] === 'string' && typeof args[2] === 'string';
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
        if (event.source !== window || !data || typeof data !== 'object' || Array.isArray(data)
            || data.sc_ext_page_call !== true || typeof data.target !== 'string'
            || typeof data.method !== 'string' || !Array.isArray(data.args)) {
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
            var checks = validators[data.target];
            if (!checks || !owns.call(checks, data.method)
                || typeof checks[data.method] !== 'function' || !checks[data.method](data.args)) {
                return;
            }
            agent[data.method].apply(agent, data.args);
        } catch (error) {
            console.error('sc_ext page bridge failed: ' + data.target + '.' + data.method, error);
        }
    });

    // Contracts match the isolated-world callers. These checks do not authenticate the page.
    register('scForm', forwarder('scForm', ['invoke', 'postEvent', 'postRequest', 'resume']), {
        invoke: function (args) { return stringArgs(args, 1, 2); },
        postEvent: postEventArgs,
        postRequest: function (args) { return stringArgs(args, 4, 4); },
        resume: noArgs
    });
    register('scSitecore', forwarder('scSitecore', ['postEvent']), { postEvent: postEventArgs });

    watchPageActivity(40);
}

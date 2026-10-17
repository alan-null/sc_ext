// Runnable check for the main world bridge router: node scripts/pageBridge.selfcheck.js (after a build).
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var bundle = path.join(__dirname, '..', 'app', 'chrome', 'sitecoreBridge.js');
var listeners = [];
var posted = [];

var window = {
    addEventListener: function (type, handler) {
        if (type === 'message') {
            listeners.push(handler);
        }
    },
    postMessage: function (data) {
        posted.push(data);
    }
};

var sandbox = {
    window: window,
    document: {},
    console: console,
    setTimeout: function () { }
};
sandbox.self = sandbox;
vm.runInNewContext(fs.readFileSync(bundle, 'utf8'), sandbox);

function send(data, source) {
    listeners.forEach(function (handler) {
        handler({ source: source === undefined ? window : source, data: data });
    });
}

function call(target, method, args) {
    send({ sc_ext_page_call: true, target: target, method: method, args: args });
}

var calls = [];
sandbox.ScExtPage.register('fake', {
    ping: function () { calls.push(Array.prototype.slice.call(arguments)); }
}, { ping: function (args) { return args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'number'; } });

call('fake', 'ping', ['a', 1]);
assert.deepEqual(calls, [['a', 1]], 'registered agent method must be invoked with its arguments');

call('fake', 'missing', []);
call('unregistered', 'ping', []);
call('constructor', 'call', []);
call('fake', 'hasOwnProperty', ['ping']);
assert.equal(calls.length, 1, 'only own registered methods are callable');

send({ sc_ext_page_call: true, target: 'fake', method: 'ping', args: [] }, {});
assert.equal(calls.length, 1, 'messages from other windows must be ignored');

// Malformed envelopes must never reach a registered handler.
[undefined, null, false, '', {}, { length: 2, 0: 'a', 1: 1 }].forEach(function (args) {
    call('fake', 'ping', args);
});
[null, [], 'message', 1, false].forEach(function (data) { send(data); });
[null, {}, [], 1].forEach(function (name) {
    call(name, 'ping', ['a', 1]);
    call('fake', name, ['a', 1]);
});
send({ sc_ext_page_call: 1, target: 'fake', method: 'ping', args: ['a', 1] });
call('fake', 'ping', ['a']);
call('fake', 'ping', ['a', 1, 'extra']);
call('fake', 'ping', [{}, 1]);
assert.equal(calls.length, 1, 'invalid envelopes and arguments must be ignored');

var uncheckedCalls = 0;
sandbox.ScExtPage.register('unchecked', { ping: function () { uncheckedCalls++; } }, {});
call('unchecked', 'ping', []);
assert.equal(uncheckedCalls, 0, 'methods without validators must fail closed');

var forwarded = [];
function record(method) {
    return function () {
        forwarded.push({ method: method, receiver: this, args: Array.prototype.slice.call(arguments) });
    };
}
window.scForm = {
    invoke: record('invoke'), postEvent: record('postEvent'),
    postRequest: record('postRequest'), resume: record('resume')
};
window.scSitecore = { postEvent: record('sitecore.postEvent') };
[
    ['scForm', 'invoke', ['contenteditor:save']],
    ['scForm', 'invoke', ['contenteditor:save', 'click']],
    ['scForm', 'postEvent', [null, 'click', 'item:duplicate']],
    ['scForm', 'postRequest', ['', '', '', 'Translate_Click']],
    ['scForm', 'resume', []],
    ['scSitecore', 'postEvent', [null, 'click', 'item:duplicate']]
].forEach(function (entry) {
    var before = forwarded.length;
    call(entry[0], entry[1], entry[2]);
    assert.equal(forwarded.length, before + 1, 'valid ' + entry[0] + '.' + entry[1] + ' must forward');
    assert.strictEqual(forwarded[before].receiver, window[entry[0]], 'forwarding preserves the receiver');
    var expected = entry[2].slice();
    if (entry[1] === 'postEvent') { expected[0] = sandbox.document; }
    assert.deepEqual(forwarded[before].args, expected, 'forwarding preserves arguments and substitutes document');
});
var validCount = forwarded.length;
[
    ['invoke', []], ['invoke', [1]], ['invoke', ['command', {}]],
    ['invoke', ['command', 'click', 'extra']], ['invoke', new Array(1)],
    ['postEvent', []], ['postEvent', [null, 'click']],
    ['postEvent', [{}, 'click', 'command']], ['postEvent', [null, 1, 'command']],
    ['postEvent', [null, 'click', {}]], ['postEvent', [null, 'click', 'command', 'extra']],
    ['postRequest', ['', '', '']], ['postRequest', ['', '', '', {}]],
    ['postRequest', ['', '', '', 'command', 'extra']], ['postRequest', new Array(4)],
    ['resume', ['extra']], ['constructor', []], ['hasOwnProperty', []]
].forEach(function (entry) {
    call('scForm', entry[0], entry[1]);
    if (entry[0] === 'postEvent') { call('scSitecore', entry[0], entry[1]); }
});
assert.equal(forwarded.length, validCount, 'invalid Sitecore calls must not forward');

// Module validators must reject requests before any page API is accessed.
var pageReads = 0;
Object.defineProperty(window, 'Sitecore', { configurable: true, get: function () { pageReads++; return undefined; } });
call('addHere', 'initialize', ['extra']);
call('placeholder', 'initialize', ['extra']);
call('placeholder', 'remove', []);
call('placeholder', 'remove', [123]);
call('placeholder', 'remove', ['id', 'extra']);
assert.equal(pageReads, 0, 'invalid module arguments must not access page globals');
call('addHere', 'initialize', []);
call('placeholder', 'initialize', []);
assert.equal(pageReads, 2, 'valid initialization must reach module handlers');
var removed = [];
Object.defineProperty(window, 'Sitecore', { value: {
    PageModes: { DesignManager: { placeholders: function () { return [{
        _originalDOMElement: [{ attributes: { key: { value: 'main' } } }],
        isEnabled: function () { return true; },
        getChildChromes: function () { return ['rendering']; },
        type: { deleteControl: function (chrome) { removed.push(chrome); } }
    }]; } } },
    LayoutDefinition: { getRenderings: function () { return []; } }
} });
call('placeholder', 'remove', ['main']);
assert.deepEqual(removed, ['rendering'], 'valid placeholder removal must still work');

posted.length = 0;
sandbox.ScExtPage.emit('page:changed');
assert.deepEqual(posted, [{ sc_ext_page_event: true, name: 'page:changed', payload: undefined }], 'emit posts a page event');

var target = { invoke: function (x) { return x * 2; } };
var proxied = 0;
sandbox.ScExtPage.proxy(target, 'invoke', function () { proxied++; });
assert.equal(target.invoke(21), 42, 'proxy keeps the original return value');
assert.equal(proxied, 1, 'proxy notifies after the original call');

sandbox.ScExtPage.proxy(target, 'notAFunction', function () { proxied++; });
assert.equal(proxied, 1, 'proxying a missing member is a no-op');

console.log('page bridge self-check passed');

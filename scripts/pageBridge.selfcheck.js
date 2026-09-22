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
});

call('fake', 'ping', ['a', 1]);
assert.deepEqual(calls, [['a', 1]], 'registered agent method must be invoked with its arguments');

call('fake', 'missing', []);
call('unregistered', 'ping', []);
call('constructor', 'call', []);
call('fake', 'hasOwnProperty', ['ping']);
assert.equal(calls.length, 1, 'only own registered methods are callable');

send({ sc_ext_page_call: true, target: 'fake', method: 'ping', args: [] }, {});
assert.equal(calls.length, 1, 'messages from other windows must be ignored');

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

const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

const source = [
    'app/sc_ext/events/EventsDispatcher.ts',
    'app/sc_ext/events/EventHandler.ts'
].map(file => fs.readFileSync(file, 'utf8')).join('\n');
const javascript = ts.transpile(source, { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None });
let messageListenerCount = 0;
const context = {
    exports: {},
    console,
    window: {
        addEventListener: () => { messageListenerCount++; },
        postMessage: () => { throw new Error('internal events must not use window.postMessage'); }
    }
};
vm.runInNewContext(javascript, context);

const Events = context.SitecoreExtensions.Events;
const received = [];
new Events.EventHandler('onDatabaseChange', args => received.push(args.databaseName));

assert.strictEqual(messageListenerCount, 0, 'internal handlers must not accept page messages');
Events.EventsDispatcher.Dispatch({ eventName: 'other', databaseName: 'ignored' });
Events.EventsDispatcher.Dispatch({ eventName: 'onDatabaseChange', databaseName: 'master' });
assert.deepStrictEqual(received, ['master'], 'dispatch must invoke matching internal handlers only');

console.log('Events dispatcher self-check passed');
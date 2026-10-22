// Runnable without a build: node scripts/launcherKeyboard.selfcheck.js
const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

const elements = [];
const listeners = [];
const pageKeyDown = function () {};
const context = {
    exports: {},
    ModuleBase: function () {},
    SitecoreExtensions: { Modules: { Launcher: { Models: {} } } },
    HTMLHelpers: {
        createElement: (tag, attributes) => {
            const element = { tag, attributes: attributes || {}, appendChild: () => {} };
            elements.push(element);
            return element;
        }
    },
    document: {
        onkeydown: pageKeyDown,
        addEventListener: (type, handler, capture) => listeners.push({ type, handler, capture }),
        querySelector: () => ({ appendChild: () => {} })
    },
    window: { addEventListener: (type, handler, capture) => listeners.push({ type, handler, capture, surface: 'window' }) }
};
const source = fs.readFileSync('app/sc_ext/modules/launcher/LauncherModule.ts', 'utf8');
vm.runInNewContext(ts.transpile(source, { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None }), context);
const launcher = Object.create(context.SitecoreExtensions.Modules.Launcher.LauncherModule.prototype);
launcher.options = { keyBindings: { show: 32, hide: 27, executeCommand: 13, selectPrevResult: 38, selectNextResult: 40, selectFirstResult: 33, selectLastResult: 34 } };
launcher.searchBoxElement = { value: 'raw' };
launcher.selectedCommand = [];
launcher.activeNestedCommand = null;
let shown = 0;
let hidden = 0;
let exited = 0;
let selected = 0;
let executionEvent;
let searched;
launcher.showLauncher = () => { shown++; };
launcher.hideLauncher = () => { hidden++; };
launcher.exitNestedMode = () => { exited++; launcher.activeNestedCommand = null; };
launcher.executeSelectedCommand = evt => { executionEvent = evt; };
launcher.commandSelectionEvent = () => { selected++; };
launcher.searchCommands = query => { searched = query; return []; };
launcher.appendResults = () => {};
launcher.selectFirstResult = () => {};

function event(keyCode, ctrlKey) {
    return {
        keyCode, ctrlKey: !!ctrlKey, defaultPrevented: false, propagationStopped: false,
        preventDefault: function () { this.defaultPrevented = true; },
        stopPropagation: function () { this.propagationStopped = true; }
    };
}

launcher.injectlauncherHtml();
const input = elements.filter(element => element.tag === 'input')[0];
assert(input.attributes.class.split(' ').indexOf('scIgnoreModified') >= 0, 'Launcher input must opt out of modification tracking');
[82, 8, 40, 33, 83].forEach(key => {
    const evt = event(key);
    input.onkeydown(evt);
    assert(evt.propagationStopped, 'Launcher keydown must not reach page handlers: ' + key);
    assert(!evt.defaultPrevented, 'ordinary typing and editing defaults must remain available: ' + key);
});
const typed = event(82);
input.onkeyup(typed);
assert(typed.propagationStopped && searched === 'raw', 'typing must still update results without leaking keyup');
const navigation = event(40);
input.onkeyup(navigation);
assert(navigation.propagationStopped && selected === 1, 'result selection must still work');
const press = event(82);
input.onkeypress(press);
assert(press.propagationStopped && !press.defaultPrevented, 'keypress must be contained without preventing text entry');
const executeDown = event(13);
input.onkeydown(executeDown);
assert(executeDown.propagationStopped && executeDown.defaultPrevented && !executionEvent, 'Enter keydown must be contained without executing');
launcher.selectedCommand = [{}];
const executeUp = event(13, true);
input.onkeyup(executeUp);
assert(executeUp.propagationStopped && executionEvent === executeUp && executionEvent.ctrlKey, 'command must execute on keyup with its modifiers');

const escape = event(27);
input.onkeydown(escape);
assert(escape.propagationStopped && escape.defaultPrevented && hidden === 1, 'Escape must still close Launcher');
launcher.activeNestedCommand = {};
input.onkeydown(event(27));
assert(exited === 1 && hidden === 1, 'nested Escape must leave nested mode without closing Launcher');
launcher.activeNestedCommand = {};
input.onkeydown(event(8));
assert(exited === 1, 'Backspace must edit a nonempty nested query');
launcher.searchBoxElement.value = '';
const back = event(8);
input.onkeydown(back);
assert(back.propagationStopped && back.defaultPrevented && exited === 2, 'empty nested Backspace must leave nested mode without leaking');

launcher.registerGlobalShortcuts();
assert.strictEqual(context.document.onkeydown, pageKeyDown, 'Launcher must preserve the page keydown property');
const shortcut = listeners.filter(listener => listener.type === 'keydown')[0];
assert.strictEqual(shortcut.surface, 'window', 'fallback must run after document and editor handlers');
assert.strictEqual(shortcut.capture, false, 'opening shortcut must run during bubbling');
[event(32), event(82), event(27)].forEach(evt => {
    shortcut.handler(evt);
    assert(!evt.defaultPrevented && !evt.propagationStopped && shown === 0, 'unrelated page keys must remain untouched');
});
launcher.options.keyBindings.show = 76;
function node(classes, parentElement) {
    return { classList: { contains: name => classes.indexOf(name) >= 0 }, parentElement };
}
const editorTargets = [node(['ace_text-input']), node([], node(['ace_editor']))];
editorTargets.forEach(target => {
    const evt = event(76, true);
    evt.target = target;
    evt.preventDefault(); // Simulate a page handler claiming the shortcut.
    shortcut.handler(evt);
    assert(evt.defaultPrevented && !evt.propagationStopped && shown === 0, 'claimed shortcuts must not open Launcher');
});
const open = event(76, true);
open.target = editorTargets[0]; // Unclaimed shortcuts work even inside Ace.
shortcut.handler(open);
assert(open.defaultPrevented && open.propagationStopped && shown === 1, 'configured opening shortcut must be contained');

const forwarded = [];
context.window.top = { postMessage: message => forwarded.push(message) };
launcher.options.enabled = true;
launcher.registerShortcutForwarding();
const forwardingShortcut = listeners.filter(listener => listener.type === 'keydown')[1];
editorTargets.forEach(target => {
    const evt = event(76, true);
    evt.target = target;
    evt.preventDefault();
    forwardingShortcut.handler(evt);
    assert(evt.defaultPrevented && !evt.propagationStopped && forwarded.length === 0, 'claimed shortcuts must not be forwarded from preview frames');
});
const forward = event(76, true);
forwardingShortcut.handler(forward);
assert(forward.defaultPrevented && forward.propagationStopped && forwarded.length === 1, 'ordinary preview shortcuts must still be forwarded');
launcher.options.keyBindings.executeCommand = 69;
const customExecute = event(69);
input.onkeydown(customExecute);
assert(customExecute.defaultPrevented && customExecute.propagationStopped, 'configured execute key must be contained');
launcher.options.keyBindings.hide = 72;
input.onkeydown(event(72));
assert.strictEqual(hidden, 2, 'configured hide key must still close Launcher');

console.log('Launcher keyboard self-check passed');

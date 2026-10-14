// Runnable without a build: node scripts/launcherNavigation.selfcheck.js
const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

const messages = [];
const links = [];
const context = {
    exports: {},
    URL,
    window: { top: { location: { href: 'https://sc_1_9_14.cm/sitecore/shell/default.aspx' }, document: { location: {} } } },
    chrome: { runtime: { sendMessage: message => messages.push(message) } },
    HTMLHelpers: { createElement: (tag, attributes) => ({ click: () => links.push(attributes) }) }
};
['BaseCommand', 'NavigationCommand', 'LaunchPadCommandsProvider'].forEach(name => {
    const source = fs.readFileSync('app/sc_ext/modules/launcher/providers/' + name + '.ts', 'utf8');
    vm.runInNewContext(ts.transpile(source, { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None }), context);
    Object.assign(context, context.SitecoreExtensions.Modules.Launcher.Providers);
});

const providers = context.SitecoreExtensions.Modules.Launcher.Providers;
const controlPanel = new providers.LaunchpadCommandsProvider().getCommands().find(command => command.name === 'Control Panel');
controlPanel.execute({ ctrlKey: true });
assert.strictEqual(messages[0].url, 'https://sc_1_9_14.cm/sitecore/client/Applications/ControlPanel.aspx?sc_bw=1');
assert.strictEqual(messages[0].active, false, 'Ctrl+Enter must keep opening a background tab');
assert.strictEqual(messages[0].sc_ext_openTab_request, true);

[
    ['https://other.example/path?q=1', 'https://other.example/path?q=1'],
    ['//other.example/path', 'https://other.example/path'],
    ['Applications/Test.aspx?q=1', 'https://sc_1_9_14.cm/sitecore/shell/Applications/Test.aspx?q=1'],
    ['/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=123', 'https://sc_1_9_14.cm/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=123']
].forEach(([url, expected]) => {
    new providers.NavigationCommand('test', '', url).execute({ ctrlKey: true });
    assert.strictEqual(messages[messages.length - 1].url, expected);
});

controlPanel.execute({ ctrlKey: false });
assert.strictEqual(context.window.top.document.location.href, controlPanel.url, 'Enter must still navigate the current tab');
context.chrome = undefined;
controlPanel.execute({ ctrlKey: true });
assert.strictEqual(links[0].href, controlPanel.url, 'the anchor fallback must keep using page-relative navigation');
assert.strictEqual(links[0].target, '_blank');

console.log('Launcher navigation self-check passed');

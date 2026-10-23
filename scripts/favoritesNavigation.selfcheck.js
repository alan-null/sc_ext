const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

const loadedItems = [];
const messages = [];
let database = 'master';
let language = 'en';
let location = 'editor';
const starImage = {};
const star = { querySelector: () => starImage, setAttribute: () => {} };
const context = {
    exports: {}, Promise, URL, console,
    window: { top: { location: { host: 'current.local', protocol: 'https:', href: 'https://current.local/sitecore/shell/' }, document: { location: {} } } },
    chrome: { runtime: { getURL: path => 'chrome-extension://test/' + path, sendMessage: message => messages.push(message) } },
    Context: { Database: () => database, Language: () => language, Location: () => location, ItemID: () => '{ITEM}' },
    Enums: { Location: { ContentEditor: 'editor' } },
    PageObjects: { ContentTree: function () { this.loadItem = id => loadedItems.push(id); this.getActiveTreeNode = () => null; } },
    document: { querySelector: () => star },
    ModuleBase: function () {},
    SitecoreExtensions: { Options: { ModuleOptions: function () {} }, Modules: { Launcher: {} } }
};
context.Options = context.SitecoreExtensions.Options;
context.Launcher = context.SitecoreExtensions.Modules.Launcher;

const files = [
    'app/sc_ext/modules/launcher/StorageType.ts',
    'app/sc_ext/modules/launcher/providers/BaseCommand.ts',
    'app/sc_ext/modules/launcher/providers/DynamicCommand.ts',
    'app/sc_ext/modules/launcher/providers/NavigationCommand.ts',
    'app/sc_ext/modules/favorites/Favorite.ts',
    'app/sc_ext/modules/favorites/FavoritesOptions.ts',
    'app/sc_ext/modules/favorites/FavoritesModule.ts',
    'app/sc_ext/modules/favorites/FavoritesCommandsProvider.ts'
];
// The shipped namespace bundle is a classic, non-strict script.
vm.runInNewContext(ts.transpile(files.map(file => fs.readFileSync(file, 'utf8')).join('\n'), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None
}).replace(/^"use strict";\s*/m, ''), context);
const Favorites = context.SitecoreExtensions.Modules.Favorites;

(async () => {
    assert.strictEqual(new Favorites.FavoritesOptions().defaultScope, 'instance');
    assert.strictEqual(new Favorites.FavoritesOptions({ model: { defaultScope: 'any' } }).defaultScope, 'any');
    assert.strictEqual(new Favorites.FavoritesOptions({ model: { defaultScope: 'invalid' } }).defaultScope, 'instance');

    const favorite = { id: '{ITEM}', name: 'Item', path: '/sitecore/content/Item', database: 'master', language: 'en',
        host: 'saved.local', icon: 'https://saved.local/temp/iconcache/item.png', scope: 'any' };
    const module = { options: { enabled: true, defaultScope: 'instance' }, store: { all: () => Promise.resolve([favorite]) },
        currentFavorite: () => favorite, canCapture: () => true, isCurrentFavorite: () => true, getCurrentItemName: () => 'Item' };
    const provider = new Favorites.FavoritesCommandsProvider(module);
    const favoritesCommand = provider.getCommands().find(command => command.name === 'Favorites');
    let items = await favoritesCommand.getNestedItems();
    assert.ok(items[0].description.includes('Any instance'));
    assert.strictEqual(items[0].icon, 'https://current.local/temp/iconcache/item.png');
    items[0].execute({ ctrlKey: false });
    assert.deepStrictEqual(loadedItems, ['{ITEM}'], 'shared favorite should load in the current Content Editor');
    items[0].execute({ ctrlKey: true });
    let url = new URL(messages[messages.length - 1].url);
    assert.strictEqual(url.host, 'current.local', 'Ctrl+Enter must use the current host for shared favorites');
    assert.strictEqual(url.searchParams.get('fo'), '{ITEM}');
    assert.strictEqual(url.searchParams.get('sc_content'), 'master');
    assert.strictEqual(messages[messages.length - 1].active, false);

    // Database, language and editor context changes use full navigation on the effective host.
    database = 'core';
    items[0].execute({ ctrlKey: false });
    url = new URL(context.window.top.document.location.href);
    assert.strictEqual(url.host, 'current.local');
    assert.strictEqual(url.searchParams.get('sc_content'), 'master');
    database = 'master'; language = 'de';
    items[0].execute({ ctrlKey: false });
    assert.strictEqual(new URL(context.window.top.document.location.href).searchParams.get('la'), 'en');
    language = 'en'; location = 'launchpad';
    items[0].execute({ ctrlKey: false });
    assert.strictEqual(new URL(context.window.top.document.location.href).host, 'current.local');
    location = 'editor';

    favorite.scope = 'instance';
    items = await favoritesCommand.getNestedItems();
    assert.ok(items[0].description.includes('saved.local'));
    assert.strictEqual(items[0].icon, 'https://saved.local/temp/iconcache/item.png');
    items[0].execute({ ctrlKey: false });
    assert.strictEqual(new URL(context.window.top.document.location.href).host, 'saved.local', 'instance favorites retain the saved host');
    delete favorite.scope;
    items[0].execute({ ctrlKey: true });
    assert.strictEqual(new URL(messages[messages.length - 1].url).host, 'saved.local', 'legacy favorites retain the saved host');

    favorite.scope = 'matching';
    favorite.hostPattern = '*.local';
    items = await favoritesCommand.getNestedItems();
    assert.ok(items[0].description.includes('Matching instances: *.local'));
    assert.strictEqual(items[0].icon, 'https://current.local/temp/iconcache/item.png');
    items[0].execute({ ctrlKey: true });
    assert.strictEqual(new URL(messages[messages.length - 1].url).host, 'current.local', 'matching favorites navigate on the current host');
    delete favorite.scope;

    const scopeCommand = provider.getCommands().find(command => command.name === 'Change favorite scope');
    assert.ok(scopeCommand.description.includes('any instance'));
    favorite.scope = 'any';
    assert.ok(scopeCommand.description.includes('this instance only'));
    assert.ok(provider.getCommands().find(command => command.name === 'Remove from favorites').description.includes('all instances'));
    provider.getCommands().find(command => command.name === 'Manage favorites').execute();
    assert.strictEqual(messages[messages.length - 1].url, 'chrome-extension://test/options/options.html?module=favorites');

    const editor = Object.create(Favorites.FavoritesModule.prototype);
    editor.options = { defaultScope: 'instance' };
    editor.store = { containsCached: () => true, currentCached: () => favorite };
    editor.updateStar();
    assert.strictEqual(star.title, 'Remove shared favorite (all instances)');
    favorite.scope = 'matching';
    editor.updateStar();
    assert.strictEqual(star.title, 'Remove matching favorite (*.local)');
    favorite.scope = 'instance';
    editor.updateStar();
    assert.strictEqual(star.title, 'Remove from favorites');
    editor.store.containsCached = () => false;
    editor.options.defaultScope = 'any';
    editor.updateStar();
    assert.strictEqual(star.title, 'Add to favorites (any instance)');
    editor.getCurrentItemName = () => 'Captured item';
    editor.getItemPath = () => '/sitecore/content/Captured item';
    const captured = editor.captureCurrent();
    assert.strictEqual(captured.scope, 'any', 'capture must apply the chosen default scope');
    assert.strictEqual(captured.host, 'current.local');
    assert.strictEqual(captured.id, '{ITEM}');
    assert.strictEqual(captured.icon, '/sitecore/images/blank.gif');

    // Metadata refresh must preserve the pattern instead of creating a different favorite.
    let refreshedFavorite;
    favorite.name = '{ITEM}';
    favorite.scope = 'matching';
    editor.options = {};
    editor.canCapture = () => true;
    editor.store = {
        contains: () => Promise.resolve(true),
        containsCached: () => true,
        currentCached: () => favorite,
        add: item => { refreshedFavorite = item; return Promise.resolve(); }
    };
    await editor.refresh();
    assert.strictEqual(refreshedFavorite.scope, 'matching');
    assert.strictEqual(refreshedFavorite.hostPattern, '*.local');
    assert.strictEqual(refreshedFavorite.host, 'saved.local');

    console.log('Favorites navigation self-check passed');
})().catch(error => { console.error(error); process.exit(1); });

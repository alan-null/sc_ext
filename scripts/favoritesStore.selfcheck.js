const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

const references = fs.readFileSync('app/sc_ext/_all.ts', 'utf8');
assert.ok(
    references.indexOf("modules/launcher/_all.ts") < references.indexOf("modules/favorites/_all.ts"),
    'launcher must load before favorites because FavoritesStore resolves Launcher.StorageType during startup'
);

const source = [
    'app/sc_ext/modules/favorites/Favorite.ts',
    'app/sc_ext/modules/favorites/FavoritesStore.ts'
].map(file => fs.readFileSync(file, 'utf8')).join('\n');
const javascript = ts.transpile(source, { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None });
const values = { 'sc_ext::favorites': '{broken' };
let warningCount = 0;
const context = {
    exports: {},
    Promise,
    console,
    localStorage: {
        getItem: key => Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null,
        setItem: (key, value) => { values[key] = value; }
    },
    window: { top: { location: { host: 'author.local' } } },
    SitecoreExtensions: {
        Modules: { Launcher: { StorageType: { LocalStorage: 0, GlobalStorage: 1 } } },
        Storage: {
            GlobalStorage: {
                get: key => Promise.resolve(values[key]),
                set: (key, value) => { values[key] = value; return Promise.resolve(); }
            }
        },
        Notification: { Instance: { warning: () => { warningCount++; } } }
    }
};
context.Launcher = context.SitecoreExtensions.Modules.Launcher;
context.Storage = context.SitecoreExtensions.Storage;
context.Notification = context.SitecoreExtensions.Notification;
vm.runInNewContext(javascript, context);

const Favorites = context.SitecoreExtensions.Modules.Favorites;
const Store = Favorites.FavoritesStore;

function favorite(id, name, host, database) {
    return {
        id,
        name,
        path: '/sitecore/content/' + name,
        icon: name + '.png',
        database,
        language: 'en',
        host,
        createdAt: 1
    };
}

(async () => {
    const store = new Store(0, true, 2);
    assert.strictEqual((await store.all()).length, 0, 'malformed JSON should yield an empty list');

    await store.add(favorite('{ONE}', 'One', 'author.local', null));
    await store.add(favorite('{ONE}', 'Updated', 'author.local', null));
    let items = await store.all();
    assert.strictEqual(items.length, 1, 'same host, database, and ID should dedupe');
    assert.strictEqual(items[0].name, 'Updated', 'dedupe should refresh metadata');
    assert.strictEqual(items[0].createdAt, 1, 'dedupe should preserve creation time');
    assert.strictEqual(warningCount, 0, 'dedupe should not cross warning threshold');

    await store.add(favorite('{TWO}', 'Two', 'delivery.local', 'master'));
    assert.strictEqual(warningCount, 1, 'threshold crossing should warn once');
    await store.add(favorite('{THREE}', 'Three', 'author.local', 'master'));
    assert.strictEqual(warningCount, 1, 'items beyond threshold should not repeat warning');

    const localOnly = new Store(0, false, 2);
    items = await localOnly.all();
    assert.deepStrictEqual(Array.prototype.map.call(items, item => item.name), ['Updated', 'Three']);

    await localOnly.remove('{ONE}', null, 'author.local');
    assert.strictEqual(await localOnly.contains('{ONE}', null, 'author.local'), false);
    assert.strictEqual((await localOnly.all()).length, 1, 'removal should preserve unrelated hosts');

    const globalStore = new Store(1, true, 10);
    assert.strictEqual((await globalStore.all()).length, 2, 'global backend should parse stored JSON');
    await globalStore.clear();
    assert.deepStrictEqual(JSON.parse(values['sc_ext::favorites']), []);

    console.log('Favorites store self-check passed');
})().catch(error => {
    console.error(error);
    process.exit(1);
});

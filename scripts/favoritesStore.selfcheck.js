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
    'app/common/FavoritesRepository.ts',
    'app/sc_ext/modules/favorites/FavoritesStore.ts'
].map(file => fs.readFileSync(file, 'utf8')).join('\n');
const javascript = ts.transpile(source, { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None });
const values = { 'sc_ext::favorites': '{broken' };
const storageListeners = [];
const localListeners = [];
let warningCount = 0;
const context = {
    exports: {},
    Promise,
    URL,
    console,
    chrome: { storage: { onChanged: { addListener: listener => storageListeners.push(listener) } } },
    localStorage: {
        getItem: key => Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null,
        setItem: (key, value) => { values[key] = value; }
    },
    window: { top: { location: { host: 'author.local' } }, addEventListener: (name, listener) => localListeners.push(listener) },
    SitecoreExtensions: {
        Modules: { Launcher: { StorageType: { LocalStorage: 0, GlobalStorage: 1 } } },
        Common: {
            GlobalStorage: {
                get: key => Promise.resolve(values[key]),
                set: (key, value) => { values[key] = value; return Promise.resolve(); }
            }
        },
        Notification: { Instance: { warning: () => { warningCount++; } } }
    }
};
context.Launcher = context.SitecoreExtensions.Modules.Launcher;
context.Common = context.SitecoreExtensions.Common;
context.GlobalStorage = context.Common.GlobalStorage;
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

    // Existing records have no scope and must stay tied to their saved host.
    const legacy = favorite('{LEGACY}', 'Legacy', 'delivery.local', 'master');
    const extension = new context.Common.FavoritesRepository(true);
    await extension.save([legacy]);
    const hiddenOtherHosts = new Store(1, false, 50);
    assert.strictEqual((await hiddenOtherHosts.all()).length, 0);
    assert.strictEqual(await hiddenOtherHosts.contains('{legacy}', 'master', 'author.local'), false);

    const shared = Object.assign(favorite('{SHARED}', 'Shared', 'delivery.local', 'master'), { scope: 'any' });
    await hiddenOtherHosts.add(shared);
    assert.strictEqual((await hiddenOtherHosts.all()).length, 1, 'shared favorites ignore the other-host visibility filter');
    assert.strictEqual(await hiddenOtherHosts.contains('{shared}', 'master', 'author.local'), true);
    assert.strictEqual(hiddenOtherHosts.containsCached('{SHARED}', 'master', 'third.local'), true);
    assert.strictEqual(await hiddenOtherHosts.contains('{SHARED}', 'core', 'author.local'), false, 'database remains part of identity');
    await hiddenOtherHosts.add(Object.assign({}, shared, { host: 'third.local', name: 'Shared updated' }));
    assert.strictEqual((await extension.all()).length, 2, 'shared favorites dedupe across hosts');

    // An instance-specific override can coexist. Removing it must preserve the shared entry.
    await hiddenOtherHosts.add(favorite('{SHARED}', 'Local override', 'author.local', 'master'));
    assert.strictEqual(hiddenOtherHosts.currentCached('{shared}', 'master', 'author.local').name, 'Local override');
    await hiddenOtherHosts.remove('{shared}', 'master', 'author.local');
    assert.strictEqual(hiddenOtherHosts.currentCached('{SHARED}', 'master', 'author.local').scope, 'any');
    await hiddenOtherHosts.remove('{shared}', 'master', 'author.local');
    assert.strictEqual(await hiddenOtherHosts.contains('{SHARED}', 'master', 'third.local'), false);
    assert.strictEqual((await extension.all()).length, 1, 'removal must preserve unrelated entries');

    // Conversions preserve identity, timestamps and normalized icons.
    const convertible = favorite('{CONVERT}', 'Convert', 'author.local', 'master');
    convertible.icon = 'https://author.local/temp/iconcache/home.png?v=1';
    convertible.createdAt = 123;
    await hiddenOtherHosts.add(convertible);
    await hiddenOtherHosts.setScope('{convert}', 'master', 'author.local', 'any');
    assert.strictEqual(await hiddenOtherHosts.contains('{CONVERT}', 'master', 'third.local'), true);
    let converted = hiddenOtherHosts.currentCached('{convert}', 'master', 'third.local');
    assert.strictEqual(converted.createdAt, 123);
    assert.strictEqual(converted.icon, '/temp/iconcache/home.png?v=1');
    await hiddenOtherHosts.setScope('{convert}', 'master', 'third.local', 'instance');
    assert.strictEqual(await hiddenOtherHosts.contains('{CONVERT}', 'master', 'author.local'), false);
    assert.strictEqual(await hiddenOtherHosts.contains('{CONVERT}', 'master', 'third.local'), true);

    // Reject conversions that would overwrite an existing shared entry.
    await hiddenOtherHosts.add(Object.assign({}, shared));
    const localDuplicate = Object.assign({}, shared, { scope: 'instance', host: 'author.local' });
    await hiddenOtherHosts.add(localDuplicate);
    let collision;
    try { await hiddenOtherHosts.setScope('{SHARED}', 'master', 'author.local', 'any'); } catch (error) { collision = error; }
    assert.ok(collision && /already exists/.test(collision.message));
    assert.strictEqual((await extension.all()).filter(item => item.id === '{SHARED}').length, 2, 'collision must preserve both entries');

    // Options edits invalidate already-open stores, then reload on the next read.
    let changes = 0;
    hiddenOtherHosts.onChanged = () => changes++;
    await extension.update(shared, Object.assign({}, shared, { name: 'Edited in Options' }));
    storageListeners.forEach(listener => listener({ sc_ext_globalStorage: {} }, 'local'));
    assert.strictEqual(changes, 1);
    assert.strictEqual(hiddenOtherHosts.containsCached('{SHARED}', 'master', 'third.local'), false, 'cached data is invalidated');
    assert.strictEqual(await hiddenOtherHosts.contains('{SHARED}', 'master', 'third.local'), true);
    assert.strictEqual(hiddenOtherHosts.currentCached('{SHARED}', 'master', 'third.local').name, 'Edited in Options');

    // Site storage supports scopes too, and notices edits from another tab.
    await extension.save([]);
    const siteStore = new Store(0, false, 50);
    await siteStore.add(Object.assign({}, shared));
    assert.strictEqual(await siteStore.contains('{SHARED}', 'master', 'third.local'), true);
    values['sc_ext::favorites'] = '[]';
    localListeners.forEach(listener => listener({ key: 'sc_ext::favorites' }));
    assert.strictEqual(await siteStore.contains('{SHARED}', 'master', 'third.local'), false);

    // Icon URLs follow the effective target, while external URLs remain intact.
    const iconFavorite = Object.assign({}, shared, { icon: 'https://delivery.local/temp/iconcache/home.png?q=1#x' });
    assert.strictEqual(Favorites.Favorite.iconUrl(iconFavorite, 'author.local', 'https:'), 'https://author.local/temp/iconcache/home.png?q=1#x');
    iconFavorite.scope = 'instance';
    assert.strictEqual(Favorites.Favorite.iconUrl(iconFavorite, 'author.local', 'https:'), 'https://delivery.local/temp/iconcache/home.png?q=1#x');
    iconFavorite.icon = 'https://cdn.example/icon.png';
    assert.strictEqual(Favorites.Favorite.normalizeIcon(iconFavorite), iconFavorite.icon);
    assert.strictEqual(Favorites.Favorite.normalizeIcon(Object.assign({}, iconFavorite, { icon: 'data:image/png;base64,AAAA' })), 'data:image/png;base64,AAAA');
    await extension.save([Object.assign({}, shared, { host: undefined })]);
    assert.strictEqual((await extension.all()).length, 1, 'shared entries do not require a saved host');

    // Angular's per-page row IDs must never leak into saved favorites or survive a reload.
    const hashed = [
        Object.assign(favorite('{HASH-ONE}', 'One', 'author.local', 'master'), { $$hashKey: 'object:100' }),
        Object.assign(favorite('{HASH-TWO}', 'Two', 'author.local', 'master'), { $$hashKey: 'object:100' })
    ];
    values['sc_ext::favorites'] = JSON.stringify(hashed);
    const cleaned = await extension.all();
    assert.strictEqual(cleaned.length, 2, 'colliding Angular IDs must not discard favorites');
    assert.ok(cleaned.every(item => !Object.prototype.hasOwnProperty.call(item, '$$hashKey')), 'load must clean previously persisted Angular metadata');
    await extension.save(hashed);
    assert.ok(!values['sc_ext::favorites'].includes('$$hashKey'), 'save must exclude Angular metadata');
    await extension.update(cleaned[0], Object.assign({}, cleaned[0], { name: 'Edited', $$hashKey: 'object:200' }));
    assert.ok(!values['sc_ext::favorites'].includes('$$hashKey'), 'editing must not reintroduce Angular metadata');
    assert.strictEqual((await extension.all())[0].name, 'Edited');

    // Host patterns affect visibility and current-item identity, never the destination host.
    await extension.save([]);
    const localPattern = Object.assign(favorite('{PATTERN}', 'Local', 'source.cm', 'master'), { scope: 'matching', hostPattern: '*.cm' });
    const cloudPattern = Object.assign({}, localPattern, { name: 'Cloud', hostPattern: '*.sitecore-staging.cloud' });
    const patternedStore = new Store(1, false, 50);
    await patternedStore.add(localPattern);
    await patternedStore.add(cloudPattern);
    assert.strictEqual((await patternedStore.all()).length, 0, 'nonmatching patterns stay hidden');
    context.window.top.location.host = 'SC_1_9_14.CM:8443';
    assert.strictEqual((await patternedStore.all())[0].name, 'Local');
    assert.strictEqual(await patternedStore.contains('{pattern}', 'master', 'sc_1_9_14.cm:8443'), true);
    assert.strictEqual(await patternedStore.contains('{PATTERN}', 'core', 'sc_1_9_14.cm'), false);
    assert.strictEqual(Favorites.Favorite.appliesTo(localPattern, 'cm'), false, '*.cm requires the literal dot');
    assert.strictEqual(Favorites.Favorite.appliesTo(localPattern, 'authorXcm'), false, 'dots must not become regex wildcards');
    assert.strictEqual(Favorites.Favorite.appliesTo(localPattern, 'author.cm.evil'), false, 'match the whole hostname');
    assert.strictEqual(Favorites.Favorite.appliesTo(localPattern, 'author.cm'), true);
    assert.strictEqual(Favorites.Favorite.targetHost(localPattern, 'author.cm:8443'), 'author.cm:8443');
    assert.strictEqual(Favorites.Favorite.key(localPattern), Favorites.Favorite.key(Object.assign({}, localPattern, { host: 'other.cm', hostPattern: '*.CM' })));
    const showOtherHosts = new Store(1, true, 50);
    assert.strictEqual((await showOtherHosts.all()).length, 1, 'show-other-instances must not bypass pattern restrictions');
    context.window.top.location.host = 'xmc-1.sitecore-staging.cloud';
    assert.strictEqual((await patternedStore.all())[0].name, 'Cloud');

    // Exact > matching > any when multiple scopes apply to the current item.
    await patternedStore.add(Object.assign({}, localPattern, { scope: 'any', name: 'Any' }));
    assert.strictEqual(patternedStore.currentCached('{PATTERN}', 'master', 'xmc-1.sitecore-staging.cloud').name, 'Cloud');
    await patternedStore.add(Object.assign({}, cloudPattern, { scope: 'instance', host: 'xmc-1.sitecore-staging.cloud', name: 'Exact' }));
    assert.strictEqual(patternedStore.currentCached('{PATTERN}', 'master', 'XMC-1.SITECORE-STAGING.CLOUD').name, 'Exact');
    await patternedStore.remove('{PATTERN}', 'master', 'xmc-1.sitecore-staging.cloud');
    await patternedStore.remove('{PATTERN}', 'master', 'xmc-1.sitecore-staging.cloud');
    assert.strictEqual(patternedStore.currentCached('{PATTERN}', 'master', 'xmc-1.sitecore-staging.cloud').name, 'Any');
    assert.ok((await extension.all()).some(item => item.hostPattern === '*.cm' && item.scope === 'matching'), 'removing cloud favorite preserves local pattern');

    // Validation is literal wildcard syntax, with no URL, port or regex in a pattern.
    ['*.cm', '*.sitecore-staging.cloud', 'author-*.cm', '*'].forEach(hostPattern => {
        assert.strictEqual(Favorites.Favorite.validationError(Object.assign({}, localPattern, { hostPattern })), '');
    });
    ['', 'https://*.cm', '*.cm:8443', '.*\\.cm$', '*.cm/path', '(local|staging).cm'].forEach(hostPattern => {
        assert.ok(Favorites.Favorite.validationError(Object.assign({}, localPattern, { hostPattern })));
    });
    ['author.local', 'sc_1_9_14.cm:8443', '[::1]:8443'].forEach(host => {
        assert.strictEqual(Favorites.Favorite.validationError(Object.assign({}, legacy, { host })), '');
    });
    ['', '*.cm', 'https://author.local', 'author.local/path', 'author.local:99999', 'user@author.local'].forEach(host => {
        assert.ok(Favorites.Favorite.validationError(Object.assign({}, legacy, { host })));
    });

    // Editing an exact hostname preserves the icon path and blocks collisions or invalid hosts.
    const beforeHostEdit = Object.assign({}, legacy, { icon: 'https://delivery.local/temp/iconcache/item.png' });
    values['sc_ext::favorites'] = JSON.stringify([beforeHostEdit]);
    await extension.update(beforeHostEdit, Object.assign({}, beforeHostEdit, { host: 'new.local:8443' }));
    const afterHostEdit = (await extension.all())[0];
    assert.strictEqual(afterHostEdit.host, 'new.local:8443');
    assert.strictEqual(afterHostEdit.icon, '/temp/iconcache/item.png');
    let invalidHost;
    try { await extension.update(afterHostEdit, Object.assign({}, afterHostEdit, { host: '*.cm' })); } catch (error) { invalidHost = error; }
    assert.ok(invalidHost);
    assert.strictEqual((await extension.all())[0].host, 'new.local:8443', 'invalid hostname must not change storage');

    console.log('Favorites store self-check passed');
})().catch(error => {
    console.error(error);
    process.exit(1);
});

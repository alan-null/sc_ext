const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');
const source = ['app/sc_ext/modules/favorites/Favorite.ts', 'app/options/providers/OptionsProvider.ts',
    'app/options/controllers/SettingsController.ts'].map(file => fs.readFileSync(file, 'utf8')).join('\n');
const context = { exports: {}, Promise, URL, console, alert() {},
    BaseOptionsController: function () {},
    SitecoreExtensions: { Options: { BaseOptionsController: function () {} } } };
vm.runInNewContext(ts.transpile(source, { target: ts.ScriptTarget.ES5 }), context);
context.OptionsWrapper = context.SitecoreExtensions.Options.OptionsWrapper;
context.Modules = context.SitecoreExtensions.Modules;
const controller = Object.create(context.SitecoreExtensions.Options.SettingsController.prototype);
const favorite = { id: 'ABC', name: 'Home', database: 'master', host: 'author.local' };
let saved = [favorite];
let backup;
let imported;
controller.favoritesRepository = {
    all: () => Promise.resolve(saved.slice()),
    save: favorites => { saved = favorites; return Promise.resolve(); }
};
controller.optionsProvider = {
    getOptions: done => done({ options: [{ name: 'Favorites', model: {} }] }),
    setOptions: (options, done) => { imported = options; done(); }
};
controller.download = (name, value) => { backup = JSON.parse(value); };
controller.importButton = { disable() {} };
controller.fileInput = { detachFile() {} };
(async () => {
    controller.includeFavorites = false;
    controller.exportFile();
    assert.strictEqual(backup.favorites, undefined, 'favorites must be opt-in');
    controller.includeFavorites = true;
    controller.exportFile();
    await Promise.resolve();
    assert.strictEqual(backup.favorites[0].id, favorite.id);
    assert.strictEqual(backup.options[0].name, 'Favorites');
    const extra = Object.assign({}, favorite, { id: 'DEF' });
    controller.$scope = { vm: { file: { options: [], favorites: [Object.assign({}, favorite, { id: 'abc', name: 'Changed' }), extra, extra] } } };
    await controller.importFile();
    assert.strictEqual(saved.length, 2, 'import merges without duplicates');
    assert.strictEqual(saved[0].name, 'Home', 'existing favorites win');
    assert.strictEqual(imported.length, 0);
    controller.$scope.vm.file = { options: [{ name: 'Legacy', model: {} }] };
    await controller.importFile();
    assert.strictEqual(saved.length, 2, 'legacy backups preserve favorites');
    assert.strictEqual(imported[0].name, 'Legacy');
    controller.$scope.vm.file = { options: [], favorites: [] };
    await controller.importFile();
    assert.strictEqual(saved.length, 2, 'empty backups preserve favorites');
    console.log('Settings backup self-check passed');
})().catch(error => { console.error(error); process.exit(1); });

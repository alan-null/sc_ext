const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

const source = fs.readFileSync('app/sc_ext/modules/guid/GuidFormatter.ts', 'utf8');
const javascript = ts.transpile(source, { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None });
const context = { exports: {} };
vm.runInNewContext(javascript, context);

const format = context.SitecoreExtensions.Modules.Guid.GuidFormatter.format;
const results = format('{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}');

assert.deepStrictEqual(Array.prototype.map.call(results, result => result.value), [
    '{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}',
    '{110d559f-dea5-42ea-9c1c-8a5df7e70ef9}',
    '110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9',
    '110d559f-dea5-42ea-9c1c-8a5df7e70ef9',
    '110d559fdea542ea9c1c8a5df7e70ef9',
    '110D559FDEA542EA9C1C8A5DF7E70EF9',
    '%7B110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9%7D'
]);

console.log('GUID formatter self-check passed');
const assert = require('assert');
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');

const source = [
    'app/sc_ext/http/ItemService.ts',
    'app/sc_ext/modules/fieldInspector/ResetFieldsPage.ts'
].map(file => fs.readFileSync(file, 'utf8')).join('\n');
const context = { exports: {}, console, window: { top: { location: { origin: 'https://cm.local' } } } };
vm.runInNewContext(ts.transpile(source, { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None }), context);
const Http = context.SitecoreExtensions.Http;
const Page = context.SitecoreExtensions.Modules.FieldInspector.ResetFieldsPage;

// Minimal DOM: elements with tagName, classList, children, parentElement and text.
function el(tag, attrs, children) {
    const node = {
        nodeType: 1, tagName: tag.toUpperCase(), id: (attrs && attrs.id) || '', parentElement: null,
        classList: { contains: c => ((attrs && attrs.class) || '').split(' ').indexOf(c) !== -1 },
        childNodes: (children || []).map(c => typeof c === 'string' ? { nodeType: 3, textContent: c } : c),
        get textContent() { return this.childNodes.map(c => c.textContent).join(''); },
        querySelector(selector) {
            const cls = selector.replace(/^\./, '');
            for (const c of this.childNodes) {
                if (c.nodeType !== 1) continue;
                if (c.classList.contains(cls)) return c;
                const found = c.querySelector(selector);
                if (found) return found;
            }
            return null;
        }
    };
    node.childNodes.forEach(c => { if (c.nodeType === 1) c.parentElement = node; });
    return node;
}
const field = (hex, label) => el('div', { class: 'scEditorFieldMarker' }, [
    el('div', { class: 'scEditorFieldLabel' }, [label, el('a', {}, ['Go to field'])]),
    el('input', { id: 'Reset_' + hex })
]);
const fields = [
    field('0123456789ABCDEF0123456789ABCDEF', 'Title:'),
    field('11111111222233334444555555555555', 'Date [shared]:'),
    field('AAAAAAAABBBBCCCCDDDDEEEEEEEEEEEE', 'Title:')
];
const boxes = fields.map(f => f.childNodes[1]);
const doc = { querySelectorAll: () => boxes, querySelector: () => null };

const plain = value => JSON.parse(JSON.stringify(value));
const entries = plain(Page.parse(doc));
assert.deepStrictEqual(entries.map(e => e.id), [
    '{01234567-89AB-CDEF-0123-456789ABCDEF}', '{11111111-2222-3333-4444-555555555555}', '{AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE}'
]);
assert.deepStrictEqual(entries.map(e => e.label), ['Title', 'Date [shared]', 'Title'], 'labels drop add-on links and the colon');

// Duplicate labels pair in order; a suffix mismatch falls back to the loose key; unknown labels stay null.
assert.deepStrictEqual(plain(Page.match(['Title', 'Date', 'Title', 'Missing'], entries)), [
    '{01234567-89AB-CDEF-0123-456789ABCDEF}', '{11111111-2222-3333-4444-555555555555}', '{AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE}', null
]);
assert.strictEqual(Page.toHex('{01234567-89ab-cdef-0123-456789abcdef}'), '0123456789ABCDEF0123456789ABCDEF');
assert.strictEqual(Page.url('https://cm.local', '{ID}', 'da-DK', '3', 'master'),
    'https://cm.local/sitecore/shell/default.aspx?xmlcontrol=ResetFields&id=%7BID%7D&la=da-DK&vs=3&db=master');

const service = new Http.ItemService();
assert.strictEqual(service.itemUrl('{ABC}', { database: 'master', fields: ['ItemName', 'ItemPath'], includeStandardTemplateFields: true }),
    'https://cm.local/sitecore/api/ssc/item/ABC?database=master&fields=ItemName%2CItemPath&includeStandardTemplateFields=true');
assert.ok(new Http.ItemServiceError(403).isUnavailable());
assert.ok(!new Http.ItemServiceError(404).isUnavailable());

console.log('Field Inspector Reset Fields self-check passed');

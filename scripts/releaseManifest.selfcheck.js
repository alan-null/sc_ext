var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var releaseManifest = require('./releaseManifest');

var source = {
    name: 'example',
    web_accessible_resources: [
        { resources: ['sc_ext/*.map'], matches: ['<all_urls>'] },
        { resources: ['images/icon.png', 'chrome/*.map'], matches: ['https://example.com/*'], use_dynamic_url: true }
    ]
};
var original = JSON.stringify(source);
assert.deepStrictEqual(releaseManifest.prepare(source), {
    name: 'example',
    web_accessible_resources: [
        { resources: ['images/icon.png'], matches: ['https://example.com/*'], use_dynamic_url: true }
    ]
});
assert.strictEqual(JSON.stringify(source), original);
assert.deepStrictEqual(releaseManifest.prepare({ web_accessible_resources: [source.web_accessible_resources[0]] }), {});
assert.deepStrictEqual(releaseManifest.prepare({ name: 'example' }), { name: 'example' });

var directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sc-ext-release-'));
var manifestPath = path.join(directory, 'manifest.json');
var nested = path.join(directory, 'chrome');
var mapPath = path.join(nested, 'bridge.js.map');
try {
    fs.writeFileSync(manifestPath, JSON.stringify(releaseManifest.prepare(source)));
    releaseManifest.validate(directory);
    fs.mkdirSync(nested);
    fs.writeFileSync(mapPath, '{}');
    assert.throws(function () { releaseManifest.validate(directory); }, /must not contain source maps/);
    fs.unlinkSync(mapPath);
    fs.writeFileSync(manifestPath, JSON.stringify(source));
    assert.throws(function () { releaseManifest.validate(directory); }, /must not expose source maps/);
} finally {
    if (fs.existsSync(mapPath)) { fs.unlinkSync(mapPath); }
    if (fs.existsSync(nested)) { fs.rmdirSync(nested); }
    fs.unlinkSync(manifestPath);
    fs.rmdirSync(directory);
}
console.log('Release manifest self-check passed');

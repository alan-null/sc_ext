var fs = require('fs');
var path = require('path');

function isSourceMap(resource) {
    return /\.map$/i.test(resource);
}

function prepare(manifest) {
    var result = JSON.parse(JSON.stringify(manifest));
    if (result.web_accessible_resources) {
        result.web_accessible_resources = result.web_accessible_resources.filter(function (entry) {
            entry.resources = entry.resources.filter(function (resource) {
                return !isSourceMap(resource);
            });
            return entry.resources.length > 0;
        });
        if (result.web_accessible_resources.length === 0) {
            delete result.web_accessible_resources;
        }
    }
    return result;
}

function validate(directory) {
    var manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
    (manifest.web_accessible_resources || []).forEach(function (entry) {
        if (entry.resources.some(isSourceMap)) {
            throw new Error('Release manifest must not expose source maps');
        }
    });
    function inspect(folder) {
        fs.readdirSync(folder).forEach(function (name) {
            var file = path.join(folder, name);
            if (fs.statSync(file).isDirectory()) {
                inspect(file);
            } else if (isSourceMap(name)) {
                throw new Error('Release must not contain source maps: ' + file);
            }
        });
    }
    inspect(directory);
}

module.exports = { prepare: prepare, validate: validate };

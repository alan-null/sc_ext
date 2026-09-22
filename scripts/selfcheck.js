var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var scriptsDirectory = __dirname;
var projectDirectory = path.join(scriptsDirectory, '..');
var selfChecks = fs.readdirSync(scriptsDirectory)
    .filter(function (name) { return /\.selfcheck\.js$/.test(name); })
    .sort();

selfChecks.forEach(function (name) {
    var result = childProcess.spawnSync(process.execPath, [path.join(scriptsDirectory, name)], {
        cwd: projectDirectory,
        stdio: 'inherit'
    });

    if (result.error) {
        throw result.error;
    }
    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
});

console.log('All self-checks passed');
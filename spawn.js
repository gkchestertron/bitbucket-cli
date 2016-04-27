var cp = require('child_process');
var P  = require('bluebird');

module.exports = function (cmd, args) {
    return new P(function (resolve, reject) {
        var sp = cp.spawn(cmd, args);

        sp.stdout.on('data', function (data) {
            process.stdout.write(data.toString());
        });
        
        sp.stdin.on('data', function (data) {
            process.stdout.write(data.toString());
        });

        sp.stderr.on('data', function (data) {
            process.stdout.write(data.toString());
        });
        
        sp.on('exit', function (code) {
            resolve('');
        });
        
        sp.on('error', function (err) {
            reject(err);
        });
    })
};

var cp = require('child_process');
var P  = require('bluebird');

module.exports = function (cmd, args) {
    return new P(function (resolve, reject) {
        var sp = cp.spawn(cmd, args, {
            customFds: [
                process.stdin,
                process.stdout,
                process.stderr
            ]
        });
        
        sp.on('exit', function (code) {
            resolve(code);
        });
        
        sp.on('error', function (err) {
            reject(err);
        });
    })
};

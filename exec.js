var exec = require('child_process').exec;
var P    = require('bluebird');

module.exports = function (cmd, log) {
    var p = new P(function (resolve, reject) {
        exec(cmd, function (err, stdout, stderr) {
            if (err)
                reject(err);
            else
                resolve(stdout);
        });
    })
    
    if (log)
        p.then(console.log.bind(console));

    return p;
};

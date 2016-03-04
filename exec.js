var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout) }
module.exports = function (cmd) {
    exec(cmd, puts);
};

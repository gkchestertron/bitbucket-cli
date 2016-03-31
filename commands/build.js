var exec = require('../exec');

module.exports = {
    description: 'builds the current branch',

    exec: function (target) {
        return exec('vagrant ssh -c "fixall"');
    }
};

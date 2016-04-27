var spawn = require('../spawn');

module.exports = {
    description: 'builds the current branch',

    exec: function (target) {
        return spawn('vagrant', ['ssh', '-c fixall']);
    }
};

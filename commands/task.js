var exec = require('../exec');
var spawn = require('../spawn');

module.exports = {
    description: 'runs various task schedulers on vagrant',

    cis: {
        description: 'runs the rapid cis scheduler',

        exec: function (target) {
            return spawn('vagrant', ['ssh','-c /var/www/secure/util/taskMan.php --rapid schedule']);
        }
    },

    pdf: {
        description: 'runs the batch pdf scheduler',

        exec: function (target) {
            return spawn('vagrant', ['ssh', '-c /var/www/secure/util/taskMan.php --tags \'pdf-stage\' schedule']);
        }
    }
};

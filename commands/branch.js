var exec = require('../exec');
var _    = require('underscore');

module.exports = {
    checkout: {
        description: '<number> [<index> (if multiple)] checkout a branch based on an issue number',

        exec: function (target, branchNumber, index) {
            return exec("git branch -a | grep '"+branchNumber+"'")
            .then(function (branches) {
                branches = _.map(branches.split('\n'), function (branch) {
                    return branch.trim();
                });

                if (branches.length === 1)
                    return exec('git checkout '+branches[0]);
                else if (index !== undefined)
                    return exec('git checkout '+branches[index]);
                else
                    return 'Multiple branches:\n'+branches.join('\n');
            });
        }
    },

    list: {
        description: 'list branches',

        exec: function (target) {
            if (_.has(target, 'all'))
                return exec('git branch -a');
            else
                return exec('git branch');
        },

        flags: {
            a: {
                description: 'list all',

                name: 'all'
            }
        }
    }
};

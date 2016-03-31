var exec = require('../exec');
var _    = require('underscore');

module.exports = {
    checkout: {
        description: 'checkout a branch based on an issue number',

        exec: function (target, branchNumber) {
            return exec('git branch -a | grep '+branchNumber)
            .then(function (branches) {
                branches = branches.split('\n');
                return _.map(branches, function (branch) {
                    if (/^\/remotes\/origin\//.test(branch))
                        return branch.slice(15);
                    return branch;
                }).join('\n');
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

var exec = require('../exec');
var _    = require('underscore');

module.exports = {
    checkout: {
        description: '<number> [<index> (if multiple)] checkout a branch based on an issue number',

        exec: function (target, branchNumber, index) {
            return exec("git branch -a | grep '"+branchNumber+"'")
            .then(function (branches) {
                index = index || 0;
                branches = _.filter(_.map(branches.split('\n'), function (branch) {
                    return branch.split('*').join('').trim();
                }), function (branch) {
                    return branch.length;
                });


                if (branches.length === 1 || index) {
                    var branch = branches[index].split('/');
                    
                    while(/remotes|origin/.test(branch[0]))
                          branch.shift();

                    branch = branch.join('/');
                    return exec('git checkout '+branch);
                }
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

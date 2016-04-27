var spawn = require('../spawn');
var exec = require('../exec');
var _    = require('underscore');

module.exports = {
    description: '<grep pattern> [<index> (if multiple)] checkout a branch based on an issue number',

    exec: function (target, branchNumber, index) {
        return exec("git branch -a | grep '"+branchNumber+"'")
        .then(function (branches) {
            index = index || 0;
            branches = _.filter(_.map(branches.split('\n'), function (branch) {
                return branch.split('*').join('').trim();
            }), function (branch) {
                return branch.length;
            }),
            localBranches = _.filter(branches, function (branch) {
                return !/removes|origin/.test(branch);
            });

            if (localBranches.length === 1)
                return spawn('git', ['checkout', localBranches[0]]);
            else if (branches.length === 1 || index) {
                var branch = branches[index].split('/');
                
                while(/remotes|origin/.test(branch[0]))
                      branch.shift();

                branch = branch.join('/');
                return spawn('git', ['checkout', branch]);
            }
            else
                return 'Multiple branches:\n'+branches.join('\n');
        });
    }
};

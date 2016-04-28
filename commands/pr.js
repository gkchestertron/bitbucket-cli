var P      = require('bluebird');
var fs     = require('fs');
var https  = require('https');
var config = require('../config');
var style  = require('../style');
var rest   = require('../rest');
var exec   = require('../exec');
var spawn  = require('../spawn');
var _      = require('underscore');

module.exports = {
    create: {
        description: '<title> <fromRef> <toRef> create a pull request',
        display: function (result) {
            console.log(JSON.stringify(result));
        },
        exec: function (target, title, fromRef, toRef) {
            if (!title)
                return Promise.resolve('please enter a title');

            if (!fromRef)
                return Promise.resolve('please enter a fromRef');

            if (!toRef)
                return Promise.resolve('please enter a toRef');

            reviewers = target.reviewers || '';

            reviewers = reviewers.split('frontend').join('fonesr,JoopallS,ponnagag,SreenivasanK');
            reviewers = _.map(reviewers.split(','), function (reviewer) {
                return { user: { name: reviewer.trim() }};
            });

            return rest.post('pull-requests', JSON.stringify({
                title: title,
                description: target.description || '',
                fromRef: {
                    id: fromRef
                },
                toRef: {
                    id: toRef
                },
                reviewers: reviewers
            }));
        },

        flags: {
            r: {
                description: 'reviewers - comma separated string'
                + '\npossible reviewers: '
                + '\nfellmanj, fonesr, ponnagag, JoopallS, SreenivasanK,'
                + '\nhulettp, brownp, riegerj, chismb',
                name: 'reviewers'
            },
            d: {
                description: 'description',
                name: 'description'
            }
        }
    },
    description: '[<id>] gets the pull-requests',
    display: function (result) {
        _.each(result.prs, function (pr) {
            var dashes = '';

            while(dashes.length < pr.title.length)
                dashes += '-';

            console.log(style.title(pr.title)); 
            console.log(style.label('id:'), style.prop(pr.id), style.label('; '),
            style.label('Author:'), style.prop(pr.author.user.name), style.label('; '),
            style.label('reviewers:'), _.map(pr.reviewers, function (reviewer) {
                var str;

                if (reviewer.user.name === config.username)
                    str = style.me(reviewer.user.name);
                else
                    str = style.prop(reviewer.user.name);

                if (reviewer.approved)
                    str += style.prop(' - ')+style.highlight('approved');
                
                return str;
            }).join(style.label(', ')));
            if (pr.attributes && pr.attributes.openTaskCount)
                console.log(style.label('Open Tasks: '), style.prop(pr.attributes.openTaskCount[0]));
            if (result.prs.length === 1) {
                console.log(style.label(dashes));
                console.log(style.text(pr.description));
                console.log('');
                console.log(style.label(dashes));
            }
            console.log(style.label('link:'), style.prop(pr.links.self[0].href));
            console.log('');
        });
    },
    exec: function (target, id) {
        var path = 'pull-requests/'+(id || '');

        return rest.fetch(path).then(function (response) {
            var result = {};

            result.prs =  response.values || [response];

            if (result.prs.length > 1 && !_.has(target, 'tasks')) {
                result.prs = _.filter(result.prs, function (pr) {
                    return pr.attributes && parseInt(pr.attributes.openTaskCount[0]) === 0;
                });
            }

            result.prs.sort(function (a, b) {
                return a.id - b.id;
            });

            return result;
        })
    },
    flags: {
        a: {
            description: 'specify an author (defaults to yourself)',
            exec: function (target, result) {
                var authorName = target.author || config.username;

                result.prs = _.filter(result.prs, function (pr) {
                    return pr.author.user.name === authorName;
                });
            },
            name: 'author'
        },

        b: {
            description: 'builds on the pr\'s branch',
            exec: function (target, result) {
                var pr = result.prs[0];
                return spawn('git', ['checkout', pr.fromRef.displayId])
                .then(function () {
                    return spawn('vagrant', ['ssh', '-c fixall']);
                })
                .then(function () {
                    console.log('\n\n\n\n');
                });
            },
            name: 'build'
        },

        c: {
            description: 'checks out the pr\'s branch',
            exec: function (target, result) {
                var pr = result.prs[0];
                return spawn('git', ['checkout', pr.fromRef.displayId])
                .then(function () {
                    console.log('\n\n\n\n');
                });
            },
            name: 'checkout'
        },

        o: {
            description: 'opens the pr in your default browser',
            exec: function (target, result) {
                var pr = result.prs[0];
                exec('open '+pr.links.self[0].href+'/diff');
            },
            name: 'open'
        },

        r: {
            description: 'specify a reviewer (defaults to yourself)',
            exec: function (target, result) {
                var reviewerName = target.reviewer || config.username;

                result.prs = _.filter(result.prs, function (pr) {
                    var reviewers = _.map(pr.reviewers, function (reviewer) {
                            return reviewer.user.name;
                        });

                    return reviewers.indexOf(reviewerName) > -1;
                });
            },
            name: 'reviewer'
        },

        t: {
            description: 'show prs with open tasks',
            name: 'tasks'
        }
    }
};

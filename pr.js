var https  = require('https');
var config = require('./config');
var rest   = require('./rest');
var clc    = require('cli-color');
var exec   = require('./exec');
var _      = require('underscore');

//colors
title = clc.yellow;
label = clc.green;
prop = clc.blue;
text  = clc.greenBright;
me   = clc.blue.bgBlackBright;

module.exports.fetch = function (path, args, flags, options) {
    rest.fetch(path).then(function (response) {
        var prs = response.values || [response],
            authorname = reviewername = config.username;

        // author flag
        if (flags['a']) {
            if (flags['a'] !== true)
                authorname = flags['a'];

            prs = _.filter(prs, function (pr) {
                return pr.author.user.name === authorname;
            });
        }

        // reviers flag
        if (flags['r']) {
            if (flags['r'] !== true)
                reviewername = flags['r'];

            prs = _.filter(prs, function (pr) {
                var reviewers = _.map(pr.reviewers, function (reviewer) {
                        return reviewer.user.name;
                    });

                return reviewers.indexOf(reviewername) > -1;
            });
        }

        _.each(prs, function (pr) {
            var dashes = '';

            while(dashes.length < pr.title.length)
                dashes += '-';

            console.log(title(pr.title)); 
            console.log(label('id:'), prop(pr.id), label('; '),
            label('Author:'), prop(pr.author.user.name), label('; '),
            label('reviewers:'), _.map(pr.reviewers, function (reviewer) {
                if (reviewer.user.name === config.username)
                    return me(reviewer.user.name);
                return prop(reviewer.user.name);
            }).join(label(', ')));
            if (prs.length === 1) {
                // open flag
                if (flags['o'])
                    exec('open '+pr.links.self[0].href+'/diff');

                // patch flag
                if (flags['p']) {
                    exec('git checkout '+pr.fromRef.displayId);
                    exec('git pull');
                    exec('vagrant ssh -c "fixall"');
                }

                console.log(label(dashes));
                console.log(text(pr.description));
                console.log('');
                console.log(label(dashes));
            }
            console.log(label('link:'), prop(pr.links.self[0].href));
            console.log('');
        });
    });
};

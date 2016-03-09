var fs     = require('fs');
var https  = require('https');
var config = require('../config');
var style  = require('../style');
var rest   = require('../rest');
var exec   = require('../exec');
var spawn  = require('../spawn');
var _      = require('underscore');

module.exports = {
    create: function () {
        spawn('vim', [__dirname+'/template.txt', '-c :w! '+__dirname+'/temp.txt'])
        .then(function () {
            return spawn('vim', [__dirname+'/temp.txt']);
        });
    },

    exec: function (path, args, flags, options) {
        var method = 'read';

        if (flags['c'])
            method = 'create';

        this[method].apply(this, arguments);
    },

    read: function (path, args, flags, options) {
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

            // reviewers flag
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

            if (flags['g']) {
                prs = _.filter(prs, function (pr) {
                    var re = new RegExp(flags['g'], 'i');

                    return re.test(JSON.stringify(pr));
                });
            }

            if (flags['j'])
                fs.writeFile(__dirname+'/temp.json', JSON.stringify(prs));

            _.each(prs, function (pr) {
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
                if (prs.length === 1) {
                    // open flag
                    if (flags['o'])
                        exec('open '+pr.links.self[0].href+'/diff');

                    // patch flag
                    if (flags['b']) {
                        exec('git checkout '+pr.fromRef.displayId);
                        exec('git pull');
                        exec('vagrant ssh -c "fixall"');
                    }

                    console.log(style.label(dashes));
                    console.log(style.text(pr.description));
                    console.log('');
                    console.log(style.label(dashes));
                }
                console.log(style.label('link:'), style.prop(pr.links.self[0].href));
                console.log('');
            });
        });
    }
}

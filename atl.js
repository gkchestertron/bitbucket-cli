var _       = require('underscore');
var fs      = require('fs');
var exec    = require('./exec');
var pr      = require('./pr');
var config  = require('./config');
var rawArgs = process.argv.slice(2);
var args    = [];
var flags   = {};
var options = {};
var arg;
var option;
var flag;

// clear screen
exec('clear').then(console.log.bind(console));

while (arg = rawArgs.shift()) {
    if (/--/.test(arg)) {
        arg = arg.slice(2);

        if (/=/.test(arg))
            options[arg.split('=')[0]] = arg.split('=')[1];
        else if (rawArgs[0] && !/-/.test(rawArgs[0]))
            options[arg.slice(2)] = rawArgs.shift();
        else
            option[arg] = true;
    }
    else if (/-/.test(arg)) {
        arg = arg.slice(1).split('');

        for (var i in arg) {
            if (rawArgs[0] && !/-/.test(rawArgs[0]))
                flags[arg[i]] = rawArgs.shift();
            else
                flags[arg[i]] = true;
        }
    }
    else {
        args.push(arg);
    }
}

var action    = args[0];
var subAction = args[1];
var path;

switch (action) {
    case 'pr':
        if (subAction === 'all')
            subAction = '';
        path = 'pull-requests/'+(subAction || '');
        pr.exec(path, args, flags, options);
        break;
    default:
        if (Object.keys(flags).length) {
            runFlags(action, subAction, flags);
            break;
        }
        fs.readFile(__dirname+'/usage.txt', 'utf8', function (err, data) {
            if (err)
                throw err;
            console.log(data);
        });
        break;
}

function runFlags(action, subAction, flags) {
    var scriptObj = config.scripts;

    if (action)
        scriptObj = scriptObj[action];

    if (subAction)
        scriptObj = scriptObj[subAction];

    _.each(flags, function (value, flag) {
        if (scriptObj[flag])
            scriptObj[flag](value);
    });
}

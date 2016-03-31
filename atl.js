var P      = require('bluebird');
var fs     = require('fs');
var https  = require('https');
var config = require('./config');
var style  = require('./style');
var rest   = require('./rest');
var exec   = require('./exec');
var spawn  = require('./spawn');
var _      = require('underscore');

require('fun_with_flags')({
    branch : require('./commands/branch'),
    build  : require('./commands/build'),
    pr     : require('./commands/pr')
});

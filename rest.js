var https  = require('https');
var config = require('./config');
var _ = require('underscore');
var P = require('bluebird');

module.exports.fetch = function (path) {
    return new P(function (resolve, reject) {
        if (!path) 
            return reject({ err: { msg: 'no path' }});

        var options = {
            protocol: 'https:',
            auth: config.username+':'+config.password,
            host: config.host,
            method: 'GET',
            path: config.basePath+'projects/'+config.project+'/repos/'+config.repo+'/'+path
        };

        var request = https.request(options, function (response) {
            var data = '';
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                resolve(JSON.parse(data));
            });
        });

        request.end();
    })
    .catch(console.log.bind(console));
}

module.exports.post = function (path, body) {
    return new P(function (resolve, reject) {
        if (!path) 
            return reject({ err: { msg: 'no path' }});

        var options = {
            protocol: 'https:',
            auth: config.username+':'+config.password,
            host: config.host,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            path: config.basePath+'projects/'+config.project+'/repos/'+config.repo+'/'+path
        };

        var request = https.request(options, function (response) {
            var data = '';
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                resolve(JSON.parse(data));
            });
        });

        if (body)
            request.write(body);


        request.end();
    })
    .catch(console.log.bind(console));
}

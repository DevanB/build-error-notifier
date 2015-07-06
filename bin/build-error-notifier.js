var notifier = require('node-notifier');
var _ = require('underscore');
var handlebars = require('handlebars');
var path = require('path');

process.stdin.resume();  
process.stdin.pipe(process.stdout);  
process.stdin.setEncoding('utf8');

var config = {
    'tsc': {
        regex: /(?:.*\/)*(.*)\((\d*),(\d*)\): (.*)/,
        title: 'Typescript Compiler',
        subtitle: '{{1}}[{{2}}:{{3}}]',
        message: '{{{4}}}',
        icon: path.join(__dirname, '/images/tsc.png')
    },
    'node-sass': {
        regex: /{\s*"message": "(.*)",\n\s*"column": (.*),\n\s*"line": (.*),\n\s*"file": "(?:.*\/)*(.*)",\n.*\n}/,
        title: 'Sass Compiler',
        subtitle: '{{4}}[{{3}}:{{2}}]',
        message: '{{{1}}}',
        icon: path.join(__dirname, '/images/sass.png')
    },
    'tslint': {
        regex: /(?:.*\/)*(.*)\[(\d*), (\d*)]: (.*)/,
        title: 'TSLint',
        subtitle: '{{1}}[{{2}}:{{3}}]',
        message: '{{{4}}}',        
        icon: path.join(__dirname, '/images/tslint.png')
    },
    'jasmine-node': {
        regex: /\s*Error: (.*)\n\s*at .*\/(.*):(\d*):(\d*)/,
        title: 'Jasmine Test',
        subtitle: '{{2}}[{{3}}:{{4}}]',
        message: '{{{1}}}',                
        icon: path.join(__dirname, '/images/jasmine.png')
    }
};

process.stdin.on('data', function (chunk) {
    _.each(config, function(match, key, list) {
        var groupsArray = chunk.match(match.regex);
        if (groupsArray) {
            var groups = _.object(_.range(groupsArray.length), groupsArray);
            var notifyParams = {
                title: handlebars.compile(match.title)(groups),
                message: handlebars.compile(match.message)(groups),
                subtitle: handlebars.compile(match.subtitle)(groups),
                sound: match.sound, 
                icon: match.icon,
                contentImage: match.contentImage, 
                open: match.open, 
                wait: match.wait 
            };
            notifier.notify(notifyParams);
        }
    });
});
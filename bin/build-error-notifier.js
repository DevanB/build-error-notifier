#!/usr/bin/env node

var notifier = require('node-notifier')
var _ = require('underscore')
var handlebars = require('handlebars')
var path = require('path')
var argv = require('minimist')(process.argv.slice(2))

var config = {
  'browserify': {
    regex: /(?:(?:Error:\sParsing\sfile)|(?:SyntaxError:))\s(?:.*\/)*(.*.js):\s(.*)\s\((.*)\)/,
    title: 'Browserify',
    subtitle: '{{{2}}}',
    message: '{{{1}}} [{{{3}}}]',
    icon: path.join(__dirname, '/images/browserify_watchify.png')
  },
  'jasmine-node': {
    regex: /\s*^Error: (.*)\.\n\s*at .*\/(.*):(\d*):(\d*)/,
    title: 'Jasmine Test',
    subtitle: '{{2}}[{{3}}:{{4}}]',
    message: '{{{1}}}',
    icon: path.join(__dirname, '/images/jasmine.png')
  },
  'karma': {
    regex: /\t(?:AssertionError|Error): (.*)(?:\n\t    .*)*\n\t    at .*\/([^:]*):(\d*):(\d*)/,
    title: 'Karma Test',
    subtitle: '{{2}}[{{3}}:{{4}}]',
    message: '{{{1}}}',
    icon: path.join(__dirname, '/images/karma.png')
  },
  'node-sass': {
    regex: /{\s*"status":\s1,\n\s*"file": "(?:.*\/)*(.*)",\n\s*"line": (.*),\n\s*"column": (.*),\n\s*"message": "(.*)",\n\s*.*\n\s*}/,
    title: 'Sass Compiler',
    subtitle: '{{{1}}} [{{2}}:{{3}}]',
    message: '{{{4}}}',
    icon: path.join(__dirname, '/images/sass.png')
  },
  'tsc': {
    regex: /(?:.*\/)*(.*)\((\d*),(\d*)\): (.*)/,
    title: 'Typescript Compiler',
    subtitle: '{{1}}[{{2}}:{{3}}]',
    message: '{{{4}}}',
    icon: path.join(__dirname, '/images/tsc.png')
  },
  'tslint': {
    regex: /(?:.*\/)*(.*)\[(\d*), (\d*)]: (.*)/,
    title: 'TSLint',
    subtitle: '{{1}}[{{2}}:{{3}}]',
    message: '{{{4}}}',
    icon: path.join(__dirname, '/images/tslint.png')
  }
}

if (argv.addConfig) {
    var fullPath = path.join(process.cwd(), argv.addConfig)
    var addedConfig
    try {
        addedConfig = require(fullPath)
    } catch (e) {
        console.log('Failed to load added config file from ', fullPath)
        process.exit(1)
    }
    config = _.extend(config, addedConfig)
}

process.stdin.resume()
process.stdin.pipe(process.stdout)
process.stdin.setEncoding('utf8')

process.stdin.on('data', function (chunk) {
    _.each(config, function (match, key, list) {
        var groupsArray = chunk.match(match.regex)
        if (groupsArray) {
            var groups = _.object(_.range(groupsArray.length), groupsArray)
            var notifyParams = {
                title: handlebars.compile(match.title)(groups),
                message: handlebars.compile(match.message)(groups),
                subtitle: handlebars.compile(match.subtitle)(groups),
                sound: match.sound,
                icon: match.icon,
                contentImage: match.contentImage,
                open: match.open,
                wait: match.wait
            }
            notifier.notify(notifyParams)
        }
    })
})

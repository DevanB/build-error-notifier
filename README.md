# build-error-notifier
Build error notifications for your build toolchain. Supports tsc (typescript compiler), tslint, node-sass,
and jasmine-node (test runner). More to come.

![Example](https://raw.githubusercontent.com/mvindahl/build-error-notifier/master/docs/images/example.png)

## What is this?
A CLI tool which notifies you of errors from your build process. Simply [pipe](https://en.wikipedia.org/wiki/Pipeline_(Unix))
build output to build-error-notifier. It recognizes output from a growing list of CLI build tools; see the Usage section for details.

Recognized error messages are displayed using the [node-notifier](https://www.npmjs.com/package/node-notifier) module.
Only the basic information, such as the tool, the file, and the line number are displayed in the notification

All input, whether recognized or not, is piped to stdout, so the full error messages will still appear in the
terminal log.

It has been designed to play well with [npm based](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)
build environments, or with any kind of "watching" CLI build tool.

## Install
`npm install build-error-notifier -g`

## Usage
For most tools, it's just a matter of piping the output. For some tools, you need to redirect stderr to stdin first, by
inserting 2>&1 before the pipe.

### [node-sass](https://www.npmjs.com/package/node-sass) (Sass compiler)
Example:
`node-sass ./styles.scss -o ./styles.css --watch 2>&1 | build-error-notifier`

### [tsc](https://www.npmjs.com/package/typescript) (TypeScript compiler)
Example:

`tsc ./src.ts --out ./out.js --watch | build-error-notifier`

### [tslint](https://www.npmjs.com/package/tslint) (TypeScript linter)
Example:

`tslint ./src.ts | build-error-notifier`

### [jasmine-node](https://www.npmjs.com/package/jasmine-node) (Test runner)
Example:

`jasmine-node ./test/ --autotest | build-error-notifier.js`

NOTE: You can also use the built-in --growl option if you have paid for growl and if you want it to notify you on successful test runs
as well. The build-error-notifier will only notify of errors to avoid "notification fatigue".

## Parameters
use `--addConfig [path to file]` to add custom configuration. The file should be a node module and should export a data
structure similar to the one defined in [build-error-notifier.js](https://github.com/mvindahl/build-error-notifier/blob/master/bin/build-error-notifier.js).
See [this file](https://github.com/mvindahl/build-error-notifier/blob/master/spec/testConfig.js) for an example.

## Q&A
### Why don't you support tool X?
This is just a starting point and is based upon the tools which I frequently use. On the top of my head, I plan to add support
for CoffeeScript, Less CSS, JSHint, Mocha, and whichever testing frameworks that have gained traction.

Oh, and I accept pull requests. The code is really simple, RegEx based stuff.

### Which operating systems will this work on?
MacOS for sure. Linux, probably, although I have yet to test it. Windows, maybe to some extent. It won't recognize the
backslach file path delimiters as of now, but it would be an easy fix if someone wants it.

### Don't I need to tell it which build tool to scan for?
In the current version, no. It will scan for everything. It's simple and I don't think there'll be any real performance impact
from this.
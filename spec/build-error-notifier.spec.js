var mockery = require('mockery');
var sinon = require('sinon');
var stdin = require('mock-stdin').stdin();
var stdMocks = require('std-mocks');
var path = require('path');

var nodeNotifierMock = {
    notify: sinon.spy()
};

var buildErrorNotifier;

describe('build-error-notifier', function() {
  beforeEach(function() {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false
    });
    
    mockery.registerMock('node-notifier', nodeNotifierMock);

    buildErrorNotifier = require('../bin/build-error-notifier.js');

    nodeNotifierMock.notify.reset();
  });

  afterEach(function() {
    mockery.deregisterMock('node-notifier');
    
    mockery.disable();
  });
  
  it('pipes stdin to stdout', function() {
    var output = 'some arbitrary text';

    stdMocks.use();
    stdin.send(output); 
    stdMocks.restore();

    var captured = stdMocks.flush().stdout;

    expect(captured).toEqual([ output ]);
  });
  
  it('can process output from node-sass', function() {
    var output = [
        '{',
        '    "message": "invalid top-level expression",',
        '    "column": 3,',
        '    "line": 6,',
        '    "file": "./client/src/css/scss/_common.scss",',
        '    "status": 1',
        '}'].join('\n');

    stdMocks.use();
    stdin.send(output); 
    stdMocks.restore();

    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Sass Compiler');
    expect(output.subtitle).toEqual('_common.scss[6:3]');
    expect(output.message).toEqual('invalid top-level expression');
    expect(output.icon).toEqual(path.join(__dirname, '../bin/images/sass.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toBeUndefined();
  });

  it('can process output from tsc', function() {
    var output = 'src/main/client/admin.ts(24,2): error TS1005: \'}\' expected.';

    stdMocks.use();
    stdin.send(output); 
    stdMocks.restore();

    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Typescript Compiler');
    expect(output.subtitle).toEqual('admin.ts[24:2]');
    expect(output.message).toEqual('error TS1005: \'}\' expected.');
    expect(output.icon).toEqual(path.join(__dirname, '../bin/images/tsc.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toBeUndefined();
  });
  
  it('can process output from tslint', function() {
    var output = 'src/main/client/admin.ts[4, 15]: missing whitespace';

    stdMocks.use();
    stdin.send(output); 
    stdMocks.restore();

    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('TSLint');
    expect(output.subtitle).toEqual('admin.ts[4:15]');
    expect(output.message).toEqual('missing whitespace');
    expect(output.icon).toEqual(path.join(__dirname, '../bin/images/tslint.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toBeUndefined();
  });

  it('can process output from jasmine-node', function() {
    var output = [
        'Error: Expected 1 to equal 42.',
        'at /Users/bob/someproject/target/test/fooBarSpec.js:79:34'
    ].join('\n');
    
    stdMocks.use();
    stdin.send(output); 
    stdMocks.restore();

    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Jasmine Test');
    expect(output.subtitle).toEqual('fooBarSpec.js[79:34]');
    expect(output.message).toEqual('Expected 1 to equal 42.');
    expect(output.icon).toEqual(path.join(__dirname, '../bin/images/jasmine.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toBeUndefined();
  });
  
});

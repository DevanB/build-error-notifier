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
    process.argv = [ 'node', '/full/path/to/build-error-notifier', '--addConfig', './spec/testConfig.js' ];
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

  it('can process output from browserify', function() {
    var output = 'Error: Parsing file /Users/user_name/sites/site-name/scripts/main.js: Unexpected token (23:6)';

    stdMocks.use();
    stdin.send(output);
    stdMocks.restore();

    expect(nodeNotifierMock.notify.called).toBe(true);
    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Browserify');
    expect(output.subtitle).toEqual('Unexpected token');
    expect(output.message).toEqual('main.js [23:6]');
    expect(output.icon).toEqual(path.join(__dirname, '../bin/images/browserify_watchify.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toBeUndefined();
  });
  
  it('can process output from node-sass', function() {
    var output = [
      '{',
      '    "status": 1,',
      '    "file": "/Users/user_name/sites/site-name/sass/main.scss",',
      '    "line": 27,',
      '    "column": 10,',
      '    "message": "Undefined variable: \\"$green\\".",',
      '    "formatted": "Error: Undefined variable: "$green". on line 27 of sass/main.scss >> color: $green; ---------^",',
      '}'].join('\n');

    stdMocks.use();
    stdin.send(output); 
    stdMocks.restore();

    expect(nodeNotifierMock.notify.called).toBe(true);
    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Sass Compiler');
    expect(output.subtitle).toEqual('main.scss [27:10]');
    expect(output.message).toEqual('Undefined variable: \\"$green\\".');
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

    expect(nodeNotifierMock.notify.called).toBe(true);
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

    expect(nodeNotifierMock.notify.called).toBe(true);
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

    expect(nodeNotifierMock.notify.called).toBe(true);
    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Jasmine Test');
    expect(output.subtitle).toEqual('fooBarSpec.js[79:34]');
    expect(output.message).toEqual('Expected 1 to equal 42');
    expect(output.icon).toEqual(path.join(__dirname, '../bin/images/jasmine.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toBeUndefined();
  });
  
  it('can process output from Karma', function() {
    var example1 = [
        'PhantomJS 1.9.7 (Mac OS X 0.0.0) foobar.controller specs is neat FAILED',
        '	AssertionError: expected \'not really neat\' to equal \'neat\'',
        '	    at /Users/spongebob/squarepants/bower_components/chai/chai.js:875',
        '	    at assertEqual (/Users/spongebob/squarepants/bower_components/chai/chai.js:1405)',
        '	    at /Users/spongebob/squarepants/bower_components/chai/chai.js:4075',
        '	    at /Users/spongebob/squarepants/target/foobar.controller.spec.js:37:0',
        'PhantomJS 1.9.7 (Mac OS X 0.0.0): Executed 2 of 372 (1 FAILED) (0 secs / 0.001 secs)'
    ].join('\n');
    
    stdMocks.use();
    stdin.send(example1); 
    stdMocks.restore();

    expect(nodeNotifierMock.notify.called).toBe(true);
    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Karma Test');
    expect(output.subtitle).toEqual('foobar.controller.spec.js[37:0]');
    expect(output.message).toEqual('expected \'not really neat\' to equal \'neat\'');
    expect(output.icon).toEqual(path.join(__dirname, '../bin/images/karma.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toBeUndefined();
   
    nodeNotifierMock.notify.reset();
   
    var example2 = [
        'PhantomJS 1.9.7 (Mac OS X 0.0.0) foobar.controller specs is neat FAILED',
        '	Error: oops',
        '	    at /Users/spongebob/squarepants/target/foobar.controller.spec.js:37:0',
        'PhantomJS 1.9.7 (Mac OS X 0.0.0): Executed 2 of 372 (1 FAILED) (0 secs / 0 secs)'
    ].join('\n');

    stdMocks.use();
    stdin.send(example2); 
    stdMocks.restore();

    expect(nodeNotifierMock.notify.called).toBe(true);
    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Karma Test');
    expect(output.subtitle).toEqual('foobar.controller.spec.js[37:0]');
    expect(output.message).toEqual('oops');
    expect(output.icon).toEqual(path.join(__dirname, '../bin/images/karma.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toBeUndefined();
  });
  
  it('loaded the additional config', function() {
    // this rule is gibberish, of course  
      
    var output = 'Houston, we\'ve got a garden gnome';

    stdMocks.use();
    stdin.send(output); 
    stdMocks.restore();

    var output = nodeNotifierMock.notify.args[0][0];
    expect(output.title).toEqual('Apollo 13');
    expect(output.subtitle).toEqual('.. aiming for the moon!');
    expect(output.message).toEqual('Now they got garden gnome! LOL!');
    expect(output.icon).toEqual(path.join(process.cwd(), './buildenv/images/apollo13.png'));
    expect(output.contentImage).toBeUndefined();
    expect(output.open).toBeUndefined();
    expect(output.wait).toBeUndefined();
    expect(output.sound).toEqual('Ping');
  });

});

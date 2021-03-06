'use strict';

var rest = require('../lib/index.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['rest'] = {
  setUp: function(done) {
    rest.config({
      model: 'test',
      path: __dirname
    });
    done();
  },
  'no args': function(test) {
    rest.get('/test/a', null, function(err, req, res, obj) {
      test.equal(obj.test, 1, 'should be 1.');
      test.done();
    });
  }
};
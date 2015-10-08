'use strict'

var test = require('tape')
var bloomrun = require('./')
var drain = require('nanite-drain')

test('null is returned if pattern is not found', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var pattern = { cmd: 'set-policy' }

  t.equal(instance.lookup(pattern), null)
})

test('pattern is returned on match', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var pattern = { cmd: 'set-policy' }

  instance.add(pattern)

  t.deepEqual(instance.lookup(pattern), pattern)
})

test('payload is returned instead of pattern if it exists', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var pattern = { prefs: 'userId' }
  var payload = '1234'

  instance.add(pattern, payload)

  t.deepEqual(instance.lookup(pattern), payload)
})

test('functions are supported as payloads', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var pattern = { prefs: 'userId' }
  var payload = function () { return '1234' }

  instance.add(pattern, payload)

  t.deepEqual(instance.lookup(pattern)(), payload())
})

test('partial matching is supported', function (t) {
  t.plan(2)

  var instance = bloomrun()
  var pattern = {
    cmd: 'add-user',
    username: 'mcollina'
  }

  instance.add(pattern)

  t.deepEqual(instance.lookup({ cmd: 'add-user' }), pattern)
  t.deepEqual(instance.lookup({ username: 'mcollina' }), pattern)
})

test('multiple matches is supported', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var firstPattern = {
    group: '123',
    userId: 'ABC'
  }
  var secondPattern = {
    group: '123',
    userId: 'ABC'
  }

  instance.add(firstPattern)
  instance.add(secondPattern)

  t.deepEqual(instance.list({ group: '123' }), [firstPattern, secondPattern])
})

test('iterator based retrieval is supported', function (t) {
  t.plan(3)

  var instance = bloomrun()
  var firstPattern = { hello: 'world', answer: '42' }
  var secondPattern = { hello: 'world', name: 'matteo' }

  instance.add(firstPattern)
  instance.add(secondPattern)

  var iterator = instance.iterator({ hello: 'world' })

  t.deepEqual(iterator.next(), firstPattern)
  t.deepEqual(iterator.next(), secondPattern)
  t.notOk(iterator.next())
})

test('removing patterns is supported', function (t) {
  t.plan(2)

  var instance = bloomrun()
  var pattern = { group: '123', userId: 'ABC' }

  instance.add(pattern)

  t.deepEqual(instance.lookup({ group: '123' }), pattern)

  instance.remove(pattern)

  t.equal(instance.lookup({ group: '123' }), null)
})

test('remove deletes all matches', function (t) {
  t.plan(2)

  var instance = bloomrun()
  var pattern = { group: '123', userId: 'ABC' }

  instance.add(pattern)
  instance.add(pattern, 'TEST')

  t.deepEqual(instance.list({ group: '123' }), [pattern, 'TEST'])

  instance.remove(pattern)

  t.equal(instance.lookup({ group: '123' }), null)
})

test('payload is considered when removing', function (t) {
  t.plan(2)

  var instance = bloomrun()
  var pattern = { group: '123', userId: 'ABC' }

  instance.add(pattern, 'XYZ')
  instance.add(pattern, '567')

  t.deepEqual(instance.list({ group: '123' }), ['XYZ', '567'])

  instance.remove(pattern, '567')

  t.equal(instance.lookup({ group: '123' }), 'XYZ')
})

test('complex payloads are matched correctly', function (t) {
  t.plan(2)

  var instance = bloomrun()
  var pattern = { group: '123', userId: 'ABC' }
  var payloadOne = drain(function (msg, done) { done() })
  var payloadTwo = drain(function (msg, done) { done() })

  instance.add(pattern, payloadOne)
  instance.add(pattern, payloadTwo)
  instance.add(pattern, '567')

  t.deepEqual(instance.list({ group: '123' }), [payloadOne, payloadTwo, '567'])

  instance.remove(pattern, payloadOne)
  instance.remove(pattern, payloadTwo)

  t.equal(instance.lookup({ group: '123' }), '567')
})

test('removing causes filters to be rebuilt', function (t) {
  t.plan(4)

  var instance = bloomrun()
  var firstPattern = { group: '123', userId: 'ABC' }
  var secondPattern = { group: '123', userId: 'DCF' }

  instance.add(firstPattern)
  instance.add(secondPattern)

  t.deepEqual(instance.lookup({ group: '123' }), firstPattern)
  t.deepEqual(instance.lookup({ userId: 'DCF' }), secondPattern)

  instance.remove(firstPattern)

  t.equal(instance.lookup({ group: '123' }), secondPattern)
  t.deepEqual(instance.lookup({ userId: 'DCF' }), secondPattern)
})

test('patterns can be listed while using payloads', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var pattern1 = { group: '123', userId: 'ABC' }
  var pattern2 = { group: '123', userId: 'DEF' }
  var payloadOne = drain(function (msg, done) { done() })
  var payloadTwo = drain(function (msg, done) { done() })

  instance.add(pattern1, payloadOne)
  instance.add(pattern2, payloadTwo)

  t.deepEqual(instance.list({ group: '123' }, { patterns: true }), [pattern1, pattern2])
})

test('patterns can be looked up while using payloads', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var pattern1 = { group: '123', userId: 'ABC' }
  var pattern2 = { group: '123', userId: 'DEF' }
  var payloadOne = drain(function (msg, done) { done() })
  var payloadTwo = drain(function (msg, done) { done() })

  instance.add(pattern1, payloadOne)
  instance.add(pattern2, payloadTwo)

  t.equal(instance.lookup({ group: '123' }, { patterns: true }), pattern1)
})

test('iterators can be used to fetch only patterns', function (t) {
  t.plan(3)

  var instance = bloomrun()
  var pattern1 = { group: '123', userId: 'ABC' }
  var pattern2 = { group: '123', userId: 'DEF' }
  var payloadOne = drain(function (msg, done) { done() })
  var payloadTwo = drain(function (msg, done) { done() })

  instance.add(pattern1, payloadOne)
  instance.add(pattern2, payloadTwo)

  var iterator = instance.iterator({ group: '123' }, { patterns: true })

  t.equal(iterator.next(), pattern1)
  t.equal(iterator.next(), pattern2)
  t.equal(iterator.next(), null)
})

test('listing all payloads', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var pattern1 = { group: '123', userId: 'ABC' }
  var pattern2 = { group: '123', userId: 'DEF' }
  var payloadOne = drain(function (msg, done) { done() })
  var payloadTwo = drain(function (msg, done) { done() })

  instance.add(pattern1, payloadOne)
  instance.add(pattern2, payloadTwo)

  t.deepEqual(instance.list(), [payloadOne, payloadTwo])
})

test('listing all patterns', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var pattern1 = { group: '123', userId: 'ABC' }
  var pattern2 = { group: '123', userId: 'DEF' }
  var payloadOne = drain(function (msg, done) { done() })
  var payloadTwo = drain(function (msg, done) { done() })

  instance.add(pattern1, payloadOne)
  instance.add(pattern2, payloadTwo)

  t.deepEqual(instance.list(null, { patterns: true }), [pattern1, pattern2])
})

'use strict'

var tape = require('tape')
var bloomrun = require('./')

tape('null is returned if pattern is not found', function (test) {
  test.plan(1)

  var instance = bloomrun()
  var pattern = { cmd: 'set-policy' }

  test.equal(instance.lookup(pattern), null)
})

tape('pattern is returned on match', function (test) {
  test.plan(1)

  var instance = bloomrun()
  var pattern = { cmd: 'set-policy' }

  instance.add(pattern)

  test.deepEqual(instance.lookup(pattern), pattern)
})

tape('payload is returned instead of pattern if it exists', function (test) {
  test.plan(1)

  var instance = bloomrun()
  var pattern = { prefs: 'userId' }
  var payload = '1234'

  instance.add(pattern, payload)

  test.deepEqual(instance.lookup(pattern), payload)
})

tape('functions are supported as payloads', function (test) {
  test.plan(1)

  var instance = bloomrun()
  var pattern = { prefs: 'userId' }
  var payload = function () { return '1234'}

  instance.add(pattern, payload)

  test.deepEqual(instance.lookup(pattern)(), payload())
})

tape('partial matching is supported', function (test) {
  test.plan(2)

  var instance = bloomrun()
  var pattern = {
    cmd: 'add-user',
    username: 'mcollina'
  }

  instance.add(pattern)

  test.deepEqual(instance.lookup({ cmd: 'add-user' }), pattern)
  test.deepEqual(instance.lookup({ username: 'mcollina' }), pattern)
})

tape('multiple matches is supported', function (test) {
  test.plan(1)

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

  test.deepEqual(instance.list({ group: '123' }), [firstPattern, secondPattern])
})

tape('iterator based retrieval is supported', function (test) {
  test.plan(3)

  var instance = bloomrun()
  var firstPattern = {
    hello: 'world',
    answer: '42'
  }
  var secondPattern = {
    hello: 'world',
    name: 'matteo'
  }

  instance.add(firstPattern)
  instance.add(secondPattern)

  var iterator = instance.iterator({
    hello: 'world'
  })

  test.deepEqual(iterator.next(), firstPattern, 'data matches')
  test.deepEqual(iterator.next(), secondPattern, 'data matches')
  test.notOk(iterator.next(), 'nothing more')
})

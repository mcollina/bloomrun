'use strict'

var test = require('tape')
var bloomrun = require('./')

test('lookup a value', function (t) {
  t.plan(3)

  var instance = bloomrun()
  var data = {
    hello: 'world',
    answer: '42'
  }

  instance.add(data)
  t.deepEqual(instance.lookup({
    hello: 'world'
  }), data, 'data matches')
  t.deepEqual(instance.lookup({
    answer: '42'
  }), data, 'data matches')
  t.notOk(instance.lookup({ something: 'else' }), 'nothing to lookup')
})

test('list all matches', function (t) {
  t.plan(1)

  var instance = bloomrun()
  var data1 = {
    hello: 'world',
    answer: '42'
  }
  var data2 = {
    hello: 'world',
    name: 'matteo'
  }

  instance.add(data1)
  instance.add(data2)

  t.deepEqual(instance.list({
    hello: 'world'
  }), [data1, data2], 'data matches')
})

test('iterator', function (t) {
  t.plan(3)

  var instance = bloomrun()
  var data1 = {
    hello: 'world',
    answer: '42'
  }
  var data2 = {
    hello: 'world',
    name: 'matteo'
  }

  instance.add(data1)
  instance.add(data2)

  var iterator = instance.iterator({
    hello: 'world'
  })

  t.deepEqual(iterator.next(), data1, 'data matches')
  t.deepEqual(iterator.next(), data2, 'data matches')
  t.notOk(iterator.next(), 'nothing more')
})

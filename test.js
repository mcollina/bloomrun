'use strict'

var test = require('tape')
var bloomrun = require('./')

test('lookup a value', function (t) {
  t.plan(3)

  var instance = bloomrun()
  var data  = {
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

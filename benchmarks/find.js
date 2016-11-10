'use strict'

var bench = require('fastbench')
var bloomrun = require('../')
var patrun = require('patrun')

var threeEntries = (function () {
  var instance = bloomrun({ indexing: 'depth' })

  instance.add({
    hello: 'world',
    answer: 42
  })

  instance.add({
    hello: 'matteo',
    answer: 42
  })

  instance.add({
    something: 'else',
    answer: 42
  })

  return threeEntries

  function threeEntries (done) {
    var result = instance.lookup({
      something: 'else',
      answer: 42
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

function buildFiveHundredEntries (instance) {
  var obj

  // this creates 100 buckets with 5 items each
  for (var i = 0; i < 100; i++) {
    for (var k = 0; k < 4; k++) {
      obj = {
        bigCounter: '' + i
      }
      obj['small' + k] = i
      instance.add(obj, obj)
    }
  }

  return instance
}

var fiveHundredEntries = (function () {
  var instance = bloomrun({ indexing: 'depth' })

  buildFiveHundredEntries(instance)

  return fiveHundredEntries

  function fiveHundredEntries (done) {
    var result = instance.lookup({
      bigCounter: '99',
      small3: 99
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

var fiveHundredEntriesAndProperties = (function () {
  var instance = bloomrun({ indexing: 'depth' })
  buildFiveHundredEntries(instance)

  return fiveHundredEntriesAndProperties

  function fiveHundredEntriesAndProperties (done) {
    var result = instance.lookup({
      bigCounter: '99',
      small3: 99,
      something: 'else'
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

var patrunFiveHundredEntriesAndProperties = (function () {
  var instance = patrun({ gex: true })
  buildFiveHundredEntries(instance)

  return patrunFiveHundredEntriesAndProperties

  function patrunFiveHundredEntriesAndProperties (done) {
    var result = instance.find({
      bigCounter: '99',
      small3: 99,
      something: 'else'
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

var patrunThreeEntries = (function () {
  var instance = patrun({ gex: true })

  instance.add({
    hello: 'world',
    answer: 42
  }, 'hello')

  instance.add({
    hello: 'matteo',
    answer: 42
  }, 'hello')

  instance.add({
    something: 'else',
    answer: 42
  }, 'hello')

  return patrunThreeEntries

  function patrunThreeEntries (done) {
    var result = instance.find({
      something: 'else',
      answer: 42
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

var run = bench([
  threeEntries,
  fiveHundredEntries,
  fiveHundredEntriesAndProperties,
  patrunThreeEntries,
  patrunFiveHundredEntriesAndProperties
], 1000000)

run(run)

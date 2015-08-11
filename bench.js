'use strict'

var bench = require('fastbench')
var bloomrun = require('./')

var threeEntries = (function () {
  var instance = bloomrun()

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
      something: 'else'
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

function buildFiveHundredEntries () {
  var instance = bloomrun()
  var obj

  // this creates 100 buckets with 5 items each
  for (var i = 0; i < 100; i++) {
    for (var k = 0; k < 5; k++) {
      obj = {
        bigCounter: ''+i,
      }
      obj['small' + k] = i
      instance.add(obj)
    }
  }

  return instance
}

var fiveHundredEntries = (function () {

  var instance = buildFiveHundredEntries()

  return fiveHundredEntries

  function fiveHundredEntries (done) {
    var result = instance.lookup({
      bigCounter: '99'
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

var fiveHundredEntriesAndProperties = (function () {

  var instance = buildFiveHundredEntries()

  return fiveHundredEntriesAndProperties

  function fiveHundredEntriesAndProperties (done) {
    var result = instance.lookup({
      bigCounter: '99',
      something: 'else'
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

var fiveHundredEntriesAndKnownProperties = (function () {

  var instance = buildFiveHundredEntries()

  return fiveHundredEntriesAndKnownProperties

  function fiveHundredEntriesAndKnownProperties (done) {
    var result = instance.lookup({
      bigCounter: '99',
      small4: '99'
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
  fiveHundredEntriesAndKnownProperties
], 100000)

run(run)

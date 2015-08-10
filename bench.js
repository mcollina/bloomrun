'use strict'

var bench = require('fastbench')
var bloomrun = require('./')

var singleLookup = (function () {
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

  return singleLookup

  function singleLookup (done) {
    var result = instance.lookup({
      something: 'else'
    })
    if (!result) {
      throw new Error('muahah')
    }
    process.nextTick(done)
  }
})()

var run = bench([
  singleLookup
], 100000)

run(run)

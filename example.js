'use strict'

var bloomrun = require('./')
var run = bloomrun()

run.add({ 'hello': 'world' }, function () {
  console.log('Hello World!')
})

run.lookup({'hello': 'world'})()

'use strict'

var bloomrun = require('./')
var run = bloomrun()

run.add({ 'hello': 'world' })
console.log(run.lookup({ 'hello': 'world', 'answer': 42 }))

'use strict'

var counter = 1

function PatternSet (pattern, payload, isDeep) {
  this.pattern = pattern
  this.payload = payload || pattern
  this.weight = 0

  if (isDeep) {
    this.weight = Object.keys(pattern).length
  } else {
    this.weight = counter++
  }
}

module.exports = PatternSet

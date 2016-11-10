'use strict'

var counter = 1

function PatternSet (pattern, payload, isDeep) {
  this.pattern = pattern
  this.payload = payload || pattern
  this.magic = 0

  if (isDeep) {
    this.magic = Object.keys(pattern).length
  } else {
    this.magic = counter++
  }
}

module.exports = PatternSet

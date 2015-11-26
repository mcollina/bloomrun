'use strict'

function PatternSet (pattern, payload, isDeep) {
  this.pattern = pattern
  this.payload = payload || pattern
  this.magic = 0

  if (isDeep) {
    this.magic = calcMagic(pattern)
  }
}

function calcMagic (pattern) {
  var keys = Object.keys(pattern)
  var length = keys.length
  var result = 0
  var key

  for (var i = 0; i < length; i++) {
    key = keys[i]
    if (typeof pattern[key] === 'object') {
      result += calcMagic(pattern[key])
    } else {
      result++
    }
  }

  return result
}

module.exports = PatternSet

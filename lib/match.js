'use strict'

var safeEqual = require('./safeEqual')

function equal (a, b) {
  if (typeof a !== 'object') {
    return safeEqual(a, b)
  } else if (a instanceof RegExp) {
    if (b instanceof RegExp) {
      return a.source === b.source
    }
    return a.test(b)
  }
  return false
}

function match (a, b) {
  var result = true
  for (var key in a) {
    if (b[key] === undefined || !equal(a[key], b[key])) {
      result = false
      break
    }
  }

  return result
}

module.exports = match

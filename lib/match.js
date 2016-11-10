'use strict'

var safeEqual = require('./safeEqual')

function equal (a, b) {
  var result = false
  if (typeof a !== 'object') {
    result = safeEqual(a, b)
  } else if (a instanceof RegExp) {
    result = a.test(b)
  }

  return result
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

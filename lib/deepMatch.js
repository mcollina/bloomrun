'use strict'

var safeEqual = require('./safeEqual')

function deepPartialMatch (a, b) {
  if (safeEqual(a, b)) {
    return true
  } else if (a instanceof RegExp) {
    return a.test(b)
  } else if (b instanceof RegExp) {
    return b.test(a)
  } else if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  // faster than Object.keys()
  for (var key in a) {
    if (!b[key] || !deepPartialMatch(a[key], b[key])) {
      return false
    }
  }

  return true
}

module.exports = deepPartialMatch

'use strict'

var safeEqual = require('./safeEqual')

function deepPartialMatch (a, b) {
  if (a instanceof RegExp) {
    return a.test(b)
  } else if (b instanceof RegExp) {
    return b.test(a)
  } else if (typeof a !== 'object') {
    return safeEqual(a, b)
  }

  // faster than Object.keys()
  for (var key in a) {
    if (b[key] === undefined || !deepPartialMatch(a[key], b[key])) {
      return false
    }
  }

  return true
}

module.exports = deepPartialMatch

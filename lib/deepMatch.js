'use strict'

function deepPartialMatch (a, b) {
  var keys

  if (a === b) {
    return true
  } else if (a instanceof RegExp) {
    return a.test(b)
  } else if (b instanceof RegExp) {
    return b.test(a)
  } else if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  keys = Object.keys(a)

  for (var i = 0; i < keys.length; i++) {
    if (!b[keys[i]] || !deepPartialMatch(a[keys[i]], b[keys[i]])) {
      return false
    }
  }

  return true
}

module.exports = deepPartialMatch

'use strict'

function deepPartialMatch (a, b) {
  var keys

  if (a === b) {
    return true
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

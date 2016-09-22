'use strict'

function onlyRegex (pattern) {
  var match = true

  for (var key in pattern) {
    if (pattern[key] instanceof RegExp) {
      match = true
    } else if (typeof pattern[key] !== 'object') {
      match = false
      break
    }
  }

  return match
}

module.exports = onlyRegex

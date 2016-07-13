'use strict'

function onlyRegex (pattern) {
  var match = false

  for (var key in pattern) {
    if (pattern[key] instanceof RegExp) {
      match = true
    } else if (match) {
      match = false
      break
    }
  }

  return match
}

module.exports = onlyRegex

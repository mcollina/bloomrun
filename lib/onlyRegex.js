'use strict'

function onlyRegex (pattern) {
  var match = false

  for (var i = 0; i < Object.keys(pattern).length; i++) {
    if (pattern[Object.keys(pattern)[i]] instanceof RegExp) {
      match = true
    } else if (match) {
      match = false
      break
    }
  }

  return match
}

module.exports = onlyRegex

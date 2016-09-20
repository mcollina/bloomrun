'use strict'

function genKeys (obj) {
  var result = []

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] !== 'object') {
        result.push(key + ':' + obj[key])
      }
    }
  }

  return result
}

module.exports = genKeys

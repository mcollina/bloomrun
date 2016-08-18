'use strict'

function genKeys (obj, set) {
  var result = []

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if ((!set || set.has(key)) && typeof obj[key] !== 'object') {
        result.push(key + ':' + obj[key])
      }
    }
  }

  return result
}

module.exports = genKeys

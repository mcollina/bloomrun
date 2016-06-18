'use strict'

var genKeys = require('./genKeys.js')

function matchingBuckets (buckets, pattern) {
  var keys = genKeys(pattern)
  var acc = []

  for (var b = 0; b < buckets.length; b++) {
    for (var i = 0; i < keys.length; i++) {
      if (buckets[b].filter.test(keys[i])) {
        acc.push(buckets[b])
        break
      }
    }
  }

  return acc
}

module.exports = matchingBuckets

'use strict'

var genKeys = require('./genKeys.js')

function matchingBuckets (buckets, pattern, set) {
  var keys = genKeys(pattern, set)
  var acc = []

  for (var b = 0; b < buckets.length; b++) {
    for (var i = 0; i < keys.length; i++) {
      if (buckets[b].filter.test(keys[i])) {
        acc.push(buckets[b])
        break
      } else if (set) {
        // if there are known properties, we can be 100% sure
        // that if a bloom filter returns false, then we don't need
        // to test the other keys
        break
      }
    }
  }

  return acc
}

module.exports = matchingBuckets

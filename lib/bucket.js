'use strict'

var BloomFilter = require('bloomfilter').BloomFilter

function Bucket () {
  this.filter = new BloomFilter(
    32 * 256, // number of bits to allocate.
    16        // number of hash functions.
  )
  this.data = []
}

module.exports = Bucket

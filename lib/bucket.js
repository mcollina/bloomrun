'use strict'

var BloomFilter = require('bloomfilter').BloomFilter
var deepSort = require('./deepSort')
var genKeys = require('./genKeys')
var deepMatch = require('./deepMatch')

function Bucket (isDeep) {
  this.filter = new BloomFilter(
    32 * 256, // number of bits to allocate.
    16        // number of hash functions.
  )
  this.data = []
  this.isDeep = isDeep
}

Bucket.prototype.add = function (set) {
  genKeys(set.pattern).forEach(addPatterns, this)
  this.data.push(set)
  if (this.isDeep) {
    this.data.sort(deepSort)
  }
  return this
}

function addPatterns (toAdd) {
  this.filter.add(toAdd)
}

Bucket.prototype.remove = function (pattern, payload) {
  var foundPattern = false
  var data = this.data

  for (var i = 0; i < data.length; i++) {
    if (deepMatch(pattern, data[i].pattern)) {
      if (payload === null || payload === data[i].payload) {
        data.splice(i, 1)
        foundPattern = true

        // to remove all occurences
        this.remove(pattern, payload)
        break
      }
    }
  }

  return foundPattern
}

Bucket.prototype.forEach = function (func, that) {
  this.data.forEach(func, that)
  return this
}

module.exports = Bucket

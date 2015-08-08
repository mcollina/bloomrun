'use strict'

var BloomFilter = require('bloomfilter').BloomFilter

function BloomRun (opts) {
  if (!(this instanceof BloomRun)) {
    return new BloomRun(opts)
  }

  // magic number of buckets
  var numBuckets = opts && opts.buckets ? opts.buckets : 42

  this._buckets = new Array(numBuckets)
  this._nextBucket = 0

  for (var i = 0; i < numBuckets; i++) {
    this._buckets[i] = new Bucket()
  }
}

function genKeys (obj) {
  return Object.keys(obj).filter(noObjects, obj).map(keyIterator, obj)
}

function keyIterator (key) {
  return key + ':' + this[key]
}

function noObjects (key) {
  return typeof this[key] !== 'object'
}

BloomRun.prototype.add = function (obj) {
  genKeys(obj).forEach(function (toAdd) {
    this._buckets[this._nextBucket].filter.add(toAdd)
  }, this)


  this._buckets[this._nextBucket].data.push(obj)

  this._nextBucket++
  if (this._nextBucket === this._buckets.length) {
    this._nextBucket = 0
  }
}

function deepPartialMatch (a, b) {
  var keys;

  if (a === b) {
    return true
  } else if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  keys = Object.keys(a)

  for (var i = 0; i < keys.length; i++) {
    if (!deepPartialMatch(a[i], b[i])) {
      return false
    }
  }

  return true
}

BloomRun.prototype.lookup = function (obj) {
  var keys = genKeys(obj)

  var buckets = this._buckets.reduce(function (acc, bucket) {
    for (var i = 0; i < keys.length; i++) {
      if (bucket.filter.test(keys[i])) {
        acc.push(bucket)
        break
      }
    }
    return acc
  }, [])

  for (var i = 0; i < buckets.length; i++) {
    for (var k = 0; k < buckets[i].data.length; k++) {
      if (deepPartialMatch(buckets[i].data[k], obj)) {
        return buckets[i].data[k]
      }
    }
  }

  return null
}

function Bucket () {
  this.filter = new BloomFilter(
    32 * 256, // number of bits to allocate.
    16        // number of hash functions.
  )
  this.data = []
}

module.exports = BloomRun

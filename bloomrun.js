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
  var iterator = new Iterator(this, obj)
  return iterator.next()
}

BloomRun.prototype.list = function (obj) {

  var iterator = new Iterator(this, obj)
  var list = []
  var current = null

  while (current = iterator.next()) {
    list.push(current)
  }

  return list
}

BloomRun.prototype.iterator = Iterator

function Bucket () {
  this.filter = new BloomFilter(
    32 * 256, // number of bits to allocate.
    16        // number of hash functions.
  )
  this.data = []
}

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

function Iterator (parent, obj) {
  if (!(this instanceof Iterator)) {
    return new Iterator(this, parent)
  }

  this.parent = parent
  this.pattern = obj

  this.buckets = matchingBuckets(parent._buckets, obj)

  this.i = 0
  this.k = 0
}

Iterator.prototype.next = function () {
  var match = null

  if (this.i === this.buckets.length) {
    return null
  }

  var current = this.buckets[this.i].data[this.k]

  if (deepPartialMatch(current, this.pattern)) {
    match = current
  }

  if (++this.k === this.buckets[this.i].data.length) {
    ++this.i
    this.k = 0
  }

  if (match) {
    return match
  } else {
    return this.next()
  }
}

module.exports = BloomRun

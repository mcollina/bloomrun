'use strict'

var Bucket = require('./lib/bucket')
var Iterator = require('./lib/iterator')
var genKeys = require('./lib/genKeys.js')

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

module.exports = BloomRun

'use strict'

var Bucket = require('./lib/bucket')
var Iterator = require('./lib/iterator')
var PatternSet = require('./lib/patternSet')
var matchingBuckets = require('./lib/matchingBuckets')
var onlyRegex = require('./lib/onlyRegex')

function BloomRun (opts) {
  if (!(this instanceof BloomRun)) {
    return new BloomRun(opts)
  }

  this._isDeep = opts && opts.indexing === 'depth'
  this._buckets = []
  this._regexBucket = new Bucket(this._isDeep)
  this._defaultResult = null
}

BloomRun.prototype.default = function (payload) {
  this._defaultResult = payload
}

BloomRun.prototype.add = function (pattern, payload) {
  if (onlyRegex(pattern)) {
    this._regexBucket.add(new PatternSet(pattern, payload, this._isDeep))
    return this
  }

  var buckets = matchingBuckets(this._buckets, pattern)
  var bucket

  if (buckets.length > 0) {
    bucket = buckets[0]
  } else {
    bucket = new Bucket(this._isDeep)
    this._buckets.push(bucket)
  }

  var patternSet = new PatternSet(pattern, payload, this._isDeep)
  bucket.add(patternSet)

  return this
}

function addPatternSet (patternSet) {
  this.add(patternSet.pattern, patternSet.payload)
}

function removeBucket (buckets, bucket) {
  for (var i = 0; i < buckets.length; i++) {
    if (bucket === buckets[i]) {
      buckets.splice(i, 1)
    }
  }
}

BloomRun.prototype.remove = function (pattern, payload) {
  var matches = matchingBuckets(this._buckets, pattern)
  payload = payload || null

  if (matches.length > 0) {
    for (var i = 0; i < matches.length; i++) {
      var bucket = matches[i]

      if (bucket.remove(pattern, payload)) {
        removeBucket(this._buckets, bucket)
        bucket.forEach(addPatternSet, this)
      }
    }
  }

  return this
}

BloomRun.prototype.lookup = function (pattern, opts) {
  var iterator = new Iterator(this, pattern, opts)
  return iterator.next() || this._defaultResult || null
}

BloomRun.prototype.list = function (pattern, opts) {
  var iterator = new Iterator(this, pattern, opts)
  var list = []
  var current = null

  while ((current = iterator.next()) !== null) {
    list.push(current)
  }

  return list
}

BloomRun.prototype.iterator = Iterator

module.exports = BloomRun

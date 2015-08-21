'use strict'

var Bucket = require('./lib/bucket')
var Iterator = require('./lib/iterator')
var PatternSet = require('./lib/patternSet')
var genKeys = require('./lib/genKeys.js')
var matchingBuckets = require('./lib/matchingBuckets.js')
var Set = require('es6-set')

function BloomRun (opts) {
  if (!(this instanceof BloomRun)) {
    return new BloomRun(opts)
  }

  this._buckets = []
  this._properties = new Set()
}

function addPatterns (toAdd) {
  this.filter.add(toAdd)
}

BloomRun.prototype.add = function (pattern, payload) {
  var buckets = matchingBuckets(this._buckets, pattern)
  var bucket
  var properties = this._properties

  if (buckets.length > 0) {
    bucket = buckets[0]
  } else {
    bucket = new Bucket()
    this._buckets.push(bucket)
  }

  genKeys(pattern).forEach(addPatterns, bucket)
  Object.keys(pattern).forEach(function (key) {
    properties.add(key)
  })

  var patternSet = new PatternSet(pattern, payload)
  bucket.data.push(patternSet)

  return this
}

BloomRun.prototype.lookup = function (pattern) {
  var iterator = new Iterator(this, pattern)
  return iterator.next()
}

BloomRun.prototype.list = function (pattern) {
  var iterator = new Iterator(this, pattern)
  var list = []
  var current = null

  while ((current = iterator.next()) !== null) {
    list.push(current)
  }

  return list
}

BloomRun.prototype.iterator = Iterator

module.exports = BloomRun

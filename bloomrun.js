'use strict'

var Bucket = require('./lib/bucket')
var Iterator = require('./lib/iterator')
var genKeys = require('./lib/genKeys.js')
var matchingBuckets = require('./lib/matchingBuckets.js')

function BloomRun (opts) {
  if (!(this instanceof BloomRun)) {
    return new BloomRun(opts)
  }

  this._buckets = []
}

function addKeys (toAdd) {
  this.filter.add(toAdd)
}

BloomRun.prototype.add = function (obj) {
  var buckets = matchingBuckets(this._buckets, obj)
  var bucket

  if (buckets.length > 0) {
    bucket = buckets[0]
  } else {
    bucket = new Bucket()
    this._buckets.push(bucket)
  }

  genKeys(obj).forEach(addKeys, bucket)
  bucket.data.push(obj)

  return this
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

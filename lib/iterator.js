'use strict'

var deepMatch = require('./deepMatch')
var onlyRegex = require('./onlyRegex')
var genKeys = require('./genKeys.js')

function Iterator (parent, obj, opts) {
  if (!(this instanceof Iterator)) {
    return new Iterator(this, parent, obj)
  }

  this.parent = parent
  this.pattern = obj
  this.onlyPatterns = opts && opts.patterns && !opts.payloads
  this.patternsAndPayloads = opts && opts.patterns && opts.payloads
  this.onlyPayloads = (opts && !opts.patterns && opts.payloads) || !opts
  this.keys = genKeys(obj)

  if (obj) {
    if (onlyRegex(obj)) {
      this.buckets = parent._buckets
    }
  } else {
    this.buckets = parent._buckets
  }

  this.i = 0
  this.k = 0

  this.bucket = null
  this.regexpBucket = this.parent._regexBucket.data.length > 0 && this.parent._regexBucket
}

Iterator.prototype.nextBucket = function () {
  if (this.bucket) {
    return this.bucket
  }

  if (this.buckets) {
    this.bucket = this.buckets[this.i++]

    if (this.bucket) {
      return this.bucket
    }
  } else {
    var allBuckets = this.parent._buckets
    var keys = this.keys
    var i = this.i

    for (; i < allBuckets.length; i++) {
      for (var j = 0; j < keys.length; j++) {
        if (allBuckets[i].filter.test(keys[j])) {
          this.bucket = allBuckets[i]
          this.i = ++i
          return this.bucket
        }
      }
    }

    this.i = i
  }

  if (this.regexpBucket) {
    this.bucket = this.regexpBucket
    this.regexpBucket = null
    return this.bucket
  }
}

Iterator.prototype.next = function () {
  var match = null

  var bucket = this.bucket || this.nextBucket()

  if (!bucket) {
    return null
  }

  var current = bucket.data[this.k]

  if (!this.pattern || deepMatch(current.pattern, this.pattern)) {
    if (this.onlyPayloads) {
      match = current.payload
    } else if (this.onlyPatterns) {
      match = current.pattern
    } else if (this.patternsAndPayloads) {
      match = {
        pattern: current.pattern,
        payload: current.payload
      }
    }
  }

  if (++this.k === bucket.data.length) {
    this.bucket = null
    this.k = 0
  }

  if (match) {
    return match
  } else {
    return this.next()
  }
}

module.exports = Iterator

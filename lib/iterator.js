'use strict'

var matchingBuckets = require('./matchingBuckets')
var deepMatch = require('./deepMatch')
var onlyRegex = require('./onlyRegex')

function Iterator (parent, obj, opts) {
  if (!(this instanceof Iterator)) {
    return new Iterator(this, parent, obj)
  }

  this.parent = parent
  this.pattern = obj
  this.onlyPatterns = opts && opts.patterns

  if (obj) {
    if (onlyRegex(obj)) {
      this.buckets = parent._buckets
    } else {
      this.buckets = matchingBuckets(parent._buckets, obj, parent._properties, parent._isDeep)
    }
  } else {
    this.buckets = parent._buckets
  }

  if (this.parent._regexBucket.data.length > 0) {
    this.buckets.push(this.parent._regexBucket)
  }

  this.i = 0
  this.k = 0
}

Iterator.prototype.next = function () {
  var match = null

  if (this.i === this.buckets.length) {
    return null
  }

  var current = this.buckets[this.i].data[this.k]

  if (!this.pattern || deepMatch(current.pattern, this.pattern)) {
    if (this.onlyPatterns) {
      match = current.pattern
    } else {
      match = current.payload
    }
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

module.exports = Iterator

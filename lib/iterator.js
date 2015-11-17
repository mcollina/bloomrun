'use strict'

var matchingBuckets = require('./matchingBuckets')
var deepMatch = require('./deepMatch')

function Iterator (parent, obj, opts) {
  if (!(this instanceof Iterator)) {
    // this is parent
    return new Iterator(this, parent, obj)
  }

  this.parent = parent
  this.pattern = obj
  this.onlyPatterns = opts && opts.patterns

  if (obj) {
    this.buckets = matchingBuckets(parent._buckets, obj, parent._properties)
  } else {
    this.buckets = parent._buckets
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

'use strict'

var matchingBuckets = require('./matchingBuckets')

function deepPartialMatch (a, b) {
  var keys

  if (a === b) {
    return true
  } else if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  keys = Object.keys(a)

  for (var i = 0; i < keys.length; i++) {
    if (a[keys[i]] && b[keys[i]] && !deepPartialMatch(a[keys[i]], b[keys[i]])) {
      return false
    }
  }

  return true
}

function Iterator (parent, obj) {
  if (!(this instanceof Iterator)) {
    return new Iterator(this, parent)
  }

  this.parent = parent
  this.pattern = obj

  this.buckets = matchingBuckets(parent._buckets, obj, parent._properties)

  this.i = 0
  this.k = 0
}

Iterator.prototype.next = function () {
  var match = null

  if (this.i === this.buckets.length) {
    return null
  }

  var current = this.buckets[this.i].data[this.k]

  if (deepPartialMatch(current.pattern, this.pattern)) {
    match = current.payload
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

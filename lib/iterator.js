'use strict'

var genKeys = require('./genKeys.js')

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
}module.exports = Iterator
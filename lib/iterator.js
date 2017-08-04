'use strict'

var sorted = require('sorted-array-functions')
var match = require('./match')

function Iterator (parent, obj, asMatch) {
  this.parent = parent
  this.pattern = obj
  this._asMatch = asMatch
  this.buckets = []
  this.visited = this.bucket = null
  if (obj) {
    loop(obj, parent._tree, this.buckets, parent._algo)
  } else {
    this.buckets = parent._buckets
  }
  var r = parent._regexBucket
  this.i = this.k = 0
  this.regexpBucket = r.data.length > 0 && r
}

function loop (obj, tree, keys, algo) {
  var weight = 0
  var branch

  for (var key in obj) {
    branch = tree[key]
    if (branch && branch[obj[key]]) {
      weight = branch[obj[key]]
      sorted.add(keys, weight, algo)
    }
  }
}

Iterator.prototype.nextBucket = function () {
  var bucket = this.bucket
  var regexpBucket = this.regexpBucket

  if (!bucket) {
    bucket = this.buckets[this.i++]

    if (!bucket && regexpBucket) {
      bucket = regexpBucket
      this.regexpBucket = null
    }

    this.bucket = bucket
  }

  return bucket
}

Iterator.prototype.one = function () {
  var result = null
  var bucket = null
  var pattern = this.pattern
  var asMatch = this._asMatch

  while (result === null && (bucket = this.nextBucket())) {
    var current = bucket.data[this.k]

    if (!pattern || match(current.pattern, pattern)) {
      result = asMatch ? asMatch(current) : current.payload
    }

    if (++this.k === bucket.data.length) {
      this.bucket = null
      this.k = 0
    }
  }

  return result
}

Iterator.prototype.next = function () {
  var result = null
  var bucket = null
  var current = null
  var pattern = this.pattern
  var asMatch = this._asMatch

  if (!this.visited) {
    this.visited = new Set()
  }

  var visited = this.visited

  while (result === null) {
    bucket = this.nextBucket()

    if (!bucket) {
      return null
    }

    current = bucket.data[this.k]

    if (!visited.has(current) && (!pattern || match(current.pattern, pattern))) {
      visited.add(current)
      result = asMatch ? asMatch(current) : current.payload
    }

    if (++this.k === bucket.data.length) {
      this.bucket = null
      this.k = 0
    }
  }

  return result
}

module.exports = Iterator

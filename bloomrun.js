'use strict'

var deepSort = require('./lib/deepSort')
var insertionSort = require('./lib/insertionSort')
var Bucket = require('./lib/bucket')
var Iterator = require('./lib/iterator')
var PatternSet = require('./lib/patternSet')
var onlyRegex = require('./lib/onlyRegex')

function Bloomrun (opts) {
  if (!(this instanceof Bloomrun)) {
    return new Bloomrun(opts)
  }

  this._isDeep = opts && opts.indexing === 'depth'
  this._buckets = []
  this._regexBucket = new Bucket(this)
  this._defaultResult = null
  this._tree = {}
  this._algo = this._isDeep ? deepSort : insertionSort
}

Bloomrun.prototype.default = function (payload) {
  this._defaultResult = payload
}

Bloomrun.prototype.add = function (pattern, payload) {
  if (onlyRegex(pattern)) {
    this._regexBucket.add(new PatternSet(pattern, payload, this._isDeep))
    return this
  }

  var patternSet = new PatternSet(pattern, payload, this._isDeep)
  var bucket

  for (var key in pattern) {
    if (pattern.hasOwnProperty(key)) {
      if (typeof pattern[key] !== 'object') {
        if (!this._tree[key]) {
          this._tree[key] = {}
        }
        bucket = this._tree[key][pattern[key]]

        if (!bucket) {
          bucket = new Bucket(this)
          this._buckets.push(bucket)
          this._tree[key][pattern[key]] = bucket
        }

        bucket.add(patternSet)
      }
    }
  }

  return this
}

function addPatternSet (patternSet) {
  this.add(patternSet.pattern, patternSet.payload)
}

function removeBucket (buckets, bucket) {
  for (var i = 0; i < buckets.length; i++) {
    if (bucket === buckets[i]) {
      buckets.splice(i, 1)
      break
    }
  }
}

Bloomrun.prototype.remove = function (pattern, payload) {
  var bucket = null
  payload = payload || null

  if (onlyRegex(pattern)) {
    this._regexBucket.remove(pattern, payload)
    return this
  }

  for (var key in pattern) {
    if (pattern.hasOwnProperty(key)) {
      if (typeof pattern[key] !== 'object') {
        if (this._tree[key] && this._tree[key][pattern[key]]) {
          bucket = this._tree[key][pattern[key]]

          if (bucket.remove(pattern, payload)) {
            removeBucket(this._buckets, bucket)
            delete this._tree[key][pattern[key]]
            bucket.forEach(addPatternSet, this)
          }
        }
      }
    }
  }

  return this
}

function onlyPatterns (current) {
  return current.pattern
}

function patternsAndPayloads (current) {
  return {
    pattern: current.pattern,
    payload: current.payload
  }
}

Bloomrun.prototype.lookup = function (pattern, opts) {
  var asMatch = null
  if (opts && opts.patterns) {
    asMatch = opts.payloads ? patternsAndPayloads : onlyPatterns
  }

  var iterator = new Iterator(this, pattern, asMatch)
  return iterator.one() || this._defaultResult || null
}

Bloomrun.prototype.list = function (pattern, opts) {
  var asMatch = null
  if (opts && opts.patterns) {
    asMatch = opts.payloads ? patternsAndPayloads : onlyPatterns
  }
  var iterator = new Iterator(this, pattern, asMatch)
  var list = []
  var current = null

  while ((current = iterator.next()) !== null) {
    list.push(current)
  }

  if (!pattern && this._defaultResult) {
    if (opts && opts.patterns && opts.payloads) {
      list.push({
        default: true,
        payload: this._defaultResult
      })
    } else if (!opts || !opts.patterns) {
      list.push(this._defaultResult)
    }
  }

  return list
}

Bloomrun.prototype.iterator = function (obj, opts) {
  var asMatch = null
  if (opts && opts.patterns) {
    asMatch = opts.payloads ? patternsAndPayloads : onlyPatterns
  }
  return new Iterator(this, obj, asMatch)
}

module.exports = Bloomrun

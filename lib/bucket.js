'use strict'

var sorted = require('sorted-array-functions')
var match = require('./match')
var onlyRegex = require('./onlyRegex')
var reverseSort = require('./reverseSort')

function Bucket (parent) {
  this.data = []
  this._algo = parent._algo
  this._isDeep = parent._isDeep
  this.weight = this._isDeep ? 0 : Number.MAX_SAFE_INTEGER
}

Bucket.prototype.add = function (set) {
  sorted.add(this.data, set, this.weight !== set.weight ? this._algo : reverseSort)

  if (this._isDeep) {
    if (this.weight < set.weight) {
      this.weight = set.weight
    }
  } else {
    if (this.weight > set.weight) {
      this.weight = set.weight
    }
  }
  return this
}

Bucket.prototype.remove = function (pattern, payload) {
  var foundPattern = false
  var data = this.data
  var justRegex = onlyRegex(pattern)
  for (var i = 0; i < data.length; i++) {
    if (match(pattern, data[i].pattern)) {
      if (payload === null || payload === data[i].payload || justRegex) {
        data.splice(i, 1)
        foundPattern = true

        // to remove all occurences
        this.remove(pattern, payload)
        break
      }
    }
  }

  return foundPattern
}

Bucket.prototype.forEach = function (func, that) {
  this.data.forEach(func, that)
  return this
}

module.exports = Bucket

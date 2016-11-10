'use strict'

var sorted = require('sorted-array-functions')
var match = require('./match')

function Bucket (parent) {
  this.data = []
  this._algo = parent._algo
  this._isDeep = parent._isDeep
  this.magic = this._isDeep ? 0 : Number.MAX_SAFE_INTEGER
}

Bucket.prototype.add = function (set) {
  sorted.add(this.data, set, this._algo)
  if (this._isDeep) {
    if (this.magic < set.magic) {
      this.magic = set.magic
    }
  } else {
    if (this.magic > set.magic) {
      this.magic = set.magic
    }
  }
  return this
}

Bucket.prototype.remove = function (pattern, payload) {
  var foundPattern = false
  var data = this.data
  for (var i = 0; i < data.length; i++) {
    if (match(pattern, data[i].pattern)) {
      if (payload === null || payload === data[i].payload) {
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

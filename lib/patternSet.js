'use strict'

function PatternSet (pattern, payload) {
  this.pattern = pattern
  this.payload = payload || pattern
}

module.exports = PatternSet

'use strict'

function genKeys (obj, set) {
  return Object.keys(obj)
    .filter(notInSet, set)
    .filter(noObjects, obj)
    .map(keyIterator, obj)
}

function notInSet (key) {
  return !this || this.has(key)
}

function keyIterator (key) {
  return key + ':' + this[key]
}

function noObjects (key) {
  return typeof this[key] !== 'object'
}

module.exports = genKeys

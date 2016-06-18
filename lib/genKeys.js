'use strict'

function genKeys (obj) {
  return Object.keys(obj)
    .filter(noObjects, obj)
    .map(keyIterator, obj)
}

function keyIterator (key) {
  return key + ':' + this[key]
}

function noObjects (key) {
  return typeof this[key] !== 'object'
}

module.exports = genKeys

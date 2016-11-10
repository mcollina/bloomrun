'use strict'

function insertionSort (a, b) {
  if (a.magic > b.magic) {
    return 1
  } else if (a.magic < b.magic) {
    return -1
  } else {
    return 0
  }
}

module.exports = insertionSort

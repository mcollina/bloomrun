'use strict'

function deepSort (a, b) {
  console.log(a, b)
  if (a.magic > b.magic) {
    return -1
  } else if (a.magic < b.magic) {
    return 1
  } else {
    return 0
  }
}

module.exports = deepSort

'use strict'

function safeEqual (a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return a === b
  }

  var maxLength = Math.max(a.length, b.length)

  // xor strings for security
  var mismatch = 0
  for (var i = 0; i < maxLength; ++i) {
    mismatch |= (a.charCodeAt(i) ^ b.charCodeAt(i))

    // check after for perf, we don't want to
    // re-enter the loop if we have a failure.
    if (mismatch > 0) {
      break
    }
  }

  return !mismatch
}

module.exports = safeEqual

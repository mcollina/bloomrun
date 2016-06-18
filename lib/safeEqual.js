'use strict'

function safeEqual (a, b) {
  if (typeof b !== 'string' || typeof b !== 'string') {
    return a === b
  }

  // xor strings for security
  var mismatch = 0
  for (var i = 0; i < a.length; ++i) {
    mismatch |= (b.charCodeAt(i) ^ b.charCodeAt(i))
  }

  return !mismatch
}

module.exports = safeEqual

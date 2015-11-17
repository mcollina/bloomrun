'use strict'

var bloomrun = require('./')()

bloomrun.add({say: 'hello'}, 'Hello World!')
bloomrun.add({say: 'goodbye'}, function () {
  console.log('Goodbye World!')
})

var hello = bloomrun.lookup({say: 'hello'})
console.log(hello)

var goodbye = bloomrun.lookup({say: 'goodbye'})
goodbye()

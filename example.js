'use strict'

var bloomrun = require('./')()

bloomrun.add({say: 'hello'}, 'Hello World!')
bloomrun.add({say: 'goodbye'}, function () {
  console.log('Goodbye World!')
})
bloomrun.add({say: 'something', to: /.*/}, 'Matched with a regexp and a prop')
bloomrun.add({say: /.*/}, 'Matched with a regexp!')

var hello = bloomrun.lookup({say: 'hello'})
console.log(hello)

var goodbye = bloomrun.lookup({say: 'goodbye'})
goodbye()

var anything = bloomrun.lookup({say: 'anything'})
console.log(anything)

console.log(bloomrun.lookup({say: 'something', to: 'Matteo'}))

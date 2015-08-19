# bloomrun&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/bloomrun.svg?branch=master)](https://travis-ci.org/mcollina/bloomrun)

A js pattern matcher based on bloom filters, inspired by [patrun](http://npm.im/patrun).

```js
'use strict'

var bloomrun = require('bloomrun')
var run = bloomrun()

run.add({ 'hello': 'world' })
console.log(run.lookup({ 'hello': 'world', 'answer': 42 }))
```

Some nice properties:

* Results are ordered
* reasonably fast: 0.02ms for each lookup

## License

MIT

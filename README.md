# bloomrun&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/bloomrun.svg?branch=master)](https://travis-ci.org/mcollina/bloomrun)

A js pattern matcher based on bloom filters, inspired by [patrun](http://npm.im/patrun).
But different: 10x faster, and with results returned in __insertion
order__.

* [Install](#install)
* [Example](#example)
* [API](#api)
* [TODO](#todo)
* [Acknowledgements](#acknowledgements)
* [License](#license)

<a name="install"></a>
## Install

```
npm i bloomrun --save
```

<a name="example"></a>
## Example

```js
'use strict'

var bloomrun = require('bloomrun')
var run = bloomrun()

run.add({ 'hello': 'world' })
console.log(run.lookup({ 'hello': 'world', 'answer': 42 }))
```

<a name="api"></a>
## API

  * <a href="#constructor"><code><b>bloomrun()</b></code></a>
  * <a href="#add"><code>instance.<b>add()</b></code></a>
  * <a href="#lookup"><code>instance.<b>list()</b></code></a>
  * <a href="#iterator"><code>instance.<b>iterator()</b></code></a>
  * <a href="#list"><code>instance.<b>list()</b></code></a>

-------------------------------------------------------
<a name="constructor"></a>
### bloomrun()

Creates a new instance of Bloomrun.

-------------------------------------------------------
<a name="add"></a>
### instance.add(pattern)

Adds a pattern to the Bloomrun instance.

-------------------------------------------------------
<a name="lookup"></a>
### instance.lookup(obj)

Looks up the first entry that matches the given obj. A match happens
when all properties of the added pattern matches with the one in the
passed obj.

-------------------------------------------------------
<a name="iterator"></a>
### instance.iterator(obj)

Returns an iterator, which is an object with a `next` method. `next`
will return the next pattern that matches the object or `null` if there
are no more.

-------------------------------------------------------
<a name="list"></a>
### instance.list(obj)

Returns all patterns that matches the object.

## License

MIT

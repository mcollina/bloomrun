# bloomrun
[![travis][travis-badge]][travis-url]
[![git][git-badge]][git-url]
[![npm][npm-badge]][npm-url]

A js pattern matcher based on bloom filters, inspired by [patrun](http://npm.im/patrun).
But different: 10x faster, and with results returned in __insertion order__.

* [Install](#install)
* [Example](#example)
* [API](#api)
* [TODO](#todo)
* [Acknowledgements](#acknowledgements)
* [License](#license)

<a name="install"></a>
## Install
To install bloomrun, simply use npm:

```
npm install bloomrun --save
```

<a name="example"></a>
## Example
The example below can be found [here][example] and ran using `node example.js`. It
demonstrates how to use bloomrun for pattern matching with or without a payload.

```js
'use strict'

var bloomrun = require('bloomrun')()

bloomrun.add({say: 'hello', msg: 'Hello World!'})
bloomrun.add({say: 'goodbye'}, function () {
  console.log('Goodbye World!')
})

var hello = bloomrun.lookup({say: 'hello'})
console.log(hello.msg)

var goodbye = bloomrun.lookup({say: 'goodbye'})
goodbye()
```

<a name="api"></a>
## API

  * <a href="#constructor"><code><b>bloomrun()</b></code></a>
  * <a href="#add"><code>instance.<b>add()</b></code></a>
  * <a href="#remove"><code>instance.<b>remove()</b></code></a>
  * <a href="#lookup"><code>instance.<b>lookup()</b></code></a>
  * <a href="#iterator"><code>instance.<b>iterator()</b></code></a>
  * <a href="#list"><code>instance.<b>list()</b></code></a>

-------------------------------------------------------
<a name="constructor"></a>
### bloomrun()

Creates a new instance of Bloomrun.

-------------------------------------------------------
<a name="add"></a>
### instance.add(pattern [,payload])

Adds a pattern to the Bloomrun instance. You can also provide an alternative
payload to return instead of the pattern itself. This allows pattern based
retrieval of objects. If no payload is provided the pattern itself will be
returned.

-------------------------------------------------------

<a name="remove"></a>
### instance.remove(pattern)

Removes a pattern from the Bloomrun instance. Filters are rebuilt after each
removal which may mean the same pattern is matched by another filter.

-------------------------------------------------------

<a name="lookup"></a>
### instance.lookup(obj)

Looks up the first entry that matches the given obj. A match happens
when all properties of the added pattern matches with the one in the
passed obj. If a payload was provided it will be returned instead of
the pattern.

-------------------------------------------------------
<a name="iterator"></a>
### instance.iterator(obj)

Returns an iterator, which is an object with a `next` method. `next`
will return the next pattern that matches the object or `null` if there
are no more.

-------------------------------------------------------
<a name="list"></a>
### instance.list(obj)

Returns all patterns that matches the object. If a payload was provided
this will be returned instead of the pattern.

## TODO

- Add acknowledgements
- Add ability to remove patterns
- Ensure works with browser via webpack / browserify

## License
Copyright Matteo Collina 2015, Licensed under [MIT][].

[MIT]: ./LICENSE
[example]: ./example.js

[travis-badge]: https://img.shields.io/travis/mcollina/bloomrun.svg?style=flat-square
[travis-url]: https://travis-ci.org/mcollina/bloomrun
[git-badge]: https://img.shields.io/github/release/mcollina/bloomrun.svg?style=flat-square
[git-url]: https://github.com/mcollina/bloomrun/releases
[npm-badge]: https://img.shields.io/npm/v/bloomrun.svg?style=flat-square
[npm-url]: https://npmjs.org/package/bloomrun

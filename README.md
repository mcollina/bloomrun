[![logo][logo-url]][npm-url]

# bloomrun
[![npm][npm-badge]][npm-url]
[![travis][travis-badge]][travis-url]
[![coveralls][coveralls-badge]][coveralls-url]
[![david][david-badge]][david-url]

A js pattern matcher with results that can be returned in __insertion order__ or __depth order__. 2.5KB minified and gzipped, runs in the browser. Inspired by bloom filters.

* [Install](#install)
* [Example](#example)
* [API](#api)
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
demonstrates how to use bloomrun for pattern matching with a payload.

```js
'use strict'

var bloomrun = require('bloomrun')()

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
```

<a name="api"></a>
## API

  * <a href="#constructor"><code><b>bloomrun()</b></code></a>
  * <a href="#add"><code>instance.<b>add()</b></code></a>
  * <a href="#remove"><code>instance.<b>remove()</b></code></a>
  * <a href="#lookup"><code>instance.<b>lookup()</b></code></a>
  * <a href="#iterator"><code>instance.<b>iterator()</b></code></a>
  * <a href="#list"><code>instance.<b>list()</b></code></a>
  * <a href="#default"><code>instance.<b>default()</b></code></a>

-------------------------------------------------------
<a name="constructor"></a>
### bloomrun([opts])

Creates a new instance of __bloomrun__.

Options are:

* `indexing`: it can be either `insertion` (default) or `depth`;
  if set to `insertion`, it will try to match entries in insertion order;
  if set to `depth`, it will try to match entries with the most
  properties first. Depth indexing is guaranteed if the patterns
overlaps. If multiple matching patterns overlaps it checks on the
first overlapping group of patterns that matches.

-------------------------------------------------------
<a name="add"></a>
### instance.add(pattern [,payload])

Adds a pattern to the __bloomrun__ instance. You can also provide an alternative
payload to return instead of the pattern itself. This allows pattern based
retrieval of objects. If no payload is provided the pattern itself will be
returned.

-------------------------------------------------------

<a name="remove"></a>
### instance.remove(pattern [,payload])

Removes a pattern from the __bloomrun__ instance. Filters are rebuilt after each
removal which may mean the same pattern is matched by another filter. In cases
where two patterns differ only by payload, the supplied payload can be used to
determine the correct match. If no payload is supplied any matched pattern will
be removed regardless of it's own payload.

-------------------------------------------------------

<a name="lookup"></a>
### instance.lookup(obj [, opts])

Looks up the first entry that matches the given obj. A match happens
when all properties of the added pattern matches with the one in the
passed obj. If a payload was provided it will be returned instead of
the pattern.

Options:
 * `patterns: true`, if you want to retrieve only patterns, not
   payloads

-------------------------------------------------------
<a name="iterator"></a>
### instance.iterator(obj [, opts])

Returns an iterator, which is an object with a `next` method. `next`
will return the next pattern that matches the object or `null` if there
are no more.
If `obj` is null, all patterns/payload will be returned.

Options:
 * `patterns: true`, if you want to retrieve patterns, defaults to
   `false`
 * `payloads: true`, if you want to retrieve payloads, defaults to
   `true`

If both `patterns` and `payloads` are `true`, the data will be in the
form:

```js
{
  pattern,
  payload
}
```

-------------------------------------------------------
<a name="list"></a>
### instance.list(obj [, opts])

Returns all patterns that matches the object. If a payload was provided
this will be returned instead of the pattern.
If `obj` is null, all patterns/payload will be returned.

Options:
 * `patterns: true`, if you want to retrieve patterns, defaults to
   `false`
 * `payloads: true`, if you want to retrieve payloads, defaults to
   `true`

If both `patterns` and `payloads` are `true`, the data will be in the
form:

```js
{
  pattern,
  payload
}
```

If a `default` is set, it will be returned if `obj` is falsy. In case
the `opts.patterns` is `true`, the element in the list will have the
form:

```js
{
  default: true,
  payload
}
```

-------------------------------------------------------

<a name="default"></a>
### instance.default(payload)

Sets a default payload to be returned when no pattern is matched. This
allows a single 'catch all' to be defined. By default, null is returned
when a pattern is not matched.

-------------------------------------------------------

## Acknowledgements

This project was kindly sponsored by [nearForm](http://nearform.com).

This library is heavily inspired by Richard Rodger's
[patrun](http://npm.im/patrun) and [Seneca](http://npm.im/seneca).

The bloomrun logo was created, with thanks, by [Dean McDonnell](https:/github.com/mcdonnelldean)

## License

Copyright Matteo Collina 2015-2016, Licensed under [MIT][].

[MIT]: ./LICENSE
[example]: ./example.js

[travis-badge]: https://travis-ci.org/mcollina/bloomrun.svg?branch=master
[travis-url]: https://travis-ci.org/mcollina/bloomrun
[npm-badge]: https://badge.fury.io/js/bloomrun.svg
[npm-url]: https://npmjs.org/package/bloomrun
[logo-url]: https://raw.githubusercontent.com/mcollina/bloomrun/master/assets/bloomrun.png
[coveralls-badge]: https://coveralls.io/repos/mcollina/bloomrun/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/mcollina/bloomrun?branch=master
[david-badge]: https://david-dm.org/mcollina/bloomrun.svg
[david-url]: https://david-dm.org/mcollina/bloomrun

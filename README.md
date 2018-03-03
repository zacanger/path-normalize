# path-normalize

Zero-dependency browser-oriented `path.normalize`.

`path-normalize` is different from
[normalize-path](http://npm.im/normalize-path); `normalize-path` only handles
slashes, while this lib is a browser-focused version of the POSIX `path.normalize`
in Node.

`path-normalize` also differs from Node's `path.normalize`. `path-normalize`
handles uri-encoded strings and strips directory traversals (`../`).

Portions of this code are heavily based on
[code](https://github.com/nodejs/node/blob/b404aa56c0e776c9722017ca020f9d04c7aa6de2/lib/path.js#L1182)
in Node.

--------

## Installation

`npm i path-normalize`

## Usage

```javascript
const normalize = require('path-normalize')
const normal = (somePath) => normalize(somePath)
```

Slightly more real-world example:

```javascript
import normalize from 'path-normalize'

// imaginary client-side router api
router.route('/foo/*', (pathname) => {
  const normalized = normalize(pathname)
  if (normalized !== pathname) {
    router.redirect(normalized)
  } else {
    renderFoo()
  }
})
```

## Todo

* Make the code not shit

## License

[MIT](./LICENSE.md)

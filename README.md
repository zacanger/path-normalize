# path-normalize

Zero-dependency browser-oriented `path.normalize`.

[![npm version](https://img.shields.io/npm/v/path-normalize.svg)](https://npm.im/path-normalize) [![CircleCI](https://circleci.com/gh/zacanger/path-normalize/tree/master.svg?style=svg)](https://circleci.com/gh/zacanger/path-normalize/tree/master) [![codecov](https://codecov.io/gh/zacanger/path-normalize/branch/master/graph/badge.svg)](https://codecov.io/gh/zacanger/path-normalize) [![Patreon](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/zacanger) [![ko-fi](https://img.shields.io/badge/donate-KoFi-yellow.svg)](https://ko-fi.com/U7U2110VB)

`path-normalize` is different from
[normalize-path](http://npm.im/normalize-path); `normalize-path` only handles
slashes, while this lib is a browser-focused version of the POSIX `path.normalize`
in Node.

`path-normalize` also differs from Node's `path.normalize`. `path-normalize`
handles uri-encoded strings.

Most of this library is directly from
[Node's source](https://github.com/nodejs/node/blob/b404aa56c0e776c9722017ca020f9d04c7aa6de2/lib/path.js#L1182).
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

See also:
[react-router-path-normalize](https://www.npmjs.com/package/react-router-path-normalize).

[LICENSE](./LICENSE.md)

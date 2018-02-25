# path-normalize

`path.normalize` for the browser. This is different from
[normalize-path](http://npm.im/normalize-path); `normalize-path` only handles
slashes, while this lib is a browser-focused copy of the POSIX `path.normalize`
in Node.

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

## Todo

* Strip/ignore `..`
* Make the code not shit

## License

[MIT](./LICENSE.md)

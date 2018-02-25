const CHAR_UPPERCASE_A = 65 /* A */
const CHAR_LOWERCASE_A = 97 /* a */
const CHAR_UPPERCASE_Z = 90 /* Z */
const CHAR_LOWERCASE_Z = 122 /* z */
const CHAR_FORWARD_SLASH = 47 /* / */
const CHAR_BACKWARD_SLASH = 92 /* \ */
const CHAR_COLON = 58 /*  = */
const CHAR_DOT = 46 /* . */

function normalizeStringWin32 (path, allowAboveRoot) {
  var res = ''
  var lastSegmentLength = 0
  var lastSlash = -1
  var dots = 0
  var code
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length) { code = path.charCodeAt(i) } else if (isPathSeparator(code)) { break } else { code = CHAR_FORWARD_SLASH }

    if (isPathSeparator(code)) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 ||
            res.charCodeAt(res.length - 1) !== CHAR_DOT ||
            res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf('\\')
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = ''
                lastSegmentLength = 0
              } else {
                res = res.slice(0, lastSlashIndex)
                lastSegmentLength = res.length - 1 - res.lastIndexOf('\\')
              }
              lastSlash = i
              dots = 0
              continue
            }
          } else if (res.length === 2 || res.length === 1) {
            res = ''
            lastSegmentLength = 0
            lastSlash = i
            dots = 0
            continue
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) { res += '\\..' } else { res = '..' }
          lastSegmentLength = 2
        }
      } else {
        if (res.length > 0) { res += '\\' + path.slice(lastSlash + 1, i) } else { res = path.slice(lastSlash + 1, i) }
        lastSegmentLength = i - lastSlash - 1
      }
      lastSlash = i
      dots = 0
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots
    } else {
      dots = -1
    }
  }
  return res
}

function assertPath (path) {
  if (typeof path !== 'string') {
    throw new TypeError('ERR_INVALID_ARG_TYPE', 'path', 'string')
  }
}

function isPathSeparator (code) {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH
}

function isWindowsDeviceRoot (code) {
  return code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z ||
         code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z
}

function normalize (path) {
  assertPath(path)
  const len = path.length
  if (len === 0) { return '.' }
  var rootEnd = 0
  var device
  var isAbsolute = false
  const code = path.charCodeAt(0)

  // Try to match a root
  if (len > 1) {
    if (isPathSeparator(code)) {
      // Possible UNC root

      // If we started with a separator, we know we at least have an absolute
      // path of some kind (UNC or otherwise)
      isAbsolute = true

      if (isPathSeparator(path.charCodeAt(1))) {
        // Matched double path separator at beginning
        var j = 2
        var last = j
        // Match 1 or more non-path separators
        for (; j < len; ++j) {
          if (isPathSeparator(path.charCodeAt(j))) { break }
        }
        if (j < len && j !== last) {
          const firstPart = path.slice(last, j)
          // Matched!
          last = j
          // Match 1 or more path separators
          for (; j < len; ++j) {
            if (!isPathSeparator(path.charCodeAt(j))) { break }
          }
          if (j < len && j !== last) {
            // Matched!
            last = j
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (isPathSeparator(path.charCodeAt(j))) { break }
            }
            if (j === len) {
              // We matched a UNC root only
              // Return the normalized version of the UNC root since there
              // is nothing left to process

              return '\\\\' + firstPart + '\\' + path.slice(last) + '\\'
            } else if (j !== last) {
              // We matched a UNC root with leftovers

              device = '\\\\' + firstPart + '\\' + path.slice(last, j)
              rootEnd = j
            }
          }
        }
      } else {
        rootEnd = 1
      }
    } else if (isWindowsDeviceRoot(code)) {
      // Possible device root

      if (path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2)
        rootEnd = 2
        if (len > 2) {
          if (isPathSeparator(path.charCodeAt(2))) {
            // Treat separator following drive name as an absolute path
            // indicator
            isAbsolute = true
            rootEnd = 3
          }
        }
      }
    }
  } else if (isPathSeparator(code)) {
    // `path` contains just a path separator, exit early to avoid unnecessary
    // work
    return '\\'
  }

  var tail
  if (rootEnd < len) { tail = normalizeStringWin32(path.slice(rootEnd), !isAbsolute) } else { tail = '' }
  if (tail.length === 0 && !isAbsolute) { tail = '.' }
  if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) { tail += '\\' }
  if (device === undefined) {
    if (isAbsolute) {
      if (tail.length > 0) { return '\\' + tail } else { return '\\' }
    } else if (tail.length > 0) {
      return tail
    } else {
      return ''
    }
  } else if (isAbsolute) {
    if (tail.length > 0) { return device + '\\' + tail } else { return device + '\\' }
  } else if (tail.length > 0) {
    return device + tail
  } else {
    return device
  }
}

module.exports = normalize

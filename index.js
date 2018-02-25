module.exports = (path = '') =>
  /.*\/{2,}.*/.test(path)
    ? path.replace(/\/{2,}/g, '/')
    : path

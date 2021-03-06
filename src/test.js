import test from 'tape'
import normalize from '.'

// eslint-disable-next-line max-statements
test('normalize', (t) => {
  t.equal(normalize('./fixtures///b/../b/c.js'), 'fixtures/b/c.js')
  t.equal(normalize('/foo/../../../bar'), '/bar')
  t.equal(normalize('a//b//../b'), 'a/b')
  t.equal(normalize('a//b//./c'), 'a/b/c')
  t.equal(normalize('a//b//.'), 'a/b')
  t.equal(normalize('/a/b/c/../../../x/y/z'), '/x/y/z')
  t.equal(normalize('///..//./foo/.//bar'), '/foo/bar')
  t.equal(normalize('bar/foo../../'), 'bar/')
  t.equal(normalize('bar/foo../..'), 'bar')
  t.equal(normalize('bar/foo../../baz'), 'bar/baz')
  t.equal(normalize('bar/foo../'), 'bar/foo../')
  t.equal(normalize('bar/foo..'), 'bar/foo..')
  t.equal(normalize('../foo../../../bar'), '../../bar')
  t.equal(normalize('../../.././../../../bar'), '../../../../../../bar')
  t.equal(normalize('../../../foo/../../../bar'), '../../../../../bar')
  t.equal(normalize('../../../foo/../../../bar/../../'), '../../../../../../')
  t.equal(normalize('../foobar/barfoo/foo/../../../bar/../../'), '../../')
  t.equal(
    normalize('../../../foobar/../../../bar/../../baz'),
    '../../../../../../baz'
  )
  t.equal(normalize('/../../../foobar/../../../bar/../../baz'), '/baz')
  t.throws(() => normalize(1), /Expected a string, got a number/)
  t.end()
})

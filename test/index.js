import test from 'ava';
import postcss from 'postcss';
import plugin, { classNameMatches, removeClasses } from '../src';

test('postcss api', (t) => {
  t.is(postcss().use(plugin(['a'])).process('.a {} .b {}').css, '.b {}');
});

test('classNameMatches', (t) => {
  t.true(classNameMatches('a', 'a'), 'should work with strings');
  t.false(classNameMatches('a', 'b'), 'should work with strings');
  t.true(classNameMatches(['a'], 'a'), 'should work with arrays');
  t.false(classNameMatches(['a'], 'b'), 'should work with arrays');
  t.true(classNameMatches(['a', 'b'], 'b'), 'should work with arrays');
  t.false(classNameMatches(['a', 'b'], 'c'), 'should work with arrays');
  t.true(classNameMatches(/a/, 'a'), 'should work with regular expressions');
  t.false(classNameMatches(/a/, 'b'), 'should work with regular expressions');
});

test('it should remove a single class name', (t) => {
  t.is(removeClasses(classNameMatches('a'), '.a'), '');
  t.is(removeClasses(classNameMatches('a'), '.a.b'), '');
  t.is(removeClasses(classNameMatches('a'), '.a .b'), '');
  t.is(removeClasses(classNameMatches('a'), '.b .a'), '');
  t.is(removeClasses(classNameMatches('a'), '.a > .b'), '');
  t.is(removeClasses(classNameMatches('a'), '.a + .b'), '');
  t.is(removeClasses(classNameMatches('a'), '.a ~ .b'), '');
});

test('it should remove multiple class names', (t) => {
  t.is(removeClasses(classNameMatches(['a', 'b']), '.a'), '');
  t.is(removeClasses(classNameMatches(['a', 'b']), '.b'), '');
});

test('it should otherwise leave selectors in-tact', (t) => {
  t.is(removeClasses(classNameMatches('c'), '.a.b'), '.a.b');
  t.is(removeClasses(classNameMatches('c'), '.a[class="c"]'), '.a[class="c"]');
  t.is(removeClasses(classNameMatches('c'), '.a[class~="c"]'), '.a[class~="c"]');
});

test('it should work with non-class selectors', (t) => {
  t.is(removeClasses(classNameMatches('a'), '*.a'), '');
  t.is(removeClasses(classNameMatches('a'), '.a:checked'), '');
  t.is(removeClasses(classNameMatches('a'), '.a::before'), '');
  t.is(removeClasses(classNameMatches('a'), 'p.a'), '');
  t.is(removeClasses(classNameMatches('a'), 'p.a::before'), '');
});

test('it should handle :matches', (t) => {
  t.is(removeClasses(classNameMatches('a'), 'p:matches(.a)'), '');
  t.is(removeClasses(classNameMatches('a'), 'p:matches(p.a)'), '');
  t.is(removeClasses(classNameMatches(['a', 'b']), 'p:matches(.a, .b)'), '');
  t.is(removeClasses(classNameMatches(['a', 'b']), 'p:matches(.a, .b, .c)'), 'p:matches( .c)');
});

test('it should handle :has', (t) => {
  t.is(removeClasses(classNameMatches('a'), 'p:has(.a)'), '');
  t.is(removeClasses(classNameMatches('a'), 'p:has(p.a)'), '');
  t.is(removeClasses(classNameMatches(['a', 'b']), 'p:has(.a, .b)'), '');
  t.is(removeClasses(classNameMatches(['a', 'b']), 'p:has(.a, .b, .c)'), 'p:has( .c)');
});

test('it should handle :not', (t) => {
  t.is(removeClasses(classNameMatches('a'), 'p:not(.a)'), 'p');
  t.is(removeClasses(classNameMatches('a'), 'p:not(p.a)'), 'p');
  t.is(removeClasses(classNameMatches('a'), 'p:not(.a) .b'), 'p .b');
  t.is(removeClasses(classNameMatches(['a', 'b']), 'p:not(.a, .b)'), 'p');
  t.is(removeClasses(classNameMatches(['a', 'b']), 'p:not(.a, .b, .c)'), 'p:not( .c)');
});

test('compound selectors', (t) => {
  t.is(removeClasses(classNameMatches('a'), '.a, .b'), '.b');
  t.is(removeClasses(classNameMatches('a'), '.b, .a'), '.b');
});

import test from 'ava';
import postcss from 'postcss';
import plugin, { removeClasses } from '../src';

test('postcss api', t => {
  t.is(postcss().use(plugin(['a'])).process('.a {} .b {}').css, '.b {}');
});

test('it should remove a single class name', t => {
  t.is(removeClasses(['a'], '.a'), '');
  t.is(removeClasses(['a'], '.a.b'), '');
  t.is(removeClasses(['a'], '.a .b'), '');
  t.is(removeClasses(['a'], '.b .a'), '');
  t.is(removeClasses(['a'], '.a > .b'), '');
  t.is(removeClasses(['a'], '.a + .b'), '');
  t.is(removeClasses(['a'], '.a ~ .b'), '');
});

test('it should remove multiple class names', t => {
  t.is(removeClasses(['a', 'b'], '.a'), '');
  t.is(removeClasses(['a', 'b'], '.b'), '');
});

test('it should otherwise leave selectors in-tact', t => {
  t.is(removeClasses(['c'], '.a.b'), '.a.b');
  t.is(removeClasses(['c'], '.a[class="c"]'), '.a[class="c"]');
  t.is(removeClasses(['c'], '.a[class~="c"]'), '.a[class~="c"]');
});

test('it should work with non-class selectors', t => {
  t.is(removeClasses(['a'], '*.a'), '');
  t.is(removeClasses(['a'], '.a:checked'), '');
  t.is(removeClasses(['a'], '.a::before'), '');
  t.is(removeClasses(['a'], 'p.a'), '');
  t.is(removeClasses(['a'], 'p.a::before'), '');
});

test('it should handle :matches', t => {
  t.is(removeClasses(['a'], 'p:matches(.a)'), '');
  t.is(removeClasses(['a'], 'p:matches(p.a)'), '');
  t.is(removeClasses(['a', 'b'], 'p:matches(.a, .b)'), '');
  t.is(removeClasses(['a', 'b'], 'p:matches(.a, .b, .c)'), 'p:matches( .c)');
});

test('it should handle :has', t => {
  t.is(removeClasses(['a'], 'p:has(.a)'), '');
  t.is(removeClasses(['a'], 'p:has(p.a)'), '');
  t.is(removeClasses(['a', 'b'], 'p:has(.a, .b)'), '');
  t.is(removeClasses(['a', 'b'], 'p:has(.a, .b, .c)'), 'p:has( .c)');
});

test('it should handle :not', t => {
  t.is(removeClasses(['a'], 'p:not(.a)'), 'p');
  t.is(removeClasses(['a'], 'p:not(p.a)'), 'p');
  t.is(removeClasses(['a', 'b'], 'p:not(.a, .b)'), 'p');
  t.is(removeClasses(['a', 'b'], 'p:not(.a, .b, .c)'), 'p:not( .c)');
});

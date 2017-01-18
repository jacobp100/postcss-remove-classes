# postcss-remove-classes

Removes all instances of one or more class selectors from a CSS file. Accepts one argument that specifies which class names must be removed. This must be a single string, an array of strings, or a RegExp instance.

```bash
npm i --save-dev postcss-remove-classes
```

```js
postcss()
  .use(plugin(['remove'])) // Add as many as you like
  .process('.remove {} .keep {}').css // Gives .keep {}
```

# Examples
```css
a:matches(.remove) /* empty */
a:matches(.remove, .keep) /* a:matches(.keep) */
a:not(.remove) /* a */
a:not(.remove, .keep) /* a:not(.keep) */
a[class="remove"] /* a[class="remove"] --- Will not look in attributes */
```

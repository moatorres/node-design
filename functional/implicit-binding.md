# Functional Programming

## Implicit Binding of `this`

The CSV (comma-separated values) file format is a simple text representation for tabular data:

`Bösendorfer,1828,Vienna,Austria`
`Fazioli,1981,Sacile,Italy`
`Steinway,1853,New York,USA`

We can write a simple, customizable class for reading CSV data. For simplicity, we’ll leave off the ability to parse quoted entries such as "hello, world".

Despite its name, CSV comes in different varieties allowing different characters for separators. So our constructor takes an optional array of separator characters and constructs a custom regular expression to use for splitting each line into entries:

```js
function CSVReader(separators) {
  this.separators = separators || [',']
  this.regexp = new RegExp(
    this.separators
      .map(function (sep) {
        return '\\' + sep[0]
      })
      .join('|')
  )
}
```

A simple implementation of a read method can proceed in two steps: first, split the input string into an array of individual lines; second, split each line of the array into individual cells. The result should then be a two-dimensional array of strings. This is a perfect job for the map method:

```js
CSVReader.prototype.read = function (str) {
  let lines = str.trim().split(/\n/)
  return lines.map(function (line) {
    return line.split(this.regexp) // wrong this!
  })
}

const reader = new CSVReader()
reader.read('a,b,c\nd,e,f\n') // [["a,b,c"], ["d,e,f"]]
```

This seemingly simple code has a major but subtle bug. The callback passed to `lines.map` refers to `this`, expecting to extract the `regexp` property of the `CSVReader` object. But `map` binds its callback’s receiver to the lines array, which has no such property. The result: `this.regexp` produces `undefined`, and the call to `line.split` goes haywire.

####This bug is the result of the fact that this is bound in a different way from variables.

Every function has an implicit binding of `this`, whose value is determined when the function is called. With a lexically scoped variable, you can always tell where it receives its binding by looking for an explicitly named binding occurrence of the name: for example, in a `var` declaration list or as a function parameter.

By contrast, `this` is implicitly bound by the nearest enclosing function. So the binding of `this` in `CSVReader.prototype.read` is different from the binding of `this` in the callback function passed to `lines.map`.

Luckily we can take advantage of the fact that the `map` method of arrays takes an optional
second argument to use as a `this`-binding for the callback. So in this case, the easiest fix is to forward the outer binding of `this` to the callback by way of the second map argument:

```js
CSVReader.prototype.read = function (str) {
  let lines = str.trim().split(/\n/)
  return lines.map(function (line) {
    return line.split(this.regexp)
  }, this) // forward outer this-binding to callback
}

const reader = new CSVReader()

reader.read('a,b,c\nd,e,f\n') // => [["a","b","c"], ["d","e","f"]]
```

Now, not all callback-based APIs are so considerate. What if `map` did not accept this additional argument? We would need another way to retain access to the outer function’s `this`-binding so that the callback could still refer to it.

The solution is straightforward enough: just use a lexically scoped variable to save an additional reference to the outer binding of `this`:

```js
CSVReader.prototype.read = function (str) {
  let lines = str.trim().split(/\n/)
  let self = this // save a reference to outer this-binding

  return lines.map(function (line) {
    return line.split(self.regexp) // use outer this
  })
}

const reader = new CSVReader()

reader.read('a,b,c\nd,e,f\n') // => [["a","b","c"], ["d","e","f"]]
```

Programmers commonly use the variable name self for this pattern, signaling that the only purpose for the variable is as an extra alias to the current scope’s `this`-binding. (Other popular variable names for this pattern are me and that.) The particular choice of name is not of great importance, but using a common name makes it easier for other programmers to recognize the pattern quickly.

### Credits

From the book [Effective Javascript](https://www.amazon.com/Effective-JavaScript-Specific-Software-Development/dp/0321812182) written by David Herman

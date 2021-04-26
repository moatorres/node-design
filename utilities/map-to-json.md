# Utilities

## Map `toJSON`

Would you like to start using ES6 `Map` instead of JS objects but you're holding back because you can't figure out how to `JSON.stringify()` a `Map`?

It's possible to add support for native `Map` object, including deeply nested values using this second argument.

Luckily, both `JSON.stringify` and `JSON.parse` **support a second argument** that we can use just for that.

We'll create two methods:

1. `replacer` to stringify a `Map`-type object
2. `reviver` to parse it

#### `replacer`

Used as a second argument to `JSON.stringify`

```js
function replacer(key, value) {
  if (!(value instanceof Map)) return value

  return {
    dataType: 'Map',
    value: [...value],
  }
}
```

#### `reviver`

Used as a second argument to `JSON.parse`

```js
function reviver(key, value) {
  if (typeof value !== 'object' || value === null || value.dataType !== 'Map')
    return value

  return new Map(value.value)
}
```

### Usage

```js
const originalValue = new Map([['a', 1]])

const str = JSON.stringify(originalValue, replacer)
const newValue = JSON.parse(str, reviver)

console.log(originalValue, newValue)
```

Deep nesting with combination of `Array`, `Object` and `Map`:

```js
const originalValue = [
  new Map([
    [
      'a',
      {
        b: {
          c: new Map([['d', 'text']]),
        },
      },
    ],
  ]),
]

const str = JSON.stringify(originalValue, replacer)
const newValue = JSON.parse(str, reviver)

console.log(originalValue, newValue)
```

### Credits

From this [question](https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map) published on [Stack Overflow](https://stackoverflow.com)

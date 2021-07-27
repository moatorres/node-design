# Utilities

## Map `toJSON`

How to `JSON.stringify()` a `Map` type in JavaScript?

To add support for native `Map` objects, including deeply nested values, we must leverage `JSON.stringify` and `JSON.parse` methods' **second argument**.

Let's create two method:s

1. `stringifyMap` to stringify a `Map`-type object
2. `parseMap` to parse it

#### `stringifyMap`

Used as a second argument to `JSON.stringify`

```js
function stringifyMap(key, value) {
  if (!(value instanceof Map)) return value

  return {
    dataType: 'Map',
    value: [...value],
  }
}
```

#### `parseMap`

Used as a second argument to `JSON.parse`

```js
function parseMap(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
```

### Usage

```js
const originalValue = new Map([['a', 1]])

const str = JSON.stringify(originalValue, stringifyMap)
const newValue = JSON.parse(str, parseMap)

console.log(originalValue.get('a'))
console.log(newValue.get('a'))
console.log(str)
console.log(newValue)
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

const str = JSON.stringify(originalValue, stringifyMap)
const newValue = JSON.parse(str, parseMap)

console.log(originalValue, newValue)
```

### Credits

From this [question](https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map) published on [Stack Overflow](https://stackoverflow.com)

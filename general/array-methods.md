# Utilities

## Array Methods

Legend

- ✏️ method changes `this`
- 🔒 method does not change `this`

`Array.prototype.*` methods

### `concat(...items)` 🔒 <sup>ES3</sup>

Returns a new array that is the concatenation of `this` and all `items`. Non-array parameters are treated as if they were arrays with single elements.

```js
const arr = ['a'].concat('b', ['c', 'd'])

// => [ 'a', 'b', 'c', 'd' ]
```

### `copyWithin(target, start, end = this.length)` ✏️ <sup>ES6</sup>

Copies the elements whose indices range from `start` to (excl.) `end` to indices starting with `target`. Overlapping is handled correctly.

```js
const arr = ['a', 'b', 'c', 'd'].copyWithin(0, 2, 4)

// => [ 'c', 'd', 'c', 'd' ]
```

### `entries(): Iterable<[number, T]>` 🔒 <sup>ES6</sup>

Returns an iterable over [index, element] pairs.

```js
Array.from(['a', 'b'].entries())

// => [ [ 0, 'a' ], [ 1, 'b' ] ]
```

### `every(callback: (value: T, index: number, array: Array<T>) => boolean, thisArg?: any): boolean` 🔒 <sup>ES5</sup>

Returns `true` if `callback` returns `true` for every element. Stops as soon as it receives `false`.

```js
const arr = [1, 2, 3].every((x) => x > 0)
// => true

const arr = [1, -2, 3].every((x) => x > 0)
// => false
```

### `fill(value, start = 0, end = this.length)` ✏️ <sup>ES6</sup>

Assigns `value` to every index

```js
const arr = [0, 1, 2].fill('a')
// => [ 'a', 'a', 'a' ]
```

### `filter(callback, thisArg?)` 🔒 <sup>ES5</sup>

Returns an array with only those elements for which `callback` returns `true`

```js
const arr = [1, -2, 3].filter((x) => x > 0)
// => [ 1, 3 ]
```

### `find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined` 🔒 <sup>ES6</sup>

The result is the first element for which `predicate` returns `true`. If it never does, the result is `undefined`

```js
const arr = [1, -2, 3].find((x) => x < 0)
// => -2

const arr = [1, 2, 3].find((x) => x < 0)
// => undefined
```

### `findIndex(predicate, thisArg?)` 🔒 <sup>ES6</sup>

The result is the index of the first element for which `predicate` returns `true`. If it never does, the result is `-1`.

```js
const arr = [1, -2, 3].findIndex((x) => x < 0)
// => 1

const arr = [1, 2, 3].findIndex((x) => x < 0)
// => -1
```

### `forEach(callback, thisArg?)` 🔒 <sup>ES5</sup>

Calls `callback` for each element

```js
const arr = ['a', 'b'].forEach((x, index) => console.log(x, index))
// => 'a' 0
// => 'b' 1
```

### `includes(searchElement: T, fromIndex=0): boolean` 🔒 <sup>ES2016</sup>

Returns `true` if `searchElement` SameValueZero-equal to an element and `false`, otherwise. SameValueZero-equal means: strictly equal, but `NaN` is also equal to itself.

```js
const arr = [0, 1, 2].includes(1)
// => true

const arr = [0, 1, 2].includes(5)
// => false
```

### `indexOf(searchElement, fromIndex = 0)` 🔒 <sup>ES5</sup>

Returns the index of the first element that is strictly equal to `searchElement`. Returns `-1` if there is no such element. Starts searching at index `fromIndex`, visiting subsequent indices next.

```js
const arr = ['a', 'b', 'a'].indexOf('a')
// => 0

const arr = ['a', 'b', 'a'].indexOf('a', 1)
// => 2

const arr = ['a', 'b', 'a'].indexOf('c')
// => -1
```

### `join(separator = ',')` 🔒 <sup>ES1</sup>

Creates a string by concatenating string representations of all elements, separating by `separator`

```js
const arr = ['a', 'b', 'c'].join()
// => 'a,b,c'

const arr = ['a', 'b', 'c'].join('##')
// => 'a##b##c'
```

### `keys(): Iterable<number>` 🔒 <sup>ES6</sup>

Returns an iterable over the keys of the array

```js
const arr = [...['a', 'b'].keys()]
// => [ 0, 1 ]
```

### `lastIndexOf(searchElement, fromIndex = this.length - 1)` 🔒 <sup>ES5</sup>

Returns the index of the last element that is strictly equal to `searchElement`. Returns `-1` if there is no such element. Starts searching at index `fromIndex`, visiting preceding indices next.

```js
const arr = ['a', 'b', 'a'].lastIndexOf('a')
// => 2

const arr = ['a', 'b', 'a'].lastIndexOf('a', 1)
// => 0

const arr = ['a', 'b', 'a'].lastIndexOf('c')
// => -1
```

### `map(callback, thisArg?)` 🔒 <sup>ES5</sup>

Returns a new array, in which every element is the result of `callback` being applied to the corresponding element of `this`.

```js
const arr = [1, 2, 3].map(x => x * 2)
// => [ 2, 4, 6 ]

const arr = ['a', 'b', 'c'].map((x, i) => i))
// => [ 0, 1, 2 ]
```

### `pop()` ✏️ <sup>ES3</sup>

Removes and returns the last element of the array. That is, it treats the end of the array as a stack.

```js
const arr = ['a', 'b', 'c']

arr.pop()
// => [ 'a', 'b' ]
```

### `push(...items)` ✏️ <sup>ES3</sup>

Adds adds zero or more `items` to the end of the array. That is, it treats the end of the array as a stack. The return value is the length of `this` after the change.

```js
const arr = ['a', 'b']

arr.push('c', 'd')
// => [ 'a', 'b', 'c', 'd' ]
```

### `reduce(callback, firstState?)` 🔒 <sup>ES5</sup>

The `callback` computes the next state, given the current state and an `element` of the `array`. `.reduce()` feeds it the array elements, starting at index `0`, going forward. If no `firstState` is provided, the array element at index `0` is used, instead. The last state is the result of `.reduce()`.

```js
const arr = [1, 2, 3].reduce((state, x) => state + String(x), ''))
// => '123'

const arr = [1, 2, 3].reduce((state, x) => state + x, 0))
// => 6
```

### `reduceRight(callback, firstState?)` 🔒 <sup>ES5</sup>

Works like `.reduce()`, but visits the array elements backward, starting with the last element

```js
const arr = [1, 2, 3].reduceRight((state, x) => state + String(x), '')
// => '321'
```

### `reverse()` ✏️ <sup>ES1</sup>

Rearranges the elements of the array so that they are in reverse order and then returns `this`

```js
const arr = ['a', 'b', 'c']

arr.reverse()
// => [ 'c', 'b', 'a' ]
```

### `shift()` ✏️ <sup>ES3</sup>

Removes and returns the **first element** of the array

```js
const arr = ['a', 'b', 'c']

arr.shift()
// => [ 'b', 'c' ]
```

### `slice(start, end)` 🔒 <sup>ES3</sup>

Returns a new array, with the elements of `this` whose indices are between `start` and (excl.) `end`

```js
const arr = ['a', 'b', 'c', 'd'].slice(1, 3)
// => [ 'b', 'c' ]

const arr = ['a', 'b'].slice() // shallow copy
// => [ 'a', 'b' ]
```

### `some(callback, thisArg?)` 🔒 <sup>ES5</sup>

Returns `true` if `callback` returns `true` for at least one element. Stops as soon as it receives `true`

```js
const arr = [1, 2, 3].some((x) => x < 0)
// => false

const arr = [1, -2, 3].some((x) => x < 0)
// = >true
```

### `sort(fn?)` ✏️ <sup>ES1</sup>

Sorts the array and returns `this`. The order in which to sort is specified via `compareFn`, which returns a number that is:

- Negative if `a < b` (mnemonic: negative = less than zero)
- Zero if `a === b`
- Positive if `a > b`

```js
const arr = [3, 1, 2].sort((a, b) => a - b))
// => [ 1, 2, 3 ]

const arr = ['b', 'a', 'c'].sort((a, b) => a < b ? -1 : a > b ? +1 : 0))
// => [ 'a', 'b', 'c' ]
```

### `splice(start, deleteCount = this.length-start, ...items)` ✏️ <sup>ES3</sup>

At index `start`, it removes `deleteCount` elements and inserts the `items`. It returns the deleted elements.

```js
const arr = ['a', 'b', 'c', 'd']

arr.splice(1, 2, 'x', 'y')
// => [ 'a', 'x', 'y', 'd' ]
```

### `toString()` 🔒 <sup>ES1</sup>

Returns a string with string versions of all elements, separated by commas.

```js
const arr = [1, 2, 3].toString()
// => '1,2,3'

const arr = ['a', 'b', 'c'].toString()
// => 'a,b,c'

const arr = [].toString()
// => ''
```

### `unshift(...items)` ✏️ <sup>ES3</sup>

Inserts the `items` at the beginning of this array and returns the length of `this` after the modification.

```js
const arr = ['c', 'd']

arr.unshift('e', 'f')
// => [ 'e', 'f', 'c', 'd' ]
```

### Credits

From this [gist](https://gist.github.com/rauschma/f7b96b8b7274f2e2d8dab899803346c3) written by [@rauschma](https://github.com/rauschma)

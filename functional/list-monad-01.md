# Functional Programming

## Maybe Monad

List is the typical name of an `Array`-like monad.

_For the purposes of this example, we'll assume of constructor has been added to this. When actually making one, we'd also type-check in the of constructor to ensure the passed value is an `Array`._

```js
const List = (x) => ({
  emit: () => x,
  chain: (f) => f(x),
  map: (f) => List.of(f(x)),
  inspect: () => `List(${x})`,
  head: () => x[0],
  concat: (a) => List.of(x.concat(a)),
  of: (x) => (Array.isArray(x) ? List(x) : List([x])),
})
```

#### Method: `concat`

Concatenation is a fairly simple concept from `Array`: take one array, and add it onto the end of another. This seems like a method that would be very useful to have available.

The function is simple: make a new `List` from using `Array.concat` on the contained value and the incoming value. Note that this is `map`-like; it returns a new `List`.

```js
const myNumbers = List.of([1, 3, 4, 7, 10])

myNumbers.concat([12]).inspect() // => List(1,3,4,7,10,12);
```

#### Method: `head`

Let's say we wanted to just know what the first item in the `List` is. It's not an `Array` so using an index accessor like `[0]` isn't going to work.

```js
const myNumbers = List.of([1, 3, 4, 7, 10])

myNumbers.head() // => 1
```

This method is `chain`-like, as it returns a non-monadic value - in this case, unwrapping part of the value. This one exits the monad pattern, so be aware when using these kinds of methods that continuing to chain `map`, `emit`, `inspect`, etc will not work.

```js
const myNumbers = List.of([1, 3, 4, 7, 10])

myNumbers.head().inspect() // => ERROR! We unwrapped from the monad at `.head()`!
```

#### Method: `of`

Alternative name: `value`, `getValue`

In all the examples above I have been calling directly `List`. Typically, however, there is a constructor method. In JS, the convention is to add an `of` constructor.

```js
const one = List.of(1)

console.log(one.inspect()) // => List(1)
```

We could also handle this using import/export, as such:

```js
import { List } from './List.js'

// you might do type-checking here
const ListOf = (x) => (Array.isArray(x) ? List(x) : List([x]))

const exportList = {
  of: ListOf,
}

module.exports = { List: exportList }
```

### Usage

```js
const { List } = require('./List')

const myNumbers = List.of([1, 3, 4, 7, 10])

console.log(myNumbers.inspect())
// => List(1,3,4,7,10)

console.log(myNumbers.concat([12]).inspect())
// => List(1, 3, 4, 7, 10, 12);

console.log(myNumbers.head())
// => 1
```

Excercise: make a `.tail()` method on the _List.js_ file, which returns the last item of the `List`.

### Credits

From the article [Building Expressive Monads in Javascript: Introduction](https://dev.to/rgeraldporter/building-expressive-monads-in-javascript-introduction-23b) written by [@rgeraldporter](https://github.com/rgeraldporter)
[Try on Repl.it](https://replit.com/@rgeraldporter/List-Monad-Example)

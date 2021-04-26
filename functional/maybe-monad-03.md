# Functional Programming

## Maybe Monad

It's possible you've heard of `Maybe` (also known as `Option`): the oddly named, but incredibly useful and powerful monad pattern.

The name "maybe" refers to the idea of "maybe there is a value... but maybe there is not".

In JS, having values that are `undefined` and `null` can cause havoc in the wrong place. What if, in every case where we currently have to place an awkward `if (x === undefined || x === null)` statement, we just could handle those cases right inside the value's container and never expose those unsightly and troublesome `null` values?

#### `Just`

The `Just` monad is very similar to `Identity`. It is used when there's a valid value.

```js
const Just = (x) => ({
  chain: (f) => f(x),
  emit: () => x,
  map: (f) => MaybeOf(f(x)),
  fork: (_, g) => g(x),
  isJust: true,
  isNothing: false,
  inspect: () => `Just(${x})`,
})
```

#### `Nothing`

`Nothing` is a rather different monad than most: it doesn't take a value, and every method you use will result in `Nothing()`. After a `Maybe` has cast a value to `Nothing` there's no going back - all attempts to `map` or `chain` just result in `Nothing`, so you need not worry about functions having unexpected behaviours since they never actually run.

```js
const Nothing = (x) => ({
  chain: (_) => Nothing(),
  emit: () => Nothing(),
  map: (_) => Nothing(),
  fork: (f, _) => f(),
  isJust: false,
  isNothing: true,
  inspect: () => `Nothing`,
})
```

#### `MaybeOf`

If the value being encapsulated in the monad is not `undefined`, `null`, or already a `Nothing`, then it is kept in `Just`.

```js
const MaybeOf = (x) =>
  x === null || x === undefined || x.isNothing ? Nothing() : Just(x)

const exportMaybe = {
  of: MaybeOf,
}

module.exports = {
  Maybe: exportMaybe,
}
```

#### Method `fork`

Here enters the prized method of the `Maybe` monad given above: `fork`.

`fork` is a method in two places here: in `Just` and `Nothing`

One quick side note: not all `Maybe` monad implementations will have a `fork`, but handle `Nothing` in other ways.

```js
// Just
fork: (_, g) => g(x),

// Nothing
fork: (f, _) => f(x)
```

Right away you might see something odd. `_` is a style choice often used in functional programming to indicate where we know there will be a value passed, but we plan not to use it. It is like the opposite of a placeholder.

### Usage

To give an example where this would be useful, let's have system that reads a temperature in Fahrenheit and gives it out in Celsius.

```js
const { Maybe } = require('./Maybe')

const reading1 = 15
const reading2 = null

const fahrenheitToCelsius = (a) => (a - 32) * 0.5556

const temp1C = Maybe.of(reading1).map(fahrenheitToCelsius)
console.log(temp1C.inspect()) // => Just(-9.4444)

const temp2C = Maybe.of(reading2).map(fahrenheitToCelsius)
console.log(temp2C.inspect()) // => Nothing()
```

Then we could write a `display` function to expose our values:

```js
const display = (a) => {
  console.log(a)
  return a
}

Maybe.of(reading1)
  .map(fahrenheitToCelsius)
  .fork(
    (_) => display('ERR!'),
    (t) => display(`${t}°C`) // will read `-9.4452°C`
  )

Maybe.of(reading2)
  .map(fahrenheitToCelsius)
  .fork(
    (_) => display('ERR!'), // will read `ERR!`
    (t) => display(`${t}°C`)
  )
```

Finally we would have a `temp3C` function as below:

```js
const temp3C = Maybe.of(reading1)
  .map(fahrenheitToCelsius)
  .fork(
    (_) => display('ERR!'),
    (t) => display(`${t}°C`)
  )

console.log(temp3C) // => "-9.4452°C"
```

Right away we have a problem: for function `fahrenheitToCelsius` to work, we need `a` to be a `number`. Since `reading2` is `null` (maybe a dead thermometer?), Javascript will cast `null` to `0`, giving a constant `false` reading of `-17.7792`.

However, since we have encapsulated in a `Maybe` monad we only have two possibilities: a real number (`Just`, as in "just a value"), and no value at all (`Nothing`).

### Credits

From the article [Building Expressive Monads in Javascript: Introduction](https://dev.to/rgeraldporter/building-expressive-monads-in-javascript-introduction-23b) written by [@rgeraldporter](https://github.com/rgeraldporter)
[Try on Repl.it](https://replit.com/@rgeraldporter/Maybe-Monad-Example)

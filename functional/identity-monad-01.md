# Functional Programming

## Identity Monad

A monad is best thought of as a container of a value: much like how the container-like types `Array` and `Object` can hold a collection of values, a monad does the same.

Each monad you build is like building a new kind of container-like type. As `Array` has methods like `forEach`, and as `Object` has methods like keys, a monad will have standard methods, and methods you can add on a case-by-case basis.

We're assigning our function expression to our `const`, which can be referred to as a _Constant Function Expression (CFE)_. They prevent anyone ever meddling with the function prototypes.

```js
const Identity = (x) => ({
  emit: () => x,
  chain: (f) => f(x),
  map: (f) => Identity(f(x)),
  inspect: () => `Identity(${x})`,
  of: (x) => Identity(x),
})

// example use:
const one = Identity(1)
```

#### Method: `emit`

Alternative names: `join`, `value`, `valueOf`

This is the simplest method, that just returns the value contained within.

```js
console.log(one.emit()) // => 1
```

#### Method: `chain`

Alternative names: `flatMap`, `bind`

The next simplest method is `chain`, which is intended to chain various monads together, but can operate as demonstrated above.

`f => f(x)` indicates a function `f` is taken, and value `x` is passed to said function. In this example, `a => a + 1` takes the value, returns it plus one.

```js
console.log(one.chain((a) => a + 1)) //=> 2
```

A more typical usage may be:

```js
one.chain((a) => SomeMonad(a + 1))
```

Where `SomeMonad` is a monad. In this `chain`, we transform `Identity(1)` into `SomeMonad(2)`. When you are using `chain`, typically you're indicating that the function you are passing in either will itself return a monad (preventing recursive monad-inside-monad-inside-monad...) or that you intend for the result to be non-monadic.

#### Method: `map`

Alternative name: `fmap` ("functional map")

`map` is the most important method. This is what makes monads so useful: we can take an established monad `Identity(1)` and through a function, generate `Identity(2)` without any mutation of our example constant one.

Put simply, it is the `chain` function with a built-in rewrapping of the resulting value into a new `Identity`, which itself can be subject to `map`, `chain`, and `emit` on and on for as many functions you'd like to apply to it.

The initial value of a monad is like a new bank account being opened with an initial deposit, each `map` or `chain` is a transaction atop it. Nothing will ever change the value of the initial deposit, but we have methods to figure out how much remains in the account today.

```js
console.log(one.map((a) => a + 1))
// => [not pretty: outputs monad defintion]
```

#### Method: `inspect`

Alternative name: `value`, `getValue`

While not strictly required to make a monad work correctly, `inspect` can help inform us via the console what exactly is in the monad, and what type of monad it is.

```js
const one = Identity(1)
const two = one.map((a) => a + 1)

console.log(two.inspect()) // => Identity(2)
```

#### Method: `of`

Alternative name: `value`, `getValue`

In all the examples above I have been calling directly `Identity`. Typically, however, there is a constructor method. In JS, the convention is to add an `of` constructor.

```js
const one = Identity.of(1)

console.log(one.inspect()) // => Identity(1)
```

We could also handle this using import/export, as such:

```js
import { Identity } from './Identity.js'

// you might do type-checking here
const IdentityOf = (x) => Identity(x)

const exportIdentity = {
  of: IdentityOf,
}

// or module.exports
export { exportIdentity as Identity }
```

### Credits

From the article [Building Expressive Monads in Javascript: Introduction](https://dev.to/rgeraldporter/building-expressive-monads-in-javascript-introduction-23b) written by [@rgeraldporter](https://github.com/rgeraldporter)
[Try on Repl.it](https://replit.com/@rgeraldporter/Identity-Monad-Example)

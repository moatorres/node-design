A monad is a way of composing functions that require context in addition to the return value, such as `map(a→b)` flatten computation, branching, or effects. Monads `map M(a) → M(b)` and flatten `M(M(a)) → M (a)`, so that the types line up for type lifting functions like `a → M (b)`, and `b −→ M (c)`, making them composable.

- Functions can compose
  `a => b => c` becomes `a => c`
- Functors can compose functions with context
  given `F(a)` and two functions, `a => b => c` return `F(c)`
- Monads can compose type lifting functions
  `a → M(b)` → `b → M(c)` becomes `a → M(c)`

#### But what do `flatten`, `map` and `context` mean?

- ##### `Map` means, “apply a function to an a and return a b”
  Given some input, return some output. The functor map operation does that inside the context of a container called a functor data type, which returns a new container with the results.
- ##### `Context` is the computational detail of the monad
  The functor or monad supplies some computation to be performed during the mapping process, such as iterating over a list of things, or waiting for a future value to resolve. The point of **functors** and **monads** is to _abstract that context away so we don’t have to worry about it while we’re composing operations_. Mapping inside the context means that you apply a function from `a => b` or `a → Monad(b)` to the values inside the context, and return new values of type `b` wrapped inside the same kind of context. Observables on the left? Observables on the right: `Observable(a) → Observable(b)`. `Array`s on the left side? `Array`s on the right side: `Array(a) → Array(b)`
- ##### `Type lift` means to lift a type into a context
  Wrapping values inside a data type that supplies the computational context `a → M(a)`
- ##### `Flatten` can be used to unwrap an extra layer of context
  That might be added by applying a type lifting function using a functor `map` operation. If you map a function of type `a → M(b)` with the functor `map` operation, it will return a value of type `M(M(b))`. Flatten unwraps the extra layer of context: `M(M(b)) → M(b)`. Monads are not required to directly expose a flatten operation. It happens automatically inside `flatMap`.
- ##### `FlatMap` is the operation that defines a monad
  It combines `map` and `flatten` into a single operation used to compose type lifting functions `(a => M(b))`

Example of a functor context in JavaScript:

```js
const x = 20
const f = (n) => n * 2
const arr = Array.of(x)

const result = arr.map(f) //[40]
```

In this case, `Array` is the context, and `x` is the value we’re mapping over. But what if we have a function that takes a value and returns an array of values? For example, this `echo()` function will take a value and repeat it `n` times:

```js
const echo = (n) => (x) => Array.from({ length: n }).fill(x)
```

Using `map()` with this, we’ll end up with an array of arrays:

```js
const echo = (n) => (x) => Array.from({ length: n }).fill(x)

console.log([1, 2, 3].map(echo(3)))
// => [ [ 1, 1, 1 ], [ 2, 2, 2 ], [ 3, 3, 3 ] ]
```

That’s fine if that’s what you’re looking for, but what if you want an array of numbers instead of an array of arrays of numbers? `flatMap` to the rescue.

```js
const echo = (n) => (x) => Array.from({ length: n }).fill(x)

console.log([1, 2, 3].flatMap(echo(3)))
// => [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ]
```

Here’s a more concrete example. What if you need to fetch a user from an asynchronous API, and then pass that user data to another asynchronous API to perform some calculation?

```js
getUserById(id: String) => Promise(User)
hasPermision(User) => Promise(Boolean)
```

Let’s write some functions to demonstrate the problem. First, the utilities, `compose()` and `trace()`:

```js
const compose = (...fns) => (x) => fns.reduceRight((y, f) => f(y), x)

const trace = (label) => (value) => {
  console.log(`${label}: ${value}`)
  return value
}
```

Then some functions to compose:

```js
const label = 'API call composition'

// a => Promise(b)
const getUserById = (id) =>
  id === 3 ? Promise.resolve({ name: 'Kurt', role: 'Author' }) : undefined

// b => Promise(c)
const hasPermission = ({ role }) => Promise.resolve(role === 'Author')
```

When we try to compose `hasPermission()` with `getUserById()` to form `authUser()` we run into a big problem because `hasPermission()` is expecting a `User` object and getting a `Promise(User)` instead.

```js
// warning: this will fail
const authUser = compose(hasPermission, getUserById)

// oops, always false
authUser(3).then(trace(label))
```

To fix this, we need to swap out `compose()` for `composePromises()` — a special version of compose that knows it needs to use `.then()` to accomplish the function composition:

```js
const composeM = (flatMap) => (...ms) =>
  ms.reduce((f, g) => (x) => g(x)[flatMap](f))

const composePromises = composeM('then')
const label = 'API call composition'

// a => Promise(b)
const getUserById = (id) =>
  id === 3 ? Promise.resolve({ name: 'Kurt', role: 'Author' }) : undefined

// b => Promise(c)
const hasPermission = ({ role }) => Promise.resolve(role === 'Author')
```

That works:

```js
// compose the functions (this works!)
const authUser = composePromises(hasPermission, getUserById)

authUser(3).then(trace(label)) // true
```

### What Monads are Made of

A monad is based on a simple symmetry:

- #### `of`

  A type lift `a => M(a)`

- #### `map`

  The application of a function `a => M(b)` inside the monad context, which yields `M(M(b))`

- #### `flatten`
  The unwrapping of one layer of monadic context: `M(M(b)) => M(b)`

Combine `map` with `flatten`, and you get `flatMap` — function composition for monad-lifting functions, aka _Kleisli_ composition, named after Heinrich Kleisli:

- #### `flatMap`
  `map` plus `flatten` equals `f(a).flatMap(g) = M(c)`

For monads, `.map()` and `.flatten()` methods are often omitted from the public API, and instead are part of the `flatMap` operation. If you can lift `.of()` and `flatMap` - also known as `chain`, `bind` and `then` - you can make `.map()`:

```js
const Monad = (value) => ({
  flatMap: (f) => f(value),
  map(f) {
    return this.flatMap((a) => Monad.of(f(a)))
  },
})

Monad.of = (x) => Monad(x)

Monad(21)
  .map((x) => x * 2)
  .map((x) => console.log(x))
```

So, if you define `.of()` and `.flatMap()` for your monad, you can infer the definition of `.map()`.

The lift is the factory/constructor and/or `constructor.of()` method. In category theory, it’s called “unit”. All it does is lift the type into the context of the monad. It turns an `a` into a Monad `of` `a`.

```js
const composeMap = (...ms) => ms.reduce((f, g) => (x) => g(x).map(f))

const trace = (label) => (value) => {
  console.log(`${label}: ${value}`)
  return value
}

// kleisli composition function
const composeM = (method) => (...ms) =>
  ms.reduce((f, g) => (x) => g(x)[method](f))

const composePromises = composeM('then')
const composeMap = composeM('map')
const composeFlatMap = composeM('flatMap')

const Id = (value) => ({
  map: (f) => Id.of(f(value)),
  flatMap: (f) => f(value),
  toString: () => `Id(${value})`,
})

Id.of = Id

const g = (n) => Id(n + 1)
const f = (n) => Id(n * 2)

// Left identity
trace('Id monad left identity')([Id(x).flatMap(f), f(x)])

// Right identity
trace('Id monad right identity')([Id(x).flatMap(Id.of), Id(x)])

// Associativity
trace('Id monad associativity')([
  Id(x).flatMap(g).flatMap(f),
  Id(x).flatMap((x) => g(x).flatMap(f)),
])
```

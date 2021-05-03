# Design Patterns

## Functional Mixin

**Functional mixins** are _composable factory functions which connect together in a pipeline_. Each function adds some properties or behaviors like workers on an assembly line.

Functional mixins **don’t depend on or require a base factory or constructor**: we can pass any arbitrary object into a mixin, and an enhanced version of that object will be returned.

Functional mixin features:

- Data privacy/encapsulation
- Inheriting private state
- Inheriting from multiple sources
- No diamond problem (property collision ambiguity) – last in wins
- No base-class requirement

### **Mixins** are a form of object composition, where _component features get mixed into a composite object_ so that properties of each mixin become properties of the composite object.

Because JavaScript supports **dynamic object extension and objects without classes**, using object mixins is trivially easy in JavaScript – so much so that it is the most common form of inheritance in JavaScript by a huge margin. Let’s look at an example:

```js
const chocolate = { hasChocolate: () => true }
const caramelSwirl = { hasCaramelSwirl: () => true }
const pecans = { hasPecans: () => true }

const iceCream = Object.assign({}, chocolate, caramelSwirl, pecans)
// or: const iceCream = { ...chocolate, ...caramelSwirl, ...pecans }

console.log(`
  hasChocolate: ${iceCream.hasChocolate()}
  hasCaramelSwirl: ${iceCream.hasCaramelSwirl()}
  hasPecans: ${iceCream.hasPecans()}
`)
```

### What is functional inheritance?

Functional inheritance is the process of inheriting features by applying an augmenting function to an object instance. The function supplies a closure scope which you can use to keep some data private. The augmenting function uses dynamic object extension to extend the object instance with new properties and methods.

```js
// base factory
function base(spec) {
  var that = {} // create an empty object
  that.name = spec.name // add it a 'name' prop
  return that // return the object
}

// build a child object, inheriting from 'base'
function child(spec) {
  var that = base(spec) // create the object through the 'base' constructor
  that.sayHello = function () {
    // augment that object
    return "Hello, I'm " + that.name
  }
  return that // return it
}

// usage
var result = child({ name: 'a functional object' })
console.log(result.sayHello())
// => 'Hello, I'm a functional object'
```

Because `child()` is tightly coupled to `base()`, when you add `grandchild()`, `greatGrandchild()`, etc..., you’ll opt into most of the common problems from class inheritance.

### What is a functional mixin?

**Functional mixins** are composable _functions which mix new properties or behaviors into existing objects_.

```js
const flying = (o) => {
  let isFlying = false
  return Object.assign({}, o, {
    fly() {
      isFlying = true
      return this
    },
    isFlying: () => isFlying,
    land() {
      isFlying = false
      return this
    },
  })
}

const bird = flying({})

console.log(bird.isFlying()) // => false
console.log(bird.fly().isFlying()) // => true
```

Notice that when we call `flying()`, we need to pass an object in to be extended. Functional mixins are designed for function composition. Let’s create something to compose with:

```js
const quacking = (quack) => (o) => Object.assign({}, o, { quack: () => quack })

const quacker = quacking('Quack!')({})

console.log(quacker.quack()) // => 'Quack!'
```

### Composing Functional Mixins

Functional mixins can be composed with simple function composition:

```js
const createDuck = (quack) => quacking(quack)(flying({}))

const duck = createDuck('Quack!')

console.log(duck.fly().quack())
```

That looks a little awkward to read, though. It can also be a bit tricky to debug or re-arrange the order of composition.

Of course, this is standard function composition, and we already know some better ways to do that using `compose()` or `pipe()`. If we use `pipe()` to reverse the function order, the composition will read like `Object.assign({}, ...)` or `{ ...object, ...spread }` – preserving the same order of precedence. In case of property collisions, the last object in wins.

```js
const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x)

const createDuck = (quack) => pipe(flying, quacking(quack))({})

const duck = createDuck('Quack!')

console.log(duck.fly().quack())
```

### When to Use Functional Mixins

You should always use the simplest possible abstraction to solve the problem you’re working on. Start with a pure function. If you need an object with persistent state, try a factory function. If you need to build more complex objects, try functional mixins.

Here are some good use-cases for functional mixins:

- Application state management, e.g., something similar to a Redux store.
- Certain cross-cutting concerns and services, e.g., a centralized logger.
- Composable functional data types, e.g., the JavaScript `Array` type implements `Semigroup`, `Functor`, `Foldable`... Some algebraic structures can be derived in terms of other algebraic structures, meaning that certain derivations can be composed into a new data type without customization.

Like class inheritance, functional mixins can cause problems of their own. In fact, it’s possible to faithfully reproduce all of the features and problems of class inheritance using functional mixins.

You can avoid that, though, using the following advice:

- Favor pure `functions` > `factories` > `mixins` > `classes`
- Avoid the creation of **is-a** relationships between objects, mixins, or data types
- Avoid implicit dependencies between mixins – wherever possible, functional mixins should be self-contained, and have no knowledge of other mixins
- “Functional mixins” doesn’t mean “functional programming”
- There may be side-effects when you access a property using `Object.assign()` or object spread syntax `({ ...object })`. You’ll also skip any non-enumerable properties. ES2017 added `Object.getOwnPropertyDescriptors() `to get around this problem.

Rely mostly on **function composition to compose behavior and application structure, and only rarely use functional mixins**. Never use class inheritance unless we're inheriting directly from a third-party base class such as React.Class. Never build our own inheritance hierarchies.

### Implicit Dependencies

You may be tempted to create functional mixins designed to work together. Imagine you want to build a configuration manager for your app that logs warnings when you try to access configuration properties that don’t exist.
It’s possible to build it like this:

```js
// in its own module...
const withLogging = (logger) => (o) =>
  Object.assign({}, o, {
    log(text) {
      logger(text)
    },
  })

// in a different module with no explicit mention of withLogging -- we just assume it's there
const withConfig = (config) => (
  o = {
    log: (text = '') => console.log(text),
  }
) =>
  Object.assign({}, o, {
    get(key) {
      return config[key] == undefined
        ? // vvv implicit dependency here... oops! vvv
          this.log(`Missing config key: ${key}`)
        : // ^^^ implicit dependency here... oops! ^^^
          config[key]
    },
  })

// in yet another module that imports withLogging and withConfig
const createConfig = ({ initialConfig, logger }) =>
  pipe(withLogging(logger), withConfig(initialConfig))({})
// elsewhere
const initialConfig = {
  host: 'localhost',
}

const logger = console.log.bind(console)
const config = createConfig({ initialConfig, logger })
console.log(config.get('host')) // => 'localhost'
config.get('notThere') // => 'Missing config key: notThere'
```

However, it’s also possible to build it like this:

```js
// import withLogging() explicitly in withConfig module
import withLogging from './with-logging'
const addConfig = (config) => (o) =>
  Object.assign({}, o, {
    get(key) {
      return config[key] == undefined
        ? this.log(`Missing config key: ${key}`)
        : config[key]
    },
  })

const withConfig = ({ initialConfig, logger }) => (o) =>
  pipe(
    // compose explicit dependency here
    withLogging(logger),
    addConfig(initialConfig)
  )(o)

// the factory only needs to know about withConfig now
const createConfig = ({ initialConfig, logger }) =>
  withConfig({ initialConfig, logger })({})

// elsewhere, in a different module
const initialConfig = {
  host: 'localhost',
}

const logger = console.log.bind(console)
const config = createConfig({ initialConfig, logger })

console.log(config.get('host')) // => 'localhost'

config.get('notThere') // => 'Missing config key: notThere'
```

The correct choice depends on a lot of factors. It is valid to require a lifted data type for a functional mixin to act on, but if that’s the case, the API contract should be made explicitly clear in the function signature and API documentation.

That’s the reason that the implicit version has a default value for `o` in the signature. Since JavaScript lacks type annotation capabilities, we can fake it by providing default values:

```js
const withConfig = config => (o = {
  log: (text = '') => console.log(text)
}) => Object.assign({}, o, {
  // ...
```

If you’re using TypeScript or Flow, it’s probably better to declare an explicit interface for your object requirements.

### Functional Mixins & Functional Programming

“Functional” in the context of functional mixins does not always have the same purity connotations as “functional programming”. Functional mixins are commonly used in OOP style, complete with side-effects. Many functional mixins will alter the object argument you pass to them. Caveat emptor.
By the same token, some developers prefer a functional programming style, and will not maintain an identity reference to the object you pass in. You should code your mixins and the code that uses them assuming a random mix of both styles.
That means that if you need to return the object instance, always return this instead of a reference to the instance object in the closure -- in functional code, chances are those are not references to the same objects. Additionally, always assume that the object instance will be copied by assignment using `Object.assign()` or `{...object, ...spread}` syntax. That means that if you set non-enumerable properties, they will probably not work on the final object:

```js
const a = Object.defineProperty({}, 'a', {
  enumerable: false,
  value: 'a',
})
const b = {
  b: 'b',
}

console.log({ ...a, ...b }) // => { b: 'b' }
```

By the same token, if you’re using functional mixins that you didn’t create in your functional code, don’t assume the code is pure. Assume that the base object may be mutated, and assume that there may be side-effects & no referential transparency guarantees, i.e., it is frequently unsafe to memoize factories composed of functional mixins.

### Credits

From the book [Composing Software](https://www.amazon.com/Composing-Software-Exploration-Programming-Composition/dp/1661212565) written by [@ericelliott](https://github.com/ericelliott)

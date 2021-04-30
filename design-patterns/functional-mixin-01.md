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


### Credits

From the book [Composing Software](https://www.amazon.com/Composing-Software-Exploration-Programming-Composition/dp/1661212565) written by [@ericelliott](https://github.com/ericelliott)

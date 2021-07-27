# Design Patterns

## Method Decorator

Writing **higher-order** functions in JavaScript is a long-established practice:

#### A higher-order function is a function that takes one or more functions as arguments, returns a function, or both.

For example, compose is a higher-order function that takes two functions as arguments, and returns a function that represents the composition of the arguments:

```js
const compose = (a, b) => (c) => a(b(c))
```

A particularly interesting subset of higher-order functions are higher-order functions that _decorate_ a function. **Function Decorators** take a function as and argument, and return a new function that has semantically similar behaviour, but is “decorated” with some additional functionality.

For example, this very simple `maybe` function is a function decorator. It takes a function as an argument, and returns a version of that function that returns **undefined** or **null** (without any side-effects) if any of its arguments are `undefined` or `null`:

```js
const maybe = (fn) => (...args) => {
  for (let arg of args) {
    if (arg == null) return arg
  }
  return fn(...args)
}

const arr = [1, null, 3, 4, null, 6, 7].map(maybe((x) => x * x))

console.log(arr) // => [ 1, null, 9, 16, null, 36, 49 ]
```

Now let's consider, for example the `Person` class:

```js
class Person {
  setName(first, last) {
    this.firstName = first
    this.lastName = last
    return this
  }
  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}

const thinker = new Person().setName('Albert', 'Einstein')
thinker.fullName() // => 'Albert Einstein'

thinker.setName('Marie', 'Curie')
thinker.fullName() // => 'Marie Curie'
```

##### Methods are functions that are used to define the behaviour of instances. When a function is invoked as a method, the name `this` is bound to the instance, and most methods rely on that binding to work properly.

We can write a similar decorator, `requireAll`, that will throw an exception if a function is invoked without at least as many arguments as declared parameters:

```js
const requireAll = (fn) =>
  function (...args) {
    if (args.length < fn.length) throw new Error('Missing required arguments')
    else return fn.apply(this, args)
  }
```

Let’s see what happens when we decorate it with `requireAll`:

```js
Object.defineProperty(Person.prototype, 'setName', {
  value: requireAll(Person.prototype.setName),
})

const thinker = new Person().setName('Prince')
// => Missing required arguments
```

### Stateful Method Decorators

If we **don’t need to use the same decorator for functions and for methods**, we can write our decorator to use a `WeakSet` to track whether a method has been invoked for an instance:

```js
const onceForMethods = (fn) => {
  let invocations = new WeakSet()

  return function (...args) {
    if (invocations.has(this)) return
    invocations.add(this)
    return fn.apply(this, args)
  }
}
```

#### Usage

```js
Object.defineProperty(Person.prototype, 'setName', {
  value: onceForMethods(Person.prototype.setName),
})

const musician = new Person().setName('Miles', 'Davis')
musician.setName('Frank', 'Sinatra') // fails silently

const logician = new Person().setName('Xuxa', 'Meneghel')
logician.setName('Angélica', 'Huck') // fails silently

console.log(musician.fullName()) // => Miles Davis
console.log(logician.fullName()) // => Xuxa Meneghel
```

Now each instance stores whether `.setName` has been invoked on each instance a `WeakSet`, so `logician` and `musician` can share the method without sharing its state.

### Incompatibility

To handle methods, we have introduced “accidental complexity” to handle `this` and to handle state. If we hadn’t invoked it as a method, `this` would be bound to `undefined` in strict mode, and `undefined` cannot be added to a `WeakSet`.

Correcting our decorator to deal with `undefined` is straightforward:

```js
const onceForFunctions = (fn) => {
  let invocations = new WeakSet(),
    undefinedContext = Symbol('undefined-context')

  return function (...args) {
    const context = this === undefined ? undefinedContext : this

    if (invocations.has(context)) return
    invocations.add(context)
    return fn.apply(this, args)
  }
}
```

#### Usage

```js
const hello = onceForFunctions(() => 'hello!')

log(hello()) // => hello!
log(hello()) // => undefined
```

### The bottom line

In the end, we can either write specialized decorators designed specifically for methods, or tolerate the additional complexity of trying to handle method invocation and function invocation in the same decorator.

### Credits

From the article [Method Decorators in ECMAScript 2015 (and beyond)](http://raganwald.com/2015/06/28/method-decorators.html) written by [@raganwald](https://github.com/raganwald)

# Design Patterns

## Functional Mixin

In JavaScript, a “class” is implemented as a constructor function and its prototype, whether you write it directly, or use the `class` keyword. Instances of the class are created by calling the constructor with `new`. They “inherit” shared behaviour from the constructor’s `prototype` property.

### Object Mixin pattern

One way to share behaviour scattered across multiple classes, or to untangle behaviour by factoring it out of an overweight prototype, is to extend a prototype with a mixin.

Here’s a class of todo items:

```js
class Todo {
  constructor(name) {
    this.name = name || 'Untitled'
    this.done = false
  }
  do() {
    this.done = true
    return this
  }
  undo() {
    this.done = false
    return this
  }
}
```

And a “mixin” that is responsible for colour-coding:

```js
const Coloured = {
  setColourRGB({ r, g, b }) {
    this.colourCode = { r, g, b }
    return this
  },
  getColourRGB() {
    return this.colourCode
  },
}
```

Mixing colour coding into our `Todo` prototype is straightforward:

```js
Object.assign(Todo.prototype, Coloured)

new Todo('test').setColourRGB({ r: 1, g: 2, b: 3 })
// => {"name":"test","done":false,"colourCode":{"r":1,"g":2,"b":3}}
```

We can “upgrade” it to have a **private property** if we wish:

```js
const colourCode = Symbol('colourCode')

const Coloured = {
  setColourRGB({ r, g, b }) {
    this[colourCode] = { r, g, b }
    return this
  },
  getColourRGB() {
    return this[colourCode]
  },
}
```

So far, very easy and very simple. This is a pattern, a recipe for solving a certain problem using a particular organization of code.

### Functional Mixin

The object mixin we have above works properly, but our little recipe had two distinct steps:

- Define the mixin
- and **then extend** the class prototype.

Angus Croll pointed out that it’s more elegant to define a **mixin as a function rather than an object**. Here’s `Coloured` again, recast in functional form:

```js
const Coloured = (target) =>
  Object.assign(target, {
    setColourRGB({ r, g, b }) {
      this.colourCode = { r, g, b }
      return this
    },
    getColourRGB() {
      return this.colourCode
    },
  })

Coloured(Todo.prototype)
```

We can make ourselves a factory function that also names the pattern:

```js
const FunctionalMixin = (behaviour) => (target) =>
  Object.assign(target, behaviour)
```

This allows us to define functional mixins neatly:

```js
const Coloured = FunctionalMixin({
  setColourRGB({ r, g, b }) {
    this.colourCode = { r, g, b }
    return this
  },
  getColourRGB() {
    return this.colourCode
  },
})
```

### Enumerability

If we look at the way `class` defines prototypes, we find that the methods defined are not enumerable by default. This works around a common error where programmers iterate over the keys of an instance and fail to test for `.hasOwnProperty`.

Our object mixin pattern does not work this way, the methods defined in a mixin are enumerable by default, and if we carefully defined them to be non-enumerable, `Object.assign` wouldn’t mix them into the target prototype, because `Object.assign` only assigns enumerable properties.

And thus:

```js
Coloured(Todo.prototype)

const urgent = new Todo('finish blog post')

urgent.setColourRGB({ r: 256, g: 0, b: 0 })

for (let property in urgent) console.log(property)

// =>
// name
// done
// colourCode
// setColourRGB
// getColourRGB
```

As we can see, the `setColourRGB` and `getColourRGB` methods are enumerated, although the `do` and `undo` methods are not. This can be a problem with naïve code: we can’t always rewrite all the other code to carefully use `.hasOwnProperty`.

One benefit of functional mixins is that we can solve this problem and transparently make mixins behave like `class`:

```js
const FunctionalMixin = (behaviour) =>
  function (target) {
    for (let property of Reflect.ownKeys(behaviour))
      Object.defineProperty(target, property, { value: behaviour[property] })
    return target
  }
```

##### Writing this out as a pattern would be tedious and error-prone. Encapsulating the behaviour into a function is a small win.

### mixin responsibilities

Like classes, mixins are metaobjects: They define behaviour for instances. In addition to defining behaviour in the form of methods, classes are also responsible for initializing instances. But sometimes, classes and metaobjects handle additional responsibilities.

For example, sometimes a particular concept is associated with some well-known constants. When using a class, can be handy to namespace such values in the class itself:

```js
class Todo {
  constructor(name) {
    this.name = name || Todo.DEFAULT_NAME
    this.done = false
  }
  do() {
    this.done = true
    return this
  }
  undo() {
    this.done = false
    return this
  }
}

Todo.DEFAULT_NAME = 'Untitled'

// If we are sticklers for read-only constants, we could write:
// Object.defineProperty(Todo, 'DEFAULT_NAME', {value: 'Untitled'});
```

We can’t really do the same thing with simple mixins, because all of the properties in a simple mixin end up being mixed into the prototype of instances we create by default. For example, let’s say we want to define Coloured.RED, Coloured.GREEN, and Coloured.BLUE. But we don’t want any specific coloured instance to define RED, GREEN, or BLUE.

Again, we can solve this problem by building a functional mixin. Our `FunctionalMixin` **factory function** will accept an optional _dictionary of read-only mixin properties, provided they are associated with a special key_:

```js
const shared = Symbol('shared')

function FunctionalMixin(behaviour) {
  const instanceKeys = Reflect.ownKeys(behaviour).filter(
    (key) => key !== shared
  )

  const sharedBehaviour = behaviour[shared] || {}

  const sharedKeys = Reflect.ownKeys(sharedBehaviour)

  function mixin(target) {
    for (let property of instanceKeys)
      Object.defineProperty(target, property, { value: behaviour[property] })
    return target
  }

  for (let property of sharedKeys)
    Object.defineProperty(mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property),
    })

  return mixin
}

FunctionalMixin.shared = shared
```

And now we can write:

```js
const Coloured = FunctionalMixin({
  setColourRGB({ r, g, b }) {
    this.colourCode = { r, g, b }
    return this
  },
  getColourRGB() {
    return this.colourCode
  },
  [FunctionalMixin.shared]: {
    RED: { r: 255, g: 0, b: 0 },
    GREEN: { r: 0, g: 255, b: 0 },
    BLUE: { r: 0, g: 0, b: 255 },
  },
})

Coloured(Todo.prototype)

const urgent = new Todo('finish blog post')

urgent.setColourRGB(Coloured.RED)
urgent.getColourRGB() // => { "r": 255, "g": 0, "b": 0 }
```

### Mixin Methods

Such properties need not be values. Sometimes, classes have methods. And likewise, sometimes it makes sense for a mixin to have its own methods. One example concerns `instanceof`.

In earlier versions of ECMAScript, `instanceof` is an operator that checks to see whether the prototype of an instance matches the prototype of a `constructor` function. It works just fine with “classes,” but it does not work “out of the box” with mixins:

```js
urgent instanceof Todo // => true
```

```js
urgent instanceof Coloured // => false
```

To handle this and some other issues where programmers are creating their own notion of dynamic types, or managing prototypes directly with `Object.create` and `Object.setPrototypeOf`, ECMAScript 2015 provides a way to override the built-in `instanceof` behaviour:

An object can define a method associated with a well-known symbol, `Symbol`.`hasInstance`.

We can test this quickly. Of course, that is not semantically correct:

```js
Object.defineProperty(Coloured, Symbol.hasInstance, {
  value: (instance) => true,
})
```

```js
urgent instanceof Coloured // => true
```

```js
{} instanceof Coloured // => true
```

But using this technique, we can write:

```js
const shared = Symbol('shared')

function FunctionalMixin(behaviour) {
  const instanceKeys = Reflect.ownKeys(behaviour).filter(
    (key) => key !== shared
  )

  const sharedBehaviour = behaviour[shared] || {}

  const sharedKeys = Reflect.ownKeys(sharedBehaviour)

  const typeTag = Symbol('isA')

  function mixin(target) {
    for (let property of instanceKeys) {
      Object.defineProperty(target, property, { value: behaviour[property] })
      target[typeTag] = true
    }

    return target
  }

  for (let property of sharedKeys)
    Object.defineProperty(mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property),
    })

  Object.defineProperty(mixin, Symbol.hasInstance, {
    value: (instance) => !!instance[typeTag],
  })

  return mixin
}

FunctionalMixin.shared = shared
```

```js
urgent instanceof Coloured // => true
```

```js
{} instanceof Coloured // => false
```

Do you need to implement `instanceof`? Quite possibly not. “Rolling your own polymorphism” is usually a last resort. But it can be handy for writing test cases, and a few daring framework developers might be working on multiple dispatch and pattern-matching for functions.

### Summary

The charm of the object mixin pattern is its simplicity: It really does not need an abstraction wrapped around an object literal and `Object.assign`.

However, behaviour defined with the mixin pattern is slightly different than behaviour defined with the `class` keyword. Two examples of these differences are enumerability and mixin properties (such as constants and mixin methods like `[Symbol.hasInstance]`).

Functional mixins provide an opportunity to implement such functionality, at the cost of some complexity in the `FunctionalMixin` function that creates functional mixins.

As a general rule, **it’s best to have things behave as similarly as possible in the domain code**, and this sometimes does involve some extra complexity in the infrastructure code. But that is more of a guideline than a hard-and-fast rule, and for this reason there is a place for both the object mixin pattern and functional mixins in JavaScript.

### Credits

From the article [Functional Mixins in ECMAScript 2015](https://raganwald.com/2015/06/17/functional-mixins.html) written by [@raganwald](https://github.com/raganwald)

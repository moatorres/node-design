# Functional Programming

## Function Composition

### Why Composition is Harder with Classes

ES6 includes a convenient **class syntax**, so you may be wondering why we should care about factories at all. The most obvious difference is that constructors and class require the new keyword. But what does new actually do?

- Creates a new object and binds this to it in the constructor function
- Implicitly returns this, unless you explicitly return another object
- Sets the instance `[[Prototype]]`, `instance.__proto__` to `Constructor.prototype`, so that `Object.getPrototypeOf(instance) === Constructor.prototype` and `instance.__proto__ === Constructor.prototype`
- Sets the `instance.constructor === Constructor`

All of that implies that, unlike factory functions, classes are not a good solution for composing functional mixins. You can still achieve composition using class, but it’s a much more complex process, and as you’ll see, the additional costs are usually not worth the extra effort.

### The Delegate Prototype

In ES5, the `Constructor.prototype` link was dynamic and reconfigurable, which could be a handy feature if you need to create an abstract factory — but if you reassign the prototype, `instanceof` will give you false negatives if the `Constructor.prototype` does not currently reference the same object in memory that the instance `[[Prototype]]` references:

```js
class User {
  constructor({ userName, avatar }) {
    this.userName = userName
    this.avatar = avatar
  }
}

const currentUser = newUser({ userName: 'Foo', avatar: 'foo.png' })

User.prototype = {}

console.log(
  currentUser instanceof User, // => false -- Oops!
  currentUser // { avatar: "foo.png", userName: "Foo" }
)
```

Another problem with instanceof is that it is a nominal type check rather than a structural type check, which means that if you start with a class and later switch a factory, all the calling code using `instanceof` won’t understand new implementations even if they satisfy the same interface contract.

For example, say you’re tasked with building a music player interface. Later on the product team tells you to add support for videos. Later still, they ask you to add support for 360 videos.

They all supply the same controls: play, stop, rewind, fast forward. But if you’re using `instanceof` checks, members of your video interface class won’t satisfy the `foo instanceof AudioInterface` checks already in the codebase.

Sharable interfaces in other languages solve this problem by allowing a class to declare that it implements a specific interface. That’s not currently possible in JavaScript.

### The `.constructor` Property

The `.constructor` property is a rarely used feature in JavaScript, but it could be very useful, and it’s a good idea to include it on your object instances. It’s mostly harmless if you don’t try to use it for type checking (which is unsafe for the same reasons `instanceof` is unsafe).

In theory, `.constructor` could be useful to make generic functions which are capable of returning a new instance of whatever object you pass in.

Let's create an empty instance of a given object:

```js
// return an empty instance of any object type?
const empty = ({ constructor } = {}) =>
  constructor ? new constructor() : undefined

const foo = [10]

console.log(
  empty(foo) // []
)
```

It’s not safe to assume that you can use the `new` keyword with any factory function. Sometimes, that will cause errors. It seems to work with `Array`s. Let’s try it with `Promise`s:

```js
// return an empty instance of any object type?
const empty = ({ constructor } = {}) =>
  constructor ? new constructor() : undefined

const foo = Promise.resolve(10)

console.log(
  empty(foo) // TypeError: Promise resolver undefined is not a function
)
```

What we would need to make this work is **to have a standard way to pass a value into a new instance** using a standard factory function that doesn’t require `new`:

#### A static method on any factory or `constructor` called `.of()`

The `.of()` method is a factory that returns a new instance of the data type containing whatever you pass into `.of()`. We could use `.of()` to create a better version of the generic `empty()` function:

```js
// return an empty instance of any object type?
const empty = ({ constructor } = {}) =>
  constructor.of ? constructor.of() : undefined

const foo = [23]

console.log(
  empty(foo) // []
)
```

Unfortunately, the static `.of()` method is just beginning to gain support in JavaScript. The Promise object does have a static method that acts like `.of()`, but it’s called `.resolve()` instead, so our generic `empty()` won’t work with promises:

```js
// return an empty instance of any object type?
const empty = ({ constructor } = {}) =>
  constructor.of ? constructor.of() : undefined

const foo = Promise.resolve(10)

console.log(
  empty(foo) // undefined
)
```

Likewise, there’s no `.of()` for `strings`, `numbers`, `objects`, `maps`, `weak maps`, or `sets` in JavaScript as of this writing but it’s easy to add support for `.constructor` and `.of()` to a factory:

```js
const createUser = ({ userName = 'Anonymous', avatar = 'anon.png' } = {}) => ({
  userName,
  avatar,
  constructor: createUser,
})

createUser.of = createUser

// testing `.of` and `.constructor`
const empty = ({ constructor } = {}) =>
  constructor.of ? constructor.of() : undefined

const foo = createUser({ userName: 'Empty', avatar: 'me.png' })
console.log(
  empty(foo), // => { avatar: "anon.png", userName: "Anonymous" }
  foo.constructor === createUser.of, // => true
  createUser.of === createUser // => true
)
```

You can even make `.constructor` non-enumerable by adding to the delegate prototype:

```js
const createUser = ({ userName = 'Anonymous', avatar = 'anon.png' } = {}) => ({
  __proto__: {
    constructor: createUser,
  },
  userName,
  avatar,
})
```

### Factories allow increased flexibility

- Decouple instantiation details from calling code
- Allow you to return arbitrary objects — for instance, to use an object pool to tame the garbage collector
- Don’t pretend to provide any type guarantees, so callers are less tempted to use instanceof and other unreliable type checking measures, which might break code across execution contexts, or if you switch to an abstract factory
- Can dynamically swap implementations for abstract factories. e.g., a media player that swaps out the `.play()` method for different media types
- Adding capability with composition is easier with factories

#### **Warning**

Refactoring from a class to an arrow function factory might seem to work with a compiler, but if the code compiles the factory to a native arrow function, your app will break because you can’t use new with arrow functions.

JavaScript’s factory functions provide a friendlier syntax out of the box, with much less complexity. Often, an object literal is good enough. If you need to create many instances, factories are a good next step.

### Credits

From the book [Composing Software](https://www.amazon.com/Composing-Software-Exploration-Programming-Composition/dp/1661212565) written by [@ericelliott](https://github.com/ericelliott)

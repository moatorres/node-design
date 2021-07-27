# Design Patterns

## Factory Function

### Prototypes vs. Classes

The most important difference between `class` and prototype-based inheritance is that **a `class` defines a type which can be instantiated at runtime**, whereas a **prototype is itself an object instance**.

A **child of an ES6 class** is another type definition which **extends the parent** with new properties and methods, which in turn can be instantiated at runtime.

A **child of a prototype** is another object **instance which delegates to the parent any properties that aren’t implemented on the child**.

A **child of a prototype** isn’t a copy of its `prototype`, nor is it an object with the same shape as its `prototype`. **The child has a living reference to the prototype**, and any prototype property that doesn’t exist on the child is a one-way reference to a property of the same name on the prototype.

```js
let parent = { foo: 'foo' }
let child = {}

Object.setPrototypeOf(child, parent)
console.log(child.foo) // 'foo'

child.foo = 'bar'
console.log(child.foo) // 'bar'
console.log(parent.foo) // 'foo'

delete child.foo
console.log(child.foo) // 'foo'

parent.foo = 'baz'
console.log(child.foo) // 'baz'
```

While `child.foo` was `undefined`, it referenced `parent.foo`. As soon as we defined `foo` on `child`, `child.foo` had the value `'bar'`, but `parent.foo` retained its original value. Once we delete `child.foo` it again refers to `parent.foo`, which means that when we change the parent’s value, `child.foo` refers to the new value.

### How Do You Implement Privacy in Classes?

JavaScript doesn’t have any concept of privacy, but it does have closures:

```js
function SecretiveProto() {
  const secret = 'The Class is a lie!'

  // using `this` will make this public
  this.spillTheBeans = function () {
    console.log(secret)
  }
}

// functions with `this` are called with the `new` keyword
const blabbermouth = new SecretiveProto()

console.log(blabbermouth.secret)
// => TypeError: SecretiveClass.secret is not defined

blabbermouth.spillTheBeans()
// => "The Class is a lie!"
```

### What’s the Equivalent to the Above Using the `class` Keyword?

Let me know if that looks any easier or clearer than in `SecretiveProto`. In my personal view, it’s somewhat worse—it breaks idiomatic use of `class` declarations in JavaScript and it doesn’t work much like you’d expect coming from, say, Java. This will be made clear by the following:

```js
class SecretiveClass {
  constructor() {
    const secret = 'I am a lie!'
    this.spillTheBeans = function () {
      console.log(secret)
    }
  }

  looseLips() {
    console.log(secret)
  }
}

const liar = new SecretiveClass()

console.log(liar.secret)
// => TypeError: SecretiveClass.secret is not defined

liar.spillTheBeans()
// => "I am a lie!"

// WTF?
liar.looseLips()
// => ReferenceError: secret is not defined
```

### Which Do Experienced JavaScript Developers Prefer—Prototypes or Classes?

Experienced JavaScript developers tend to avoid both when they can. Here’s a nice way to do the above with idiomatic JavaScript:

```js
const SecretiveProto = () => {
  const secret = 'Favor composition over inheritance!'

  // no `this` here
  const spillTheBeans = () => console.log(secret)

  // use `return` instead
  return {
    spillTheBeans,
  }
}

// call without the `new` keyword
const myFactory = SecretiveProto()

console.log(myFactory.secret)
// => undefined

myFactory.spillTheBeans()
// => 'Favor composition over inheritance!'

myFactory._spillTheBeans()
// => TypeError: myFactory._spillTheBeans is not a function
```

You could also use a `Revealing Module` pattern:

```js
const SecretiveProto = () => {
  const secret = 'The Class is a lie!'
  const showSecret = () => console.log(secret)

  return {
    getValue: showSecret,
  }
}

const myFactory = SecretiveProto()

console.log(myFactory.secret)
// => undefined

myFactory.getValue()
// => "The Class is a lie!"

myFactory.showSecret()
// => TypeError: myFactory.showSecret() is not a function
```

This isn’t just about avoiding the inherent ugliness of inheritance, or enforcing encapsulation. Think about what else you might do with `secretFactory` and `leaker` that you couldn’t easily do with a prototype or a class.

For one thing, you can destructure it because you don’t have to worry about the context of `this`:

```js
const { spillTheBeans } = secretFactory()

spillTheBeans() // Favor composition over inheritance, (...)
```

That’s pretty nice. Besides avoiding `new` and `this` tomfoolery, it allows us to use our objects interchangeably with CommonJS and ES6 modules. It also makes composition a little easier:

```js
function spyFactory(target) {
  return {
    reveal: target.spillTheBeans,
  }
}

const blackHat = spyFactory(leaker)

blackHat.reveal() // Favor composition over inheritance, (...)

console.log(blackHat.target) // undefined (looks like we got away with it)
```

Clients of `blackHat` don’t have to worry about where `exfiltrate` came from, and spyFactory doesn’t have to mess around with `Function::bind` context juggling or deeply nested properties. Mind you, we don’t have to worry much about `this` in simple synchronous procedural code, but it causes all kinds of problems in asynchronous code that are better off avoided.

Let’s return to the greeter example to see how we’d implement it with a factory:

```js
function greeterFactory(greeting = 'Hello', name = 'World') {
  return {
    greet: () => `${greeting}, ${name}!`,
  }
}

console.log(greeterFactory('Hey', 'folks').greet()) // Hey, folks!
```

###### It’s safer, it’s often faster, and it’s easier to write code like this.

What happens if we want _unhappy_ and _enthusiastic_ greeter variants?

If we’re using the `ClassicalGreeting` class, we'd probably jump directly into dreaming up a class hierarchy. We know we’ll need to parameterize the punctuation, so we’ll do a little refactoring and add some children:

```js
class ClassicalGreeting {
  constructor(greeting = 'Hello', name = 'World', punctuation = '!') {
    this.greeting = greeting
    this.name = name
    this.punctuation = punctuation
  }

  greet() {
    return `${this.greeting}, ${this.name}${this.punctuation}`
  }
}
```

```js
class UnhappyGreeting extends ClassicalGreeting {
  constructor(greeting, name) {
    super(greeting, name, ' :(')
  }
}

const classyUnhappyGreeting = new UnhappyGreeting('Hello', 'everyone')

console.log(classyUnhappyGreeting.greet())
// => Hello, everyone :(
```

```js
class EnthusiasticGreeting extends ClassicalGreeting {
  constructor(greeting, name) {
    super(greeting, name, '!!')
  }

  greet() {
    return super.greet().toUpperCase()
  }
}

const greetingWithEnthusiasm = new EnthusiasticGreeting()

console.log(greetingWithEnthusiasm.greet())
// => HELLO, WORLD!!
```

It’s a fine approach, **until someone comes along and asks for a feature that doesn’t fit cleanly into the hierarchy** and the whole thing stops making any sense.

How could we write the same functionality with factories?

```js
const greeterFactory = (
  greeting = 'Hello',
  name = 'World',
  punctuation = '!'
) => ({
  greet: () => `${greeting}, ${name}${punctuation}`,
})

const unhappy = (greeter) => (greeting, name) => greeter(greeting, name, ':(')

console.log(unhappy(greeterFactory)('Hello', 'everyone').greet())
// => Hello, everyone :(

const enthusiastic = (greeter) => (greeting, name) => ({
  greet: () => greeter(greeting, name, '!!').greet().toUpperCase(),
})

console.log(enthusiastic(greeterFactory)().greet())
// => HELLO, WORLD!!
```

```js
const aggressiveGreeterFactory = enthusiastic(unhappy(greeterFactory))

console.log(aggressiveGreeterFactory("You're late", 'Jim').greet())
```

It’s not obvious that this code is better, even though it’s a bit shorter. In fact, you could argue that it’s harder to read, and maybe this is an obtuse approach. Couldn’t we just have an `unhappyGreeterFactory` and an `enthusiasticGreeterFactory`?

### Credits

From the article [As a JS Developer, This Is What Keeps Me Up at Night](https://www.toptal.com/javascript/es6-class-chaos-keeps-js-developer-up) published on [toptal.com](https://toptal.com)

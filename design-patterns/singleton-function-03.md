# Design Patterns

## Singleton Function

The Singleton pattern is thus known because it restricts instantiation of a class to a single object. Classically, the Singleton pattern can be implemented by creating a class with a method that creates a new instance of the class if one doesn't exist. In the event of an instance already existing, it simply returns a reference to that object.

In JavaScript, Singletons serve as a shared resource namespace which isolate implementation code from the global namespace so as to provide a single point of access for functions.

```js
const mySingleton = (function () {
  let instance

  function init() {
    const privateMethod = () => console.log('I am private')
    const privateVariable = 'Im also private'
    const privateRandomNumber = Math.random()

    return {
      publicMethod: () => console.log('The public can see me!'),
      publicProperty: 'I am also public',
      getRandomNumber: () => privateRandomNumber,
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = init()
      return instance
    },
  }
})()

const singleA = mySingleton.getInstance()
const singleB = mySingleton.getInstance()

console.log(singleA.getRandomNumber() === singleB.publicMethod())
// => true
```

What makes the `Singleton` is the global access to the instance (generally through `MySingleton.getInstance()`) as we don't (at least in static languages) call new `MySingleton()` directly. This is however possible in JavaScript.

In the **GoF** book, the applicability of the `Singleton` pattern is described as follows:

- There must be **exactly one instance of a class**, and it must be accessible to clients from a well-known access point
- When the sole instance **should be extensible by subclassing**, and clients should be able to use an extended instance without modifying their code

The second of these points refers to a case where we might need code such as:

```js
mySingleton.getInstance = function () {
  if (this._instance == null) {
    if (isFoo()) {
      this._instance = new FooSingleton()
    } else {
      this._instance = new BasicSingleton()
    }
  }
  return this._instance
}
```

Here, `getInstance` becomes a little like a Factory method and we don't need to update each point in our code accessing it. `FooSingleton` above would be a subclass of `BasicSingleton` and implement the same interface.

In practice, the **Singleton pattern is useful when exactly one object is needed to coordinate others** across a system.

```js
const SingletonTester = (function () {
  let instance

  // e.g var options = { name: "test", pointX: 5};
  function Singleton(options) {
    options = options || {}

    // set some properties for our singleton
    this.name = 'SingletonTester'
    this.pointX = options.pointX || 6
    this.pointY = options.pointY || 10
  }

  // an emulation of static variables and methods
  let _static = {
    name: 'SingletonTester',
    getInstance: function (options) {
      if (instance === undefined) {
        instance = new Singleton(options)
      }
      return instance
    },
  }

  return _static
})()

const singletonTest = SingletonTester.getInstance({ pointX: 5 })

console.log(singletonTest.pointX) // => 5
```

Whilst the `Singleton` has valid uses, often when we find ourselves needing it in JavaScript it's a sign that we may need to re-evaluate our design.

#### They're often an indication that modules in a system are either tightly coupled or that logic is overly spread across multiple parts of a codebase.

Singletons can be more difficult to test due to issues ranging from hidden dependencies, the difficulty in creating multiple instances, difficulty in stubbing dependencies and so on.

### Credits

From the book [Essential JS Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) written by [Addy Osmani](https://addyosmani.com)

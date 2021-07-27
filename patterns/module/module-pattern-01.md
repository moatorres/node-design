# Design Patterns

## Module Pattern

The **Module pattern** was originally defined as a way to provide both private and public encapsulation for classes in conventional software engineering.

It encapsulates "privacy", state and organization using closures and **provides a way of wrapping a mix of public and private methods and variables**, protecting pieces from leaking into the global scope and accidentally colliding with another developer's interface.

```js
const testModule = (function () {
  let counter = 0

  return {
    incrementCounter: function () {
      return counter++
    },

    resetCounter: function () {
      console.log('counter value prior to reset: ' + counter)
      counter = 0
    },
  }
})()

// usage
testModule.incrementCounter()
testModule.resetCounter() // => 'counter value prior to reset: 1'
```

Here, other parts of the code are unable to directly read the value of our `incrementCounter()` or `resetCounter()`. The counter variable is actually fully _shielded from our global scope_ so it acts just like a private variable would - its existence is limited to within the module's closure so that the only code able to access its scope are our two functions.

Our methods are effectively **namespaced** so in the test section of our code, we need to prefix any calls with the name of the module (e.g. "testModule").

### `moduleTemplate`

When working with the Module pattern, we may find it useful to define a simple template that we use for getting started with it. Here's one that covers namespacing, public and private variables:

```js
const moduleTemplate = (function () {
  let myPrivateVar, myPrivateMethod

  myPrivateVar = 0

  myPrivateMethod = function (foo) {
    console.log(foo)
  }

  return {
    myPublicVar: 'foo',

    // public function utilizing privates
    myPublicFunction: function (bar) {
      myPrivateVar++
      myPrivateMethod(bar)
    },
  }
})()
```

### `basketModule` example

Let's see a **shopping basket** implemented using this pattern. The module itself is completely self-contained in a global variable called `basketModule`. The `basket` array in the module is kept private and so other parts of our application are unable to directly read it.

It only exists with the module's closure and so the only methods able to access it are those with access to its scope (i.e. `addItem()`, `getItemCount()` etc).

```js
const basketModule = (function () {
  // privates
  let basket = []
  function doSomethingPrivate() {}
  function doSomethingElsePrivate() {}

  // return an object exposed to the public
  return {
    addItem: function (values) {
      basket.push(values)
    },
    getItemCount: function () {
      return basket.length
    },

    // public alias to a private function
    doSomething: doSomethingPrivate,

    getTotal: function () {
      var q = this.getItemCount(),
        p = 0

      while (q--) {
        p += basket[q].price
      }

      return p
    },
  }
})()
```

Inside the module, you may have noticed that we return an `object`. This gets automatically assigned to `basketModule` so that we can interact with it as follows:

```js
basketModule.addItem({
  item: 'bread',
  price: 0.5,
})

basketModule.addItem({
  item: 'butter',
  price: 0.3,
})

console.log(basketModule.getItemCount()) // => 2
console.log(basketModule.getTotal()) // => 0.8
console.log(basketModule.basket) // => undefined
console.log(basket) // => ReferenceError: basket is not defined
```

### Imports

This variation of the pattern **demonstrates how globals can be passed in as arguments** to our module's anonymous function. This effectively allows us to _import_ them and locally alias them as we wish.

```js
// global module
const myModule = (function (jQ, _) {
  function privateMethod1() {
    jQ('.container').html('test')
  }

  function privateMethod2() {
    console.log(_.min([10, 5, 100, 2, 1000]))
  }

  return {
    publicMethod: function () {
      privateMethod1()
    },
  }

  // pull in jQuery and Underscore
})(jQuery, _)

myModule.publicMethod()
```

### Exports

This next variation allows us to **declare globals without consuming them** and could similarly support the concept of global imports seen in the last example.

```js
// flobal module
const myModule = (function () {
  // Module object
  let module = {}
  let privateVariable = 'Hello World'

  function privateMethod() {}

  module.publicProperty = 'Foobar'
  module.publicMethod = function () {
    console.log(privateVariable)
  }

  return module
})()
```

### Credits

From the book [Essential JS Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) written by [Addy Osmani](https://addyosmani.com)

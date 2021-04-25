# Design Patterns

## Module Function

There are constious ways a **module pattern** can be implemented. In this article, we will learn to create a module pattern in ES5.

Before we go ahead and start looking into the implementation of the module pattern, here are some of the benefits:

- Freeze the scoping
- Code encapsulation
- Creating private or public scope
- Creating a namespace
- Creating public and private encapsulation

We can implement a module pattern using **JavaScript Object Literals** and **Immediately-Invoked** function expressions. Just to refresh your memory, an object literal will look like the below listing:

```js
const Product = {
  price: 600,
  setOrder: function () {
    return this.price
  },
}

console.log(Product.setOrder())
```

An Immediately-Invoked function expression looks like the example below:

```js
const add = (function (num1, num2) {
  let res = num1 + num2
})(7, 2)
```

With the combination of these two methods, we can implement Module Patterns in JavaScript. Let us start with creating the module:

```js
;(function () {
  // everything here will be scoped to this function
  const price = 99
})()

console.log(price) // => undefined
```

We can export the module by assigning it to a constiable using an expression and then creating private and public encapsulation using the return statement:

```js
const myModule = (function () {
  // private
  let color = 'red'
  let model
  function setModel(m) {
    model = m
  }

  // public
  return {
    price: 800,
    getModel: function (m) {
      setModel(m)
      return model
    },
  }
})()

console.log(myModule.price) // => 800
console.log(myModule.color) // => undefined
console.log(myModule.getModel('bmw')) // => bmw
```

### Revealing Module Pattern

The **Revealing Module Pattern** has more consistent naming and better readability of code.

```js
const myModule = (function () {
  // private
  let color = 'red'
  let model
  function setModel(m) {
    model = m
  }
  let privatePrice = 800
  let getModel = function (m) {
    setModel(m)
    return model
  }

  // public
  return {
    price: privatePrice,
    model: getModel,
  }
})()

console.log(myModule.price) // => 800
console.log(myModule.model('audi')) // => audi
```

### Credits

From this [article](https://dzone.com/articles/module-pattern-in-javascript) published on [dzone.com](https://dzone.com/)

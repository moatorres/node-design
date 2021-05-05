# Design Patterns

## Chain of Responsability

**Chain of responsiblity** is useful when there are a cumulative series of methods. In this example we have a discount calculator which is cumulative based on various conditions the products basket satisfies e.g. `> 3 items` adds 10% discount or `> $100 spend` adds 20% discount.

To calculate the discount we first check if it satisfies `NumberDiscount`, then add that result to the `PriceDiscount` before finalling adding a `NoDiscount` end condition. If number and price discount aren't satisfied then we return 0 discount (the end condition).

The advantage of chain-of-resp pattern is that we can choose which types of discounts we want to apply. We could also easily add more discount methods.

Let's setup a simple `Products` array which we will use to calculate discounts.

```js
const Products = function () {
  this.products = []
  this.addProduct = (product) => this.products.push(product)
}
```

Let's see how to delegate responsibility to next function down the line.

`Discount` will be our **entry point function**

```js
const Discount = function () {
  let numberDiscount = new NumberDiscount()
  let priceDiscount = new PriceDiscount()
  let noDiscount = new NoDiscount()
  let subtotal = new Subtotal()

  this.calculate = (products) => {
    numberDiscount.setNext(priceDiscount)
    priceDiscount.setNext(subtotal)
    subtotal.setNext(noDiscount)
    numberDiscount.exec(products).toFixed(2)
  }
}
```

`NumberDiscount`

```js
const NumberDiscount = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }

  // calculate own result then append results by calling next
  this.exec = function (products) {
    let result = null
    if (products.length > 3) {
      result = 0.1
    }
    return result + this.next.exec(products)
  }
}
```

`PriceDiscount`

```js
const PriceDiscount = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }

  this.exec = function (products) {
    let result = null
    let reducer = (sum, item) => sum + item.price
    let total = products.reduce(reducer, 0)

    total > 100 && (result = 0.2)

    return this.next.exec(result, total, products)
  }
}
```

`NoDiscount`

```js
const NoDiscount = function () {
  this.exec = function () {
    return 0
  }
}
```

### Usage

```js
const list = new Products()
list.addProduct({ name: 'iPhone 11', price: 799 })

const discount = new Discount()
discount.calculate(list.products)

// => Subtotal: $799.00
// => Bonus: 20%
// => Discounted: $159.80
// => Total: $639.20
```

#### Imperative Method Comparison

Note the code here is not too bad but it does not scale as complexity grows.

```js
let Discount = function () {
  this.calculate = function (products) {
    let numberDiscount = null
    let priceDiscount = null
    let result = numberDiscount + priceDiscount

    let total = products.reduce((elem, tally) => {
      return elem + tally
    }, 0)

    products.length > 3 && numberDiscount = 0.1
    total > 100 && priceDiscount = 0.2

    return result.toFixed(2)
  }
}
```

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns/blob/master/chain-of-resp/index.js) written by [@howardmann](https://github.com/howardmann)

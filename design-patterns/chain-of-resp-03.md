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
  this.calculate = (products) => {
    // intanciar calculadoras de desconto
    let numberDiscount = new NumberDiscount()
    let priceDiscount = new PriceDiscount()
    let none = new NoDiscount()

    // add price discount to number discount
    numberDiscount.setNext(priceDiscount)

    // add no discount to price discount
    priceDiscount.setNext(none)

    // execute and round to 2 dp
    return numberDiscount.exec(products).toFixed(2)
  }
}
```

```js
const NumberDiscount = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }

  // execute by calculating own result and then append results by calling next
  this.exec = function (products) {
    let result = null
    if (products.length > 3) {
      result = 0.1
    }
    return result + this.next.exec(products)
  }
}
```

```js
const PriceDiscount = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }
  this.exec = function (products) {
    let total = products.reduce((el, tally) => {
      return el + tally
    }, 0)
    let result = null
    if (total > 100) {
      result = 0.2
    }
    return result + this.next.exec(products)
  }
}
```

```js
const NoDiscount = function () {
  this.exec = function () {
    return 0
  }
}
```

### Imperative method

Note the code here is not too bad but it does not scale as complexity grows.

```js
const Discount = function () {
  this.calculate = function (products) {
    let numberDiscount = null
    if (products.length > 3) {
      numberDiscount = 0.1
    }

    let priceDiscount = null
    let total = products.reduce((el, tally) => {
      return el + tally
    }, 0)
    if (total > 100) {
      priceDiscount = 0.2
    }

    let result = numberDiscount + priceDiscount
    return result.toFixed(2)
  }
}
```

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns/blob/master/chain-of-resp/index.js) written by [@howardmann](https://github.com/howardmann)


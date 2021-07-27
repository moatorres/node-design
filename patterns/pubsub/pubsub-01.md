# Design Patterns

## Pub/Sub

`PubSub` pattern, single function that acts as a central control tower for events.

In this example we have an email price alert system for products. The `emailAlert` subscribes to a product and passes it a function it wants executed when the product is emitted.

The `Product` simply decides when to publish the event name and passes it the product object. The `EventEmitter`'s job is to listen for and execute functions based on a unique `eventName` both publisher and subscriber agreed to.

### `EventEmitter`

```js
let EventEmitter = function () {
  this.events = {}

  this.on = function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(fn)
  }

  this.emit = function (eventName, param) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(param)
      })
    }
  }
}
```

### `Product`

```js
// Create a new instance
let events = new EventEmitter()

let Product = function (name, price) {
  this.product = {
    name,
    price,
  }
  this.setPrice = (num) => {
    this.product.price = num
    events.emit(this.product.name, this.product)
  }
}

let EmailAlert = function (email) {
  this.email = email
  this.msg = null
  this.priceAlert = null

  this.setAlert = (price, product) => {
    this.priceAlert = price
    events.on(product, this.calculate)
  }

  this.calculate = (product) => {
    let { price, name } = product
    if (price < this.priceAlert) {
      this.msg = `Email to ${this.email}: ${name} price below ${this.priceAlert} now at ${price}`
    }
  }
}

module.exports = { Product, EmailAlert }
```

#### Usage

```js
let book = new Product('book', 30)
let johnAlert = new EmailAlert('john@email.com')
let billAlert = new EmailAlert('bill@email.com')
let kateAlert = new EmailAlert('kate@email.com')
let mindyAlert = new EmailAlert('mindy@email.com')
johnAlert.setAlert(20, 'book')
billAlert.setAlert(25, 'book')
kateAlert.setAlert(17, 'book')
mindyAlert.setAlert(5, 'book')

// trigger
book.setPrice(15)

let input = [johnAlert.msg, billAlert.msg, kateAlert.msg, mindyAlert.msg]
let actual = [
  'Email to john@email.com: book price below 20 now at 15',
  'Email to bill@email.com: book price below 25 now at 15',
  'Email to kate@email.com: book price below 17 now at 15',
  null,
]

// test
// expect(input).to.eql(actual)
```

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns) written by [@howardmann](https://github.com/howardmann)

# Functional Programming

## Builder Pattern with `classes`

In this example, we are going to use the **Builder Pattern** to create `Customer` objects that have 4 fields: `name`, `age`, `location`, `languages`.

The difference is that we will split our `Builder` function into a **Builder class** and a **Product class**.

```js
class Customer {
  constructor(builder) {
    this.name = builder.name
    this.age = builder.age
    this.location = builder.location
    this.languages = builder.languages
  }

  showInfo() {
    console.log(this)
  }
}

module.exports = Customer
```

We pass a builder object to the `constructor` method and **use the methods of the builder to set values for each sub-class**.

```js
const Customer = require('./Customer')

class CustomerBuilder {
  constructor(name) {
    this.name = name
  }

  setAge(age) {
    this.age = age
    return this
  }

  setLocation(location) {
    this.location = location
    return this
  }

  setLanguages(languages) {
    this.languages = languages
    return this
  }

  buildInfo() {
    return new Customer(this)
  }
}

module.exports = CustomerBuilder
```

Now we can use our `CustomerBuilder` methods to build the values for `name`, `age`, `location`, `languages`. The important things we need to notice are:

- **`return this`** at the end of each method guarantees that we always have a `Builder` object after running the method

- **`buildInfo()`** returns the final product: our `Customer` object

### Usage

```js
const CustomerBuilder = require('./CustomerBuilder')

const jack = new CustomerBuilder('Jack')
  .setAge(25)
  .setLanguages(['English', 'German'])
  .buildInfo()

jack.showInfo()

const adam = new CustomerBuilder('Adam')
  .setLocation('US')
  .setLanguages(['English'])
  .buildInfo()

adam.showInfo()
```

### Credits

From this [article](https://grokonez.com/node-js/implement-builder-pattern-nodejs-example) published on [grokonez.com](https://grokonez.com/)

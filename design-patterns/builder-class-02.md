# Design Patterns

## Builder Class

```js
class Person {
  constructor(builder) {
    this.name = builder.name
    this.isEmployee = builder.isEmployee
    this.isManager = builder.isManager
    this.hours = builder.hours || 0
    this.money = builder.money || 0
    this.shoppingList = builder.shoppingList || []
  }

  toString() {
    return JSON.stringify(this)
  }
}

module.exports = Person
```

```js
const Person = require('./Person')

class PersonBuilder {
  constructor(name) {
    this.name = name
  }

  makeEmployee() {
    this.isEmployee = true
    return this
  }

  makeManager(hours = 40) {
    this.isManager = true
    this.hours = hours
    return this
  }

  makePartTime(hours = 20) {
    this.hours = hours
    return this
  }

  withMoney(money) {
    this.money = money
    return this
  }

  withShoppingList(list = []) {
    this.shoppingList = list
    return this
  }

  build() {
    return new Person(this)
  }
}

module.exports = PersonBuilder
```

### Usage

```js
const PersonBuilder = require('./PersonBuilder')

// Employees
const sue = new PersonBuilder('Sue').makeEmployee().makeManager(60).build()
const bill = new PersonBuilder('Bill').makeEmployee().makePartTime().build()
const phil = new PersonBuilder('Phil').makeEmployee().build()

// Shoppers
const charles = new PersonBuilder('Charles')
  .withMoney(500)
  .withShoppingList(['jeans', 'sunglasses'])
  .build()

const tabbitha = new PersonBuilder('Tabbitha').withMoney(1000).build()

console.log(sue.toString())
console.log(charles.toString())
```

### Credits

From this [repo](https://github.com/diegomais/node-js-design-patterns/) written by [@diegomais](https://github.com/diegomais)

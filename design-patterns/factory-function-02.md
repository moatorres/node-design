# Design Patterns

## Factory Function

To abstract the process of creating objects without relying on class constructors or the `new` keyword, we will create a **Simple Factory** function.

Instead of using the `new` keyword we will use the `create()` method from our `CarFactory` to create a new car.

Although not treated as a standard GoF design pattern, this approach is useful to split code that varies a lot from code that doesn't.

In this example, we have 3 types of cars: Audi, BMW, Mercedes. We must specify the car type to be generated as either `"Audi"`, `"BMW"` or `"Mercedes"` string values.

```js
const BMW = CarFactory.create('BMW')
```

The `Car` class will be our default class. It should have a `constructor` method that assigns an `id` to the car's `name` and a `showInfo()` method that will return its name value.

```js
class Car {
  constructor(name) {
    const id = Math.random().toString(36).substring(2, 15)
    this.name = `${name}-${id}`
  }

  showInfo() {
    console.log(`I'm ${this.name}`)
  }
}

module.exports = Car
```

Let's create our subclasses `Audi`, `BMW` and `Mercedes`

**`Audi`**

```js
const Car = require('./default-car')

class Audi extends Car {
  constructor() {
    super('Audi')
  }
}

module.exports = Audi
```

**`BMW`**

```js
const Car = require('./default-car')

class BMW extends Car {
  constructor() {
    super('BMW')
  }
}

module.exports = BMW
```

**`Mercedes`**

```js
const Car = require('./default-car')

class Mercedes extends Car {
  constructor() {
    super('Mercedes')
  }
}

module.exports = Mercedes
```

Now we can create our **`CarFactory`** with the `create()` method to generate new cars based on the input string `type`.

```js
const Audi = require('./audi')
const BMW = require('./bmw')
const Mercedes = require('./mercedes')

class CarFactory {
  create(type) {
    switch (type) {
      case 'Audi':
        return new Audi()

      case 'BMW':
        return new BMW()

      case 'Mercedes':
        return new Mercedes()

      default: {
        console.log('Unknown Car type...')
      }
    }
  }
}

module.exports = new CarFactory()
```

### Usage

```js
const CarFactory = require('./car-factory')

const Audi = CarFactory.create('Audi')
const Bmw = CarFactory.create('BMW')
const Mercedes = CarFactory.create('Mercedes')

Audi.showInfo() // => I'm Audi-7nuweb00pkj
Bmw.showInfo() // => I'm BMW-ygw7tqsdbxr
Mercedes.showInfo() // => I'm Mercedes-1vfgp9wnhvk
```

### Credits

From this [article](https://grokonez.com/design-pattern/implement-simple-factory-method-pattern-node-js-example) published on [grokonez.com](https://grokonez.com/)

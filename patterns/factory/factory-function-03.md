# Design Patterns

## Factory Function

Prior to ES6, there was a lot of confusion about the **differences between a factory function and a constructor function** in JavaScript. Since ES6 has the `class` keyword, a lot of people seem to think that solved many problems with constructor functions. It didn’t. Let’s explore the major differences you still need to be aware of.

Each of these strategies stores methods on a shared prototype, and optionally supports private data via constructor function closures. In other words, they have mostly the same features, and could mostly be used interchangeably.

```js
// class
class ClassCar {
  drive() {
    console.log('Vroom!')
  }
}

const car1 = new ClassCar()
console.log(car1.drive())

// constructor
function ConstructorCar() {}

ConstructorCar.prototype.drive = function () {
  console.log('Vroom!')
}

const car2 = new ConstructorCar()
console.log(car2.drive())

// factory
const proto = {
  drive() {
    console.log('Vroom!')
  },
}

const factoryCar = () => Object.create(proto)

const car3 = factoryCar()
console.log(car3.drive())
```

### Benefits of Constructors & `class`

- Most books teach you to use `class` or constructors
- `this` refers to the new object
- Some people like the way `myFoo = new Foo()` reads
- There may be a micro-optimization performance benefit, but you should not worry about that unless you have profiled your code and proven that it’s an issue for you

### Drawbacks of Constructors & `class`

1. Required `new`
2. Details of instantiation get leaked into the calling API (via the `new` requirement)
3. Constructors break the Open / Closed Principle
4. Constructors enable the use of the unreliable `instanceof`

```js
// instanceof lies
function foo() {}
const bar = { a: 'a' }

foo.prototype = bar

// is bar an instance of foo?
console.log(bar instanceof foo) // => false

const baz = Object.create(bar)

// is baz an instance of foo?
console.log(baz instanceof foo) // true. oops.
```

### Benefits of Using Factories

Factories are much more flexible than either constructor functions or classes, and they don’t lead people down the wrong path by tempting them with the `extends` keyword and deep inheritance hierarchies.

##### 1. Return any arbitrary object and use any arbitrary prototype

For example, you can easily create various types of objects which implement the same API, e.g., a media player that can instantiate players for multiple types of video content which use different APIs under the hood, or an event library which can emit DOM events or web socket events.

##### 2. No refactoring worries

You’d never have a need to convert from a factory to a constructor, so refactoring will never be an issue.

##### 3. No `new`

No ambiguity about using new. Don’t. (It will make `this` behave badly, see next point).

##### 4. Standard `this` behavior

`this` behaves as it normally would, so you can use it to access the parent object. For example, inside `player.create()`, `this` refers to `player`, just like any other method invocation would. `call()` and `apply()` also reassign this as expected.

##### 5. No deceptive `instanceof`

##### 6. Some people like the way `myFoo = createFoo()` reads

### Usage

```js
// factory refactored
const AutoMaker = {
  Car(bundle) {
    return Object.create(this.bundle[bundle])
  },

  bundle: {
    premium: {
      drive() {
        console.log('Vrooom!')
      },
      getOptions: function () {
        return ['leather', 'wood', 'pearl']
      },
    },
  },
}

const newCar = AutoMaker.Car('premium')
newCar.drive() // => 'Vrooom!'
```

### Credits

From the article [JavaScript Factory Functions vs Constructor Functions vs Classes](https://medium.com/javascript-scene/javascript-factory-functions-vs-constructor-functions-vs-classes-2f22ceddf33e%20///%20JavaScript%20Factory%20Functions%20vs%20Constructor%20Functions%20vs%20Classes) written by [@ericelliott](https://github.com/ericelliott)

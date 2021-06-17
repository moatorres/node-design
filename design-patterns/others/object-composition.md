# Design Patterns

## Object Composition

What does the word composition mean? Let's start with the verb to compose. Looking up a dictionary you find a lot of references to composing music :) You will also find this definition:

to be formed from various things

The above is probably closer to what I'm about to talk about next - **Composition**.

### Composition

The idea is to create something from other parts. Why would we want to do that? Well, it's easier to build something complex if it consists of many small parts that we understand. The other big reason is reusability. Bigger and more complex things can sometimes share parts they consist of, with other big and complex things. Ever heard of IKEA? ;)

There's more than one type of composition in programming, who knew? ;)

#### Composition vs Inheritance

Let's quickly explain inheritance. The idea with inheritance is to inherit traits, fields as well as methods from a parent class. The class inheriting from a parent class is called a subclass. This inheritance makes it possible to treat a group of objects in the same way. Consider the below example:

```js
class Shape {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Movable extends Shape {
  move(dx, dy) {
    this.x += dx
    this.y += dy
  }
}

class Hero extends Movable {
  constructor(x, y) {
    super(x, y)
    this.name = 'hero'
  }
}

class Monster extends Movable {
  constructor(x, y) {
    super(x, y)
    this.name = 'monster'
  }
}

const movables = [new Hero(1, 1), new Monster(2, 2)]
movables.forEach((m) => m.move(2, 3))
```

Above we can treat instances of Hero and Monster in the same way as they have a common ancestor Movable that allows them to be moved through the move() method. All this is based on a relationship principle **IS-A**. A `Hero` **IS-A** `Movable`, a `Monster` is a `Movable`.

There's been a lot of talks lately on how you should favor composition over inheritance, why is that? Let's look at some drawbacks with inheritance:

Liskov substitution principle is done wrong, the idea behind this principle is the code should still work if I replace something with a common ancestor for something else, i.e replacing a Hero for a Monster, they are both of type `Movable`. In the above sample code that replacement should work. However, the above code represents the ideal case. Reality is much worse. In reality, there might exist large codebases where there are 20+ levels of inheritance, and inherited methods might not be implemented properly meaning that certain objects can't be replaced for one another. Consider the following code:

```js
class NPC extends Movable {
  move(dx, dy) {
    console.log('I wont move')
  }
}
```

The above have broken the substitution principle. Now, our codebase is so small so we can spot it. In larger codebases, you might not be able to spot when this happens. Imagine this happens on inheritance level 3 and you have 20 levels of inheritance.

Lack of Flexibility, a lot of the time you have a HAS-A relationship over IS-A. It's easier to think of different components doing various things rather than them having a commonality, a common ancestor. This may lead us to create a lot of extra classes and inheritance chains when a composition would have been more appropriate.

Function composition

It's a mathematical term stating that states the following according to Wikipedia, function composition is an operation that takes two functions f and g and produces a function h such that h(x) = g(f(x)). Related to programming is when we apply at least two functions on something like so:

```js
let list = [1, 2, 3]
take(orderByAscending(list), 3)
```

Above imagine that `list` is `x`, `f(x)` is `orderByAscending(list)` and `g(x)` is `take()` with `f(x)` as input parameter.

The point is you have many operations applied one after another on a piece of data. Essentially you apply different parts to create a more complex algorithm that when invoked computes a more complex result. We won't spend so much time talking about this version of composition but know that it exists.

#### Object Composition

This type of composition is about combining objects or other data types to create something more complex than what we started with. This can be accomplished in different ways depending on what language you have in front of you. In Java and C# you only have one way to create objects, by using a class. In other languages like JavaScript, you have objects that can be created in many ways and thereby you open up for different ways of composing.

##### Object composition with Classes

Using classes is about a class referencing one or more other classes via instance variables. It describes a has-a association. Which means what exactly? A person has four limbs, a car may have 4 wheels, and so on. Think of these classes being referenced as parts or composites that gives you the ability to do something, a capability. Let's look at an example:

```js
class SteeringWheel {
  steer() {}
}

class Engine {
  run() {}
}

class Car {
  constructor(steeringWheel, engine) {
    this.steeringWheel = steeringWheel
    this.engine = engine
  }

  steer() {
    this.steeringWheel.steer()
  }

  run() {
    this.engine.run()
  }
}

class Tractor {
  constructor(steeringWheel) {
    this.steeringWheel = steeringWheel
  }

  steer() {
    this.steeringWheel.steer()
  }
}
```

What we are getting above is first a more complex class `Car` consisting of many parts `steeringWheel` and `engine` and through that, we gain the ability to steer and a vehicle that runs. We also get reusability as we can use the `SteeringWheel` and use it in a `Tractor`.

##### Object composition without classes

JavaScript is a little different than C# and Java in that it can create objects in a number of ways like the following:

- Object literal, you can create an object by just typing it out like so:

```js
let myObject { name: 'a name' }
```

- `Object.create()`, you can just pass in an object and it will use that as template. Like this for example:

```js
const template = {
  a: 1,
  print() {
    return this.a
  },
}

const test = Object.create(template)
test.a = 2
console.log(test.print()) // 2
```

Using new. You can apply the new operator on both a class and a function, like so:

```js
class Plane {
  constructor() {
    this.name = 'a plane'
  }
}

function AlsoAPlane() {
  this.name = 'a plane'
}

const plane = new Plane()
console.log(plane.name) // a plane

const anotherPlane = new AlsoAPlane()
console.log(anotherPlane) // a plane
```

There is a difference between the two approaches. You need to do a bit more work if you want inheritance to work for the functional approach among other things. For now, we are happy knowing that there are different ways to create objects using new.

So how would we actually compose? To compose we need a way to express behavior. We don't need to use classes if we don't want to, but we can skip directly to objects instead. We can express our composites in the following way:

```js
const steer = {
  steer() {
    console.log(`steering ${this.name}`)
  },
}

const run = {
  run() {
    console.log(`${this.name} is running`)
  },
}

const fly = {
  fly() {
    console.log(`${this.name} is flying`)
  },
}
```

and compose them like so:

```js
const steerAndRun = { ...steer, ...run }
const flyingAndRunning = { ...run, ...fly }
```

Above we are using the spread operator to combine different properties from different classes and place them into one class. The resulting `steerAndRun` now contains `{ steer(){ ... }, run() { ... } }` and `flyingAndRunning` contains `{ fly(){...}, run() {...} }`.

Then using the method `createVehicle()` we create what we need like so:

```js
function createVehicle(name, behaviors) {
  return {
    name,
    ...behaviors,
  }
}

const car = createVehicle('Car', steerAndRun)
car.steer()
car.run()

const crappyDelorean = createVehicle('Crappy Delorean', flyingAndRunning)
crappyDelorean.run()
crappyDelorean.fly()
```

The end result is two different objects with different capabilities.

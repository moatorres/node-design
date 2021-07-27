# Design Patterns

## Class Composition

It seems like “composition over inheritance” is the new motto. Everyone’s talking about it, and that’s not strange since composition gives you more flexibility by composing functionality to create a new object, while inheritance forces you to extend entities in an inheritance tree.

### Inheritance with Classes

ES2015 introduced the class syntax to JavaScript. The syntax gives us a nice way to use Object Oriented Programming (OOP) compared to managing prototypes. For example, inheritance in ES5 with prototypes:

```js
var Animal = function (name) {
  this.name = name
}

var Alligator = function (name) {
  Animal.apply(this, arguments) // call parent constructor
}

// extend the prototype
Alligator.prototype = Object.create(Animal.prototype)
Alligator.prototype.constructor = Alligator

var jack = new Alligator('jack')
```

Becomes this using ES 2015 classes:

```js
class Animal {
  constructor(name) {
    this.name = name
  }
}

class Alligator extends Animal {}

const jack = new Alligator('jack')
```

With ES2015 classes, you can omit the constructor, then the parent one will be called. If you wish to make it explicit, it’d be equivalent to:

```js
class Alligator extends Animal {
  constructor(...args) {
    super(...args)
  }
}
```

The new class syntax is just syntactical sugar over the prototype-based model and behind the scenes prototypes are still being used.

The bottom line is that classes are functions, and functions are objects in JavaScript, extendable using its prototypal inheritance nature. That sounds confusing, but it gives the language a lot of flexibility (and pains perhaps).

### Object Composition

A common composition pattern in JavaScript is using object composition. It combines the power of objects and functional programming. For the example above, imagine an animal has the ability to eat and fly. In hierarchy, that could mean to have an `Animal` and `FlyingAnimal`. And if we add more and more animals, that hierarchy could become a bit messy, since abilities are shared between animals.

With composition, you could have factories that create an object:

```js
const alligator = (name) => {
  const self = {
    name,
  }

  return self
}

const jack = alligator('jack')
```

We’re using an internal variable `self` that would represent the prototype using classes or prototypes. This would behave exactly as the example above.

Then, you can define behaviors as functions receiving the self. That makes them easily composable since they’re just functions. Then we’ll use any object merging utility, such as `Object.assign` or the spread operator `({...a, ...b})` in the factory function in order to create the final object:

```js
// we have some behaviors
const canSayHi = (self) => ({
  sayHi: () => console.log(`Hi! I'm ${self.name}`),
})
const canEat = () => ({
  eat: (food) => console.log(`Eating ${food}...`),
})
const canPoop = () => ({
  poop: () => console.log('Going to 💩...'),
})

// combined previous behaviours
const socialBehaviors = (self) =>
  Object.assign({}, canSayHi(self), canEat(), canPoop())

const alligator = (name) => {
  const self = {
    name,
  }

  const alligatorBehaviors = (self) => ({
    bite: () => console.log('Yum yum!'),
  })

  return Object.assign(self, socialBehaviors(self), alligatorBehaviors(self))
}

const jack = alligator('jack')
jack.sayHi() // Hi! I'm jack
jack.eat('Banana') // Eating Banana...
jack.bite() // Yum yum!
```

As you can see, we define different behaviors prefixed with can (the with prefix is usually used as well). We are even combining some of them into `socialBehaviors` by creating a new composed object.

In this way, it’d be quite easy to create another animal:

```js
const dog = (name) => {
  const self = {
    name,
  }

  const dogBehaviors = (self) => ({
    bark: () => console.log('Woff woff!'),
    haveLunch: (food) => {
      self.eat(food)
      self.poop()
    },
  })

  return Object.assign(self, dogBehaviors(self), canEat(), canPoop())
}
```

Keep in mind that we’re appending all functionality into the same reference of `self`, that’s why you can call `self.eat` within `haveLunch`. That allow us to create behaviors on top of other behaviors.

This kind of composition has the benefits of easy refactoring and a simple mental model for structuring since you don’t have the restrictions of a hierarchy.

### Composition with JavaScript Classes

All of this is so cool, but lots of people are used to the OOP way and prefer to work with ES2015 classes. But remember that classes are functions and functions are objects, so we can compose them as well.

We can use a mixin technique in order to define pieces of behaviors, consisting of a factory function that takes a superclass as a parameter and returns a subclass:

```js
// Create a mixin
const FoodMixin = (superclass) =>
  class extends superclass {
    eat(food) {
      console.log(`Eating ${food}`)
    }

    poop() {
      console.log('Going to 💩')
    }
  }
```

Then we can use it to reproduce the `Dog` example by enhancing an `Animal` class with the `FoodMixin`:

```js
class Animal {
  constructor(name) {
    this.name = name
  }
}

class Dog extends FoodMixin(Animal) {
  constructor(...args) {
    super(...args)
  }

  bark() {
    console.log('Woff woff!')
  }

  haveLunch(food) {
    this.eat(food)
    this.poop()
  }
}

const jack = new Dog('jack')
jack.haveLunch('little mouse')
```

Using classes for composing gives us both the advantages of the class inheritance and composition world: you can compose behaviors by using a familiar OOP syntax and structure, where `super` and `this` are preserved because of JavaScript’s prototype chain.

### Combining Mixins

Since mixins are just factory functions, we can use several of them:

```js
const MixinA = (superclass) => class extends superclass {}
const MixinB = (superclass) => class extends superclass {}

class Base {}
class Child extends MixinB(MixinA(Base)) {}
```

We can also create mixins that extend other mixins, although that creates dependencies so try to not overuse it:

```js
const MixinA = (superclass) => class extends superclass {}
const MixinB = (superclass) => class extends MixinA(superclass) {}

class Base {}
class Child extends MixinB(Base) {}
```

The problem using several mixins is that we easily end up in a deep nested syntax:

```js
const MixinA = (superclass) => class extends superclass {}
const MixinB = (superclass) => class extends superclass {}
const MixinC = (superclass) => class extends superclass {}
const MixinD = (superclass) => class extends superclass {}

class Base {}
class Child extends MixinD(MixinC(MixinB(MixinA(Base)))) {}
```

The cool thing is that since they’re just unary pure functions (they take only one argument), we can use a compose functional utility to avoid that, such as **lodash**’s one:

```js
import compose from 'lodash/fp/compose'

const MixinA = (superclass) => class extends superclass {}
const MixinB = (superclass) => class extends superclass {}
const MixinC = (superclass) => class extends superclass {}

class Base {}

const Behaviors = compose(MixinA, MixinB, MixinC)(Base)

class Child extends Behaviors {}
```

As a final example, let’s create a more “real-world” super powered `Dog` example. We could move all behaviors to a `behaviors.js` file:

`behaviors.js`

```js
export const EatMixin = (superclass) =>
  class extends superclass {
    eat(food) {
      console.log(`Eating ${food}`)
    }
  }

export const PoopMixin = (superclass) =>
  class extends superclass {
    poop() {
      console.log('Going to 💩')
    }
  }

export const FlyMixin = (superclass) =>
  class extends superclass {
    fly() {
      console.log('Flying for real!')
    }
  }
```

And in a `dog-example.js` file use them:

```js
import compose from 'lodash/fp/compose'
import { EatMixin, PoopMixin, FlyMixin } from './behaviors.js'

class Animal {
  constructor(name) {
    this.name = name
  }
}

const SuperPoweredDog = compose(EatMixin, PoopMixin, FlyMixin)(Animal)

class Dog extends SuperPoweredDog {
  bark() {
    console.log('Woff woff!')
  }

  haveLunch(food) {
    this.eat(food)
    this.poop()
  }
}

const jack = new Dog('jack')
jack.bark() // Woff woff!
jack.haveLunch('little mouse') // Eating little mouse. Going to 💩
```

Note that we don't need to specify a constructor in the `Dog` class if we're just calling a parent constructor with all arguments. That happens implicitly.

### Wrapping Up

We’ve compared different ways to reuse code and seen some examples of them. Class composition is a not a very well known pattern, but it provides easy composition with a nice syntax, having the benefits of composition with a kind of OOP syntax.

Stay cool 🦄

### Credits

From the article [Class Composition in JavaScript](https://alligator.io/js/class-composition/) written by [@alexjoverm](https://github.com/alexjoverm/)

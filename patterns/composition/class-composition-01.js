// function constructor
let Animal = function (name) {
  this.name = name
}

let Alligator = function (name) {
  Animal.apply(this, arguments) // call parent constructor
}

// extend the prototype
Alligator.prototype = Object.create(Animal.prototype)
Alligator.prototype.constructor = Alligator

let jack1 = new Alligator('jack')
console.log(jack1)

// class constructor
class AnimalClass {
  constructor(name) {
    this.name = name
  }
}

class AlligatorClass extends AnimalClass {
  constructor(...args) {
    super(...args)
  }
}

const alligator = (name) => {
  const self = {
    name,
  }

  return self
}

const jack2 = alligator('jack')
console.log(jack2)

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

const createAlligator = (name) => {
  const self = {
    name,
  }

  const alligatorBehaviors = (self) => ({
    bite: () => console.log('Yum yum!'),
  })

  return Object.assign(self, socialBehaviors(self), alligatorBehaviors(self))
}

const jack3 = createAlligator('jack')
jack3.sayHi() // Hi! I'm jack
jack3.eat('Banana') // Eating Banana...
jack3.bite() // Yum yum!

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

const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((y, f) => f(y), x)

const MixinA = (superclass) => class extends superclass {}
const MixinB = (superclass) => class extends superclass {}
const MixinC = (superclass) => class extends superclass {}

class Base {}

const Behaviors = compose(MixinA, MixinB, MixinC)(Base)

class Child extends Behaviors {}

const EatMixin = (superclass) =>
  class extends superclass {
    eat(food) {
      console.log(`Eating ${food}`)
    }
  }

const PoopMixin = (superclass) =>
  class extends superclass {
    poop() {
      console.log('Going to 💩')
    }
  }

const FlyMixin = (superclass) =>
  class extends superclass {
    fly() {
      console.log('Flying for real!')
    }
  }

const SuperPoweredDog = compose(EatMixin, PoopMixin, FlyMixin)(AnimalClass)

class DogClass extends SuperPoweredDog {
  bark() {
    console.log('Woff woff!')
  }

  haveLunch(food) {
    this.eat(food)
    this.poop()
  }
}

const jack4 = new DogClass('jack')
jack4.bark() // Woff woff!
jack4.haveLunch('little mouse') // Eating little mouse. Going to 💩

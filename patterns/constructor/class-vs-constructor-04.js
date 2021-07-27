// constructor function
const PersonConstructor = function (name) {
  this.name = name
  this.speak = () => `My name is ${this.name}`
}

const WorkerConstructor = function (name, profession) {
  PersonConstructor.call(this, name)
  this.profession = profession
  this.speak = () =>
    `My name is ${this.name} and my profession is ${this.profession}`
}

let ana = new PersonConstructor('Ana')
ana.speak() // => My name is Ana

let felix = new WorkerConstructor('Felix', 'unemployed')
felix.speak() // => My name is Felix and my profession is unemployed

console.log(ana)
console.log(felix)

// class constructor
class Person {
  constructor(name) {
    this.name = name
  }
  speak() {
    return `My name is ${this.name}`
  }
}

class Worker extends Person {
  constructor(name, profession) {
    super(name)
    this.profession = profession
  }

  // override parent method
  speak() {
    return `My name is ${this.name} and my profession is ${this.profession}`
  }
}

let howie = new Person('Howie')
howie.speak() // => My name is Howie

let bob = new Worker('Bob', 'Builder')
bob.speak() // => My name is Bob and my profession is Builder

console.log(howie)
console.log(bob)

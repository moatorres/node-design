// constructor function
let upperCase = {
  convert: (word) => word.toUpperCase(),
}

let lowerCase = {
  convert: (word) => word.toLowerCase(),
}

let PersonConstructor = function (name, strategy) {
  this.name = name
  this.strategy = strategy
  this.speak = () => this.strategy.convert(this.name)
}

let vinicius = new PersonConstructor('ViNiCiUs', lowerCase)
vinicius.speak() // => vinicius

// class constructor
class Person {
  constructor(name, strategy) {
    this.name = name
    this.strategy = strategy
  }
  speak() {
    return this.strategy.convert(this.name)
  }
}

let chico = new Person('Chico', upperCase)
chico.speak() // => CHICO

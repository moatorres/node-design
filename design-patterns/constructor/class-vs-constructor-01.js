// constructor function
const Calculator = function () {
  this.cache = null
  this.save = (num) => {
    this.cache = num
    return `Saved ${this.cache}`
  }
  this.clear = () => (this.cache = null)

  this.add = (a, b) => a + b
  this.subtract = (a, b) => a - b
}

const calculadora = new Calculator()
let resultado = calculadora.add(40, 2)

calculadora.save(resultado)
calculadora.cache // => 42

// class constructor
class Calculus {
  constructor() {
    this.cache = null
  }

  save(num) {
    this.cache = num
    return `Saved ${this.cache}`
  }
  clear = () => (this.cache = null)

  add = (a, b) => a + b
  subtract = (a, b) => a - b
}

const calculator = new Calculus()
let result = calculator.add(40, 2) // => 42

calculator.save(result)
calculator.cache // => 42

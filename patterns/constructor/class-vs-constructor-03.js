// method to be mixed in
let makeAdder = () => {
  return {
    add: (a, b) => a + b,
  }
}

// method to be mixed in (implicit return syntax)
let makeSubtract = () => ({
  subtract: (a, b) => a - b,
})

// constructor function
const Calculator = function () {
  let state = {
    cache: null,
  }

  let makeStateSetter = () => ({
    save: (num) => (state.cache = num),
  })

  return Object.assign(state, makeStateSetter(), makeAdder(), makeSubtract())
}

const calculadora = new Calculator()
let resultado = calculadora.add(1, 2) // => 3

calculadora.save(resultado)
let p = calculadora.cache // => 3

// mixing in
const Caixa = function () {
  let state = {
    total: null,
    tax: 1.1,
  }

  let makeStateSetter = () => ({
    checkOut: (num) => (state.total = num * state.tax),
  })

  return Object.assign(state, makeAdder(), makeStateSetter())
}

const caixa = new Caixa()
let subTotal = caixa.add(40, 2) // => 42

caixa.checkOut(subTotal)
caixa.total // => 46.2

console.log(caixa)

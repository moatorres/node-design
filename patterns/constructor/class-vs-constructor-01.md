# Design Patterns

## `class` vs. `constructor`

Let's create a simple calculator function that takes two numbers

### Constructor Function

In this example we're saving results in memory. We only doing this to show that it creates a new instance of calculator.

```js
const CalculatorConstructor = function () {
  this.cache = null
  this.save = (num) => {
    this.cache = num
    return `Saved ${this.cache}`
  }

  this.add = (a, b) => a + b
  this.subtract = (a, b) => a - b
}
```

#### Usage

```js
const calculadora = new CalculatorConstructor()
const resultado = calculadora.add(40, 2)

calculadora.save(resultado)
calculadora.cache // => 42

const calculadoraNova = new CalculatorConstructor()
const resultadoNovo = calculadora.subtract(40, 2)

calculadoraNova.save(resultadoNovo)
calculadoraNova.cache // => 38

// calculator result does not get mutated as they are new instances
calculadora.cache // => 42
```

### Constructor Class

Similar to the constructor `function` example with added syntax sugar. Put any `this` properties into the constructor, which will also instantiate any initial params.

Methods have a slightly different syntax without `this` and cannot use arrow functions.

```js
class CalculatorClass {
  constructor() {
    this.cache = null
  }

  save(num) {
    this.cache = num
    return `Saved ${this.cache}`
  }

  add(a, b) {
    return a + b
  }
  subtract(a, b) {
    return a - b
  }
}
```

#### Usage

```js
let calc3 = new CalculatorClass()
let result3 = calc3.add(40, 2) // => 42
calc3.save(result3)
calc3.cache // => 42

let calc4 = new CalculatorClass()
let result4 = calc4.subtract(40, 2) // => 38
calc4.save(result4)
calc4.cache // => 38
```

The `class` works same as `function`

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns/blob/master/js-language/constructor_vs_classes/example_1.js) written by [@howardmann](https://github.com/howardmann)

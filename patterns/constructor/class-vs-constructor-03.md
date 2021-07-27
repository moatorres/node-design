# Design Patterns

## `class` vs. `constructor`

Let's create the same as example as our 1st calculator but using functional composition. Separate out methods into separate functions that return method objects. Advantage of this is it creates reusable functions that other constructors can use

### Method Objects

#### `makeAdder`

```js
let makeAdder = () => {
  return {
    add: (a, b) => a + b,
  }
}
```

#### `makeAdder`

With sugar syntax using `({ })` to return an object

```js
let makeSubtract = () => ({
  subtract: (a, b) => a - b,
})
```

### Constructor Function

Our constructor should match the following specifications:

- Save any state into a `state` object
- Separate method for anything affecting `state`, that **returns a new object method** with public method named `save`
- Expose an object with methods attaching to the initial `state` object

```js
let Calculator = function () {
  let state = {
    cache: null,
  }

  let makeStateSetter = () => ({
    save: (num) => (state.cache = num),
  })

  return Object.assign(state, makeStateSetter(), makeAdder(), makeSubtract())
}
```

#### Usage

```js
const calculadora = new Calculator()
let resultado = calculadora.add(1, 2) // => 3

calculadora.save(resultado)
let p = calculadora.cache // => 3
```

### Reusing Methods

Let's see how we can reuse the `adder` function in a separate piece of logic

#### `Caixa`

```js
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
```

#### Usage

```js
const caixa = new Caixa()
let subTotal = caixa.add(40, 2) // => 42

caixa.checkOut(subTotal)
caixa.total // => 46.2
```

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns/blob/master/js-language/constructor_vs_classes/example_3.js) written by [@howardmann](https://github.com/howardmann)

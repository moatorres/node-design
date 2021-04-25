# Design Patterns

## Module Function

The **Module Pattern** is a creational and structural design pattern which provides a way of encapsulating private members while producing a public API.

`IIFE:` **I**mmediately **I**nvoked **F**unction **E**xpression

```js
const Module = (function (num) {
  const infoPrivada = 1

  const api = {
    getInfo: function () {
      return infoPrivada
    },
    getDobro: function () {
      return api.getInfo() * num
    },
  }

  return api
})(5)

const numero = Module.getInfo()
console.log(numero) // => 1

const numero = Module.getDobro()
console.log(numero) // => 5
```

Equivalente a:

```js
const Module = ((num) => {
  const infoPrivada = 1

  return {
    getInfo: () => infoPrivada,
    getDobro: () => api.getInfo() * num,
  }
})(5)

const numero = Module.getInfo()
console.log(numero) // => 1

const numero = Module.getDobro()
console.log(numero) // => 5
```

### Credits

From the article [Design patterns in JavaScript](https://levelup.gitconnected.com/design-patterns-in-javascript-bbef243a5044) written by [Saroj Subedi](https://kaissaroj.medium.com/)

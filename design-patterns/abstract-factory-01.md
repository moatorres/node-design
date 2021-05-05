# Design Patterns

## Abstract Factory

The **Abstract Factory Pattern** is a creational design pattern that can be used to _define specific instances or classes without having to specify the exact object that is being created_.

```js
function Carro() {
  this.nome = 'Carro'
  this.pneus = 4
}

function Trator() {
  this.nome = 'Trator'
  this.pneus = 4
}

function Bike() {
  this.nome = 'Bike'
  this.pneus = 2
}

const veiculosFactory = {
  criarVeiculo: function (type) {
    switch (type.toLowerCase()) {
      case 'carro':
        return new Carro()
      case 'trator':
        return new Trator()
      case 'bike':
        return new Bike()
      default:
        return null
    }
  },
}

const carro = veiculosFactory.criarVeiculo('Carro')

console.log(carro) // => Carro { nome: "Carro", pneus: 4 }
```

### Credits

From the article [Design patterns in JavaScript](https://levelup.gitconnected.com/design-patterns-in-javascript-bbef243a5044) written by [Saroj Subedi](https://kaissaroj.medium.com/)

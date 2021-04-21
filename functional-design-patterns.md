### Factory Pattern

Factory Function is simply a function which returns an object, and this pattern does not require the new keyword to initialize object like in constructor. This pattern is great way of using functional programming in JavaScript as they are simply functions. Library like jQuery use factory functions.

Private properties and methods can be define in a factory. Just exclude them from returned object, they can still be accessed since a closure is formed.

```js
const Pessoa = (nome) => {
  function andar() {
    console.log(nome + ' está andando')
  }

  return {
    nome: nome,
    falar: function () {
      console.log('Meu nome é ' + this.nome)
    },
  }
}

const pessoa = Pessoa('Moa')

// `andar()` is private as it is not returned
pessoa.andar() // => TypeError: pessoa.andar is not a function
pessoa.falar() // => Meu nome é Moa
```

### Factory with Composition

This pattern is used to assign behaviors to objects, as opposed to inheriting many often unneeded behaviors.

**Behaviour factories**

```js
const beber = (tipo) => {
  const bebida = tipo || 'Água'
  return {
    beberAgora: () => console.log('Começou a beber ' + bebida),
  }
}

const comer = (tipo) => {
  const comida = tipo || 'Arroz'
  return {
    comerAgora: () => console.log('Começou a comer ' + comida),
  }
}
```

**Object factories**

```js
const novaPessoa = (bebida, comida) => {
  // merge our 'behaviour' objects
  return Object.assign({}, beber(bebida), comer(comida))
}

const pessoa = pessoa('vinho', 'noodles')

pessoa.beberAgora() // => "Começou a beber vinho"
pessoa.comerAgora() // => "Começøu a comer noodles"
```

### Module Pattern

The Module pattern is a creational and structural design pattern which provides a way of encapsulating private members while producing a public API.

Quando a função é `immediately invoked`, o `return value` vira a API pública

```js
// ES6
const Module = ((num) => {
  const infoPrivada = 1

  const api = {
    getInfo: () => infoPrivada,
    getDobro: () => api.getInfo() * num,
  }

  return api
})(5)

// sem ES6
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

### Prototype Pattern

The prototype pattern focuses on creating an object that can be used as a blueprint for other objects through prototypal inheritance. This pattern is inherently easy to work with in JavaScript because of the native support for prototypal inheritance in JS.

```js
function Welcome(name) {
  this.name = name
}

Welcome.prototype.sayHello = function () {
  return 'Hello, ' + this.name + '!'
}

const welcome = new Welcome('Shyam')
const output = welcome.sayHello()

console.log(output) // => "Hello, Shyam!"
```

### Singleton Pattern

The Singleton pattern is a design pattern that restricts the instantiation of a class to one object. After the first object is created, it will return the reference to the same one whenever called for an object.

```js
const Singleton = (function () {
  // instance stores a reference to the Singleton
  let instance

  function createInstance() {
    // private variables and methods
    const _infoPrivada = 'Sou uma variável privada'

    function _metodoPrivado_() {
      console.log('Eu sou um método privado')
    }
    return {
      // public methods and variables
      metodoPublico: function () {
        console.log('Eu sou um método público')
      },
      variavelPublica: 'Sou uma variável pública',
    }
  }
  return {
    // get the Singleton instance if it exists or create one if doesn't
    getInstance: function () {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    },
  }
})()

// there is no existing instance of Singleton, so it will create one
const instance1 = Singleton.getInstance()

// there is an instance of Singleton, so it will return the reference to this one
const instance2 = Singleton.getInstance()
console.log(instance1 === instance2) // => true

instance2.metodoPublico() // => 'Eu sou um método público'
```

### Abstract Factory Pattern

The Abstract Factory Pattern is a creational design pattern that can be used to define specific instances or classes without having to specify the exact object that is being created.

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

# Functional Programming

## Factory Pattern

A Factory Function is **a function which returns an object**. This pattern does not require the `new` keyword to initialize `object` like in `constructor`. This pattern is a great way of using functional programming in JavaScript as they are simply functions.

Private properties and methods can be defined in a factory by excluding them from returned object. They can still be accessed since a closure is formed.

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

pessoa.andar() // => TypeError: pessoa.andar is not a function
pessoa.falar() // => Meu nome é Moa
```

### Credits

From the article [Design patterns in JavaScript](https://levelup.gitconnected.com/design-patterns-in-javascript-bbef243a5044) written by [Saroj Subedi](https://kaissaroj.medium.com/)

# Design Patterns

## Factory Function

**Factory Functions** are _functions return new objects_. Factory functions do not require the `new` keyword to initialize an object because they are plain JavaScript functions.

Private properties and methods can be defined in a factory by excluding them from the returned object. Private properties can still be accessed since a closure is formed.

```js
const criarPessoa = (nome) => {
  function andar() {
    console.log(nome + ' está andando')
  }

  // private
  function comer() {
    console.log(nome + ' está comendo')
  }

  return {
    nome, // hoisted
    andar: andar,
    falar: function () {
      console.log('Meu nome é ' + this.nome)
    },
  }
}

const pessoa = criarPessoa('Moa')

pessoa.falar() // => Meu nome é Moa
pessoa.andar() // => Moa está andando
pessoa.comer() // => TypeError: pessoa.comer is not a function
```

### Credits

From the article [Design patterns in JavaScript](https://levelup.gitconnected.com/design-patterns-in-javascript-bbef243a5044) written by [Saroj Subedi](https://kaissaroj.medium.com/)

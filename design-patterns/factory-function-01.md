# Design Patterns

## Factory Function

**Factory Functions** are _functions return new objects_. Factory functions do not require the `new` keyword to initialize an object because they are plain JavaScript functions.

Private properties and methods can be defined in a factory by excluding them from the returned object. Private properties can still be accessed since a closure is formed.

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

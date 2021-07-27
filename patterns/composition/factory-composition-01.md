# Design Patterns

## Factory Composition

This pattern is used to assign **behaviors** to objects, as opposed to inheriting often unneeded behaviors.

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

### Credits

From the article [Design patterns in JavaScript](https://levelup.gitconnected.com/design-patterns-in-javascript-bbef243a5044) written by [Saroj Subedi](https://kaissaroj.medium.com/)

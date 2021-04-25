# Design Patterns

## Singleton Function

The **Singleton Pattern** is a design pattern that **restricts the instantiation of a class to one object**. After the first object is created, it will return the reference to the same one whenever called for an object.

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
```

### Usage

There is no existing instance of Singleton, so it will create one

```js
const instance1 = Singleton.getInstance()
```

There is an instance of Singleton, so it will return the reference to this one

```js
const instance2 = Singleton.getInstance()

instance2.metodoPublico() // => 'Eu sou um método público'
```

Check if `instance1` and `instance2` are actually the same instance

```js
console.log(instance1 === instance2) // => true
```

### Credits

From the article [Design patterns in JavaScript](https://levelup.gitconnected.com/design-patterns-in-javascript-bbef243a5044) written by [Saroj Subedi](https://kaissaroj.medium.com/)

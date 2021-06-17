# Functional Programming

## Prototype Pattern

The **Prototype Pattern** focuses on *creating an object that can be used as a blueprint for other objects* through prototypal inheritance. This pattern is inherently easy to work with in JavaScript because of the native support for prototypal inheritance in JS.

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

### Credits

From the article [Design patterns in JavaScript](https://levelup.gitconnected.com/design-patterns-in-javascript-bbef243a5044) written by [Saroj Subedi](https://kaissaroj.medium.com/)

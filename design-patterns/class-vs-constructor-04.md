# Design Patterns

## `class` vs. `constructor`

#### Classes using `extends` to create sub classes

Classes can inherit from other classes by using `extends`. This is the same as using `.call(this)` with constructor functions to inherit from other factory functions.

#### In general when writing your custom logic it is a bad idea to use inheritence — either `class` or `function` constructors

We should attempt to use functional composition, as it easier to test and reuse. However, a lot in other JS libraries use sub classes that inherit from master components.

```jsx
// like this
class Square extends React.Component
```

### Constructor Class

```js
class Person {
  constructor(name) {
    this.name = name
  }
  speak() {
    return `My name is ${this.name}`
  }
}

class Worker extends Person {
  constructor(name, profession) {
    super(name)
    this.profession = profession
  }

  // override parent method
  speak() {
    return `My name is ${this.name} and my profession is ${this.profession}`
  }
}
```

#### Usage

```js
let howie = new Person('howie')
howie.speak() // => My name is howie

let bob = new Worker('Bob', 'Builder')
bob.speak() // => My name is Bob and my profession is Builder
```

### Constructor Function

Function using inheritence with `.call(this)` to do same thing

```js
const PersonConstructor = function (name) {
  this.name = name
  this.speak = () => `My name is ${this.name}`
}

const WorkerConstructor = function (name, profession) {
  PersonConstructor.call(this, name)
  this.profession = profession
  this.speak = () =>
    `My name is ${this.name} and my profession is ${this.profession}`
}
```

#### Usage

```js
let hela = new PersonConstructor('hela')
hela.speak() // => My name is hela

let felix = new WorkerConstructor('felix', 'unemployed')
felix.speak() // => My name is felix and my profession is unemployed
```

##### In general it is a bad idea to use inheritence — either `class` or `function` constructors. Attempt to use functional composition, as it easier to test and reuse.

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns/blob/master/js-language/constructor_vs_classes/example_4.js) written by [@howardmann](https://github.com/howardmann)

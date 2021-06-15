# Design Patterns

## `class` vs. `constructor`

Let's create a `Person` constructor that asks for `name` and `strategy` and then speaks.

### Strategies

```js
let upperCase = {
  convert: (word) => word.toUpperCase(),
}

let lowerCase = {
  convert: (word) => word.toLowerCase(),
}
```

### Constructor Function

#### `function` constructor

```js
let PersonConstructor = function (name, strategy) {
  this.name = name
  this.strategy = strategy
  this.speak = () => this.strategy.convert(this.name)
}
```

#### Usage

```js
let vinicius = new PersonConstructor('Vinicius', upperCase)
vinicius.speak() // => VINICIUS

let felix = new PersonConstructor('Felix', lowerCase)
felix.speak() // => felix
```

### Constructor Class

#### `class` constructor

```js
class PersonClass {
  constructor(name, strategy) {
    this.name = name
    this.strategy = strategy
  }
  speak() {
    return this.strategy.convert(this.name)
  }
}
```

#### Usage

```js
let chico = new PersonClass('Chico', upperCase)
chico.speak() // => CHICO

let felicity = new PersonClass('Felicity', lowerCase)
felicity.speak() // => felicity
```

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns/blob/master/js-language/constructor_vs_classes/example_2.js) written by [@howardmann](https://github.com/howardmann)

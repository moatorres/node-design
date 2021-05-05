# Utilities

## Fluent

#### `fluent` function

Wraps a class' method in **fluent style**

```js
const fluent = (method) =>
  function (...args) {
    method.apply(this, args)
    return this
  }
```

#### `Person` class

```js
class Person {
  setName({ first, last }) {
    this.firstName = first
    this.lastName = last
  }

  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}

Person.prototype.setName = fluent(Person.prototype.setName)
```

### Usage

```js
const human = new Person()

const namedHuman = human.setName({ first: 'Chico', last: 'Science' })

console.log(namedHuman)
// => Person { firstName: 'Chico', lastName: 'Science' }

console.log(human.firstName) // => Chico
console.log(human.lastName) // => Science
console.log(human.fullName()) // => Chico Science
```

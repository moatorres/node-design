# Functional Programming

## Builder Pattern

When we want to create complicated object which has multiple parts, we can use a **Builder Pattern** that separates the building of these parts. This creational process does not care about how these parts are assembled.

Our **Builder** function works as a `Builder` object that can build a `Person` object. A `Person` object has 4 fields: `name`, `age`, `location`, `languages`.

```js
function PersonBuilder() {
  this.person = {}

  this.setName = (name) => {
    this.person.name = name
    return this
  }

  this.setAge = (age) => {
    this.person.age = age
    return this
  }

  this.setLocation = (location) => {
    this.person.location = location
    return this
  }

  this.setLanguages = (languages) => {
    this.person.languages = languages
    return this
  }

  this.buildInfo = () => this.person
}

module.exports = PersonBuilder
```

### Usage

```js
const PersonBuilder = require('./PersonBuilder')

const jack = new PersonBuilder()
  .setName('Jack')
  .setAge(25)
  .setLanguages(['English', 'German'])
  .buildInfo()

console.log(jack)

const adam = new PersonBuilder()
  .setName('Adam')
  .setLocation('US')
  .setLanguages(['English'])
  .buildInfo()

console.log(adam)
```

You can see that, instead of using:

```js
const person = new Person('jack', 25, undefined, ['English', 'German'])
```

We use `PersonBuilder` object with its methods to set value for fields, then we end with `buildInfo()` which return a real `Person` object:

```js
const jack = new PersonBuilder()
  .setName('Jack')
  .setAge(25)
  .setLanguages(['English', 'German'])
  .buildInfo()
```

Run with command: node app.js. Here is the result:

```js
{ name: 'Jack', age: 25, languages: [ 'English', 'German' ] }
{ name: 'Adam', location: 'US', languages: [ 'English' ] }
```

# Design Patterns

## Getter, Setter and Statics

Interfaces often consist mostly of *methods*, but it is also okay to include properties that hold non-function values. For example, `Map` objects have a `size` property that tells you how many keys are stored in them.

It is not even necessary for such an object to compute and store such a property directly in the instance. Even properties that are accessed directly may hide a method call. Such methods are called **getters**, and they are defined by writing `get` in front of the method name in an object expression or class declaration.

```js
let varyingSize = {
  get size() {
    return Math.floor(Math.random() * 100)
  },
}

console.log(varyingSize.size) // → 73
console.log(varyingSize.size) // → 49
```

Whenever someone reads from this object’s size property, the associated method is called. You can do a similar thing when a property is written to, using a setter.

```js
class Temperature {
  constructor(celsius) {
    this.celsius = celsius
  }
  get fahrenheit() {
    return this.celsius * 1.8 + 32
  }
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8
  }

  static fromFahrenheit(value) {
    return new Temperature((value - 32) / 1.8)
  }
}

let temp = new Temperature(22)
console.log(temp.fahrenheit) // → 71.6

temp.fahrenheit = 86
console.log(temp.celsius) // → 30
```

### Credits

From the book [Eloquent JavaScript](https://eloquentjavascript.net) written by [@marijnh](https://github.com/marijnh)

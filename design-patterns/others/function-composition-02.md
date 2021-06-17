## How to use powerful function composition in Javascript

**Function composition** is one of the most powerful differentiators between object-oriented and functional approaches to programming in **JavaScript**.

### Class hierarchy and RoboDog

In object-oriented programming, you define your classes.

For example, you specify a parent class `Animal` that has a method `move`. You continue by creating classes `Cat` and `Dog` which will inherit `move` from `Animal` and add their own methods `bark` and `meow`.

Then you decide to develop a class `Robot` which has a method `chargeBattery`.

To solve these and other issues, it is no longer recommended in object-oriented programming to use inheritance. Instead, you are expected to define an interface (which does not currently exist in JavaScript) for your class and instantiate classes that you would otherwise inherit to use them as dependencies.

Besides, your dependencies should be handled through dependency injection to improve your testability and flexibility, see [JavaScript Pure Functions for OOP developers](https://medium.com/front-end-weekly/javascript-pure-functions-for-oop-developers-5fc9020541a8).

Your class `RoboDog` will look like this:

```js
import { Animal, Dog } from './animals'
import { Robot } from './robots'

class RoboDog {
  constructor(animal, dog, robot) {
    this.animal = new animal()
    this.dog = new dog()
    this.robot = new robot()
  }
  move() {
    return this.animal.move()
  }
  bark() {
    return this.dog.bark()
  }
  chargeBattery() {
    return this.robot.chargeBattery()
  }
  roboBark() {
    return 2 * this.dog.bark()
  }
}

const roboDog = new RoboDog(Animal, Dog, Robot)

roboDog.roboBark()
```

### Function Composition

**Function composition** is based on the use of **monadic** (unary) curried and preferably **pure functions**

```js
// monadic (unary) function accepts only one argument
const monadic = one => one + 1

// this is not monadic (unary)
const notMonadic = (one, two) => one + two

// this is curry, monadic and higher-order function
const curry = one => two => one + two
```

**Function composition** is a quite simple use of multiple functions where each function receives input and hands over its output to the next function

```js
const plusOne = a => a + 1
const plusTwo = a => a + 2

const composedPlusThree = a => plusTwo(plusOne(a))

composedPlusThree(3) // => 6
```

In **functional programming**, you are defining expressions instead of statements. A function is just an expression as well, and as such, JavaScript supports **higher-order functions** that use a function as an argument or return a function as its output.

To make this even easier, you can define **higher-order functions** `compose` and `composePipe`:

```js
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

const composePipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
```

`compose` and `composePipe` differ in the order under which they compose functions together:

```js
const plusA = s => s + 'A'
const plusB = s => s + 'B'

const composed1 = s => compose(plusA, plusB)(s)
const composed2 = s => composePipe(plusA, plusB)(s)

composed1('') // BA
composed2('') // AB
```

Note that we could use a **point-free style of code (tacit programming)**:

```js
const composedPointFree = compose(plusA, plusB)

console.log(composedPointFree('') === composed1('')) // => true
```

This is possible because `compose(plusA, plusB)` is a **higher-order function**. compose returns a function that is used to define your new expression.

If you like Unix, you can also relate **function composition** to **Unix pipeline** which works on the same principle: `ls -l | grep key | less`.

### Function composition and RoboDog

The use of function composition is actually in a spirit similar to what we did in the object-oriented programming example with `RoboDog` and its dependencies. However, I believe that function composition is far more elegant.

You are not modelling your world using classes; you are only defining the functions that represent the desirable skills. Your final JavaScript module will be expressed like this:

```js
import { bark } from './dog'
import { compose } from './functional'

const doubleIt = a => 2 * a

export const roboBark = composePipe(bark, doubleIt)
```

### Break down your functions and use composition

You may be using functions as a box for a repeatable sequence of statements like this:

```js
function simonSays(arg) {
  let result = arg.trim()
  result = `Simon Says: ${result}`
  return result
}

simonSays('Jump!') // => Simon Says: Jump!
```

The above function trims the string argument, decorates it and then returns. In reality, it is not rare to see functions that are expressed by dozens of lines of code.

**Single responsibility principle** states that: *every function should have responsibility over a single part of the functionality*. That is open to interpretation, but I can easily claim that the above function both trimming and decorating does two things instead of one.

Let’s try doing the same with **function composition in JavaScript**:

```js
const trim = a => a.trim()
const add = a => b => a + b

const simonSays = composePipe(trim, add('Simon Says: '))

simonSays('Jump!') // => Simon Says: Jump!
```

Clean OOP:

```js
class MyClass {
  constructor (database) {
    this.database = database
  }

  myFunction () {
    return this.database.query()
  }
}
```

### Credits

- From the article [How to use powerful function composition in Javascript](https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983) written by [Martin Novak](https://meet-martin.medium.com/)

Similar articles:
- [JavaScript Pure Functions for OOP developers](https://medium.com/front-end-weekly/javascript-pure-functions-for-oop-developers-5fc9020541a8)
- [6 fundamental terms in functional JavaScript](https://medium.com/front-end-weekly/6-fundamental-terms-in-functional-javascript-e25d50d40b2c)
- [Making testable JavaScript code](https://medium.com/front-end-weekly/making-testable-javascript-code-2a71afba5120)
- [Imperative versus declarative code… what’s the difference?](https://medium.com/front-end-weekly/imperative-versus-declarative-code-whats-the-difference-adc7dd6c8380)

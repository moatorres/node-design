# Functional Programming

## Duck Typing

Although JavaScript supports the `class` syntax, these classes are not pure classes. This leads to a problem of implementing the concept of Interfaces in JavaScript as it uses the prototypal inheritance approach.

To rectify this, developers use the concept of duck typing to provide interfaces to JavaScript.

#### Duck typing is the way of implementing the concept of Interfaces in JavaScript

The Duck Test is a **form of abductive reasoning** which usually denotes the statement “If it walks like a duck and it quacks like a duck, then it must be a duck”.

Abductive reasoning is a form of logical inference that seeks to find the simplest and most likely conclusion from the observations. You can read more about abductive reasoning over [here](https://en.wikipedia.org/wiki/Abductive_reasoning).

### What is an Interface?

An **Interface** is a programming concept found in OOP languages. In Object-Oriented Programming, an `interface` is _a description of all functions that an object must have in order to be considered an object of type `X`_.

Interfaces define a standard that implementations must comply with. The purpose of interfaces is to allow the computer to enforce these properties and to know that an object of type `X` must have functions called `A`, `B` and `C`.

### Example

Since we are working with Duck Typing, let’s use an example that uses ducks. We have a Duck class that contains two methods — walk and quack.

```js
class Duck {
  walk() {
    console.log('Duck walk')
  }

  quack() {
    console.log('Duck quack')
  }
}
```

We have another class named Platypus that also contains two methods — walk and growl.

```js
class Platypus {
  walk() {
    console.log('Platypus walk')
  }

  growl() {
    console.log('Platypus growl')
  }
}
```

According to the Duck Typing concept, we can conclude that Platypus does not belong to the Duck type. This is because the class Platypus does not contain the method quack found in the class Duck. According to the Duck Typing concept, object B should contain the methods found in object A to be deemed as a type of object A.

Let’s take another class, Pelican which contains three methods — walk, quack and dive.

```js
class Pelican {
  walk() {
    console.log('Pelican walk')
  }

  quack() {
    console.log('Pelican quack')
  }

  dive() {
    console.log('Pelican dive')
  }
}
```

In this scenario, we can conclude that Pelican is of Duck type as it contains the methods walk and quack found in the Duck class. You might also note that the Pelican class has one additional method which cannot be found in the Duck class. This does not cause any problems according to the Duck Type concept. This is also the usual implementation with interfaces as well.

We can use the below piece of code to identify whether an object is of type Duck.

```js
function checkDuck(o) {
  if (typeof o.walk == 'function' && typeof o.quack == 'function') {
    return true
  }
  return false
}
```

### Usage

```js
let duck = new Duck()
let pelican = new Pelican()
let platypus = new Platypus()

console.log('Pelican implements Duck: ' + checkDuck(pelican))
console.log('Duck implements Duck: ' + checkDuck(duck))
console.log('Platypus implements Duck: ' + checkDuck(platypus))
```

### Credits

From the article [Duck Typing in JavaScript and TypeScript](https://blog.bitsrc.io/duck-typing-in-javascript-and-typescript-7cc834fadd64) written by [@Mahdhir](https://github.com/Mahdhir)

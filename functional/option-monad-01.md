# Functional Programming

## Option Monad

Get rid of a series of bugs like null-pointer exceptions, unhandled exceptions, and race conditions, by using monads.

What we'll cover:

- An introduction into category theory
- The definition of a monad
- Implementations of the Option (“Maybe”) monad, Either monad, and Future monad, plus a sample program leveraging them, in JavaScript

### Introduction to Category Theory

**Category theory** is a mathematical field that was actively developed in the middle of the 20th century. Now it is the basis of many functional programming concepts including the **monad**. Let’s take a quick look into some category theory concepts, tuned for software development terminology.

So there are three core concepts that define a category:

1. _Type_ is just as we see it in statically typed languages. Examples: `Int`, `String`, `Dog`, `Cat`, etc.
2. _Functions_ connect two types. Therefore, they can be represented as an arrow from one type to another type, or to themselves. Function `f` from type `T` to type `U` can be denoted as `f : T → U`. You can think of it as a programming language function that takes an argument of type `T` and returns a value of type `U`.
3. _Composition_ is an operation, denoted by the `⋅` operator, that builds new functions from existing ones. In a category, it’s always guaranteed for any functions `f : T → U` and `g : U → V` there exists a unique function `h : T → V`. This function is denoted as `f ⋅ g`. The operation effectively maps a pair of functions to another function. In programming languages, this operation is, of course, always possible. For instance, if you have a function that returns a length of a string — `strlen : String → Int` — and a function that tells if the number is even — `even : Int → Boolean` — then you can make a function `even_strlen : String → Boolean` which tells if the length of the String is even. In this case `even_strlen = even ⋅ strlen`.

Composition implies two features:

1. Associativity: `f⋅g⋅h = (f⋅g) ⋅ h = f ⋅ (g⋅h)`.
2. The existence of an identity function: `∀T : ∃f : T → T`, or in plain English, for every type `T` there exists a function that maps `T` to itself.

Here is where **monad solutions** come to the rescue: they **isolate all unstable operations into super-small and very well-audited pieces of code** — then you can use stable calculations in your whole app.

```js
class Monad {
  // pure :: a -> M a
  pure = () => {
    throw 'pure method needs to be implemented'
  }

  // flatMap :: # M a -> (a -> M b) -> M b
  flatMap = (x) => {
    throw 'flatMap method needs to be implemented'
  }

  // map :: # M a -> (a -> b) -> M b
  map = (f) => this.flatMap((x) => new this.pure(f(x)))
}

export class Option extends Monad {
  // pure :: a -> Option a
  pure = (value) => {
    if (value === null || value === undefined) {
      return none
    }
    return new Some(value)
  }

  // flatMap :: # Option a -> (a -> Option b) -> Option b
  flatMap = (f) => (this.constructor.name === 'None' ? none : f(this.value))

  // equals :: # M a -> M a -> boolean
  equals = (x) => this.toString() === x.toString()
}

class None extends Option {
  toString() {
    return 'None'
  }
}

// cached None class value
export const none = new None()
Option.pure = none.pure

export class Some extends Option {
  constructor(value) {
    super()
    this.value = value
  }

  toString() {
    return `Some(${this.value})`
  }
}
```

### Credits

From the article [](https://www.toptal.com/javascript/option-maybe-either-future-monads-js) writen by [@alleycat-at-git](https://github.com/alleycat-at-git)

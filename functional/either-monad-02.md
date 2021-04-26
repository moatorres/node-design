# Functional Programming

## Either Monad

This is basically the same as the `Option` monad, but `Some` is now called `Right` and `None` is called `Left`. But this time, `Left` is also allowed to have an underlying value.

We need that because it’s very convenient to express throwing an exception. If an exception occurred, then the value of the `Either` will be `Left(Exception)`. The `flatMap` function doesn’t progress if the value is `Left`, which repeats the semantics of throwing exceptions: if an exception happened, we stop further execution.

Also note that it’s easy to catch exceptions: all you have to do is map `Left` to `Right`. (Although, we don’t do it in our examples, for brevity.)

#### `Either` extends `Monad`

Similar to the `Option` monad

```js
import Monad from './monad'

export class Either extends Monad {
  // pure :: a -> Either a
  pure = (value) => {
    return new Right(value)
  }

  // flatMap :: # Either a -> (a -> Either b) -> Either b
  flatMap = (f) => (this.isLeft() ? this : f(this.value))

  isLeft = () => this.constructor.name === 'Left'
}
```

#### `Left` extends `Either`

Similar to `None` in the `Option` monad

```js
export class Left extends Either {
  constructor(value) {
    super()
    this.value = value
  }

  toString() {
    return `Left(${this.value})`
  }
}
```

#### `Right` extends `Either`

Similar to `Some` in the `Option` monad

```js
export class Right extends Either {
  constructor(value) {
    super()
    this.value = value
  }

  toString() {
    return `Right(${this.value})`
  }
}
```

#### Usage

Abstract example representation of an `attempt` method that utilizes `Either`

```js
// attempt :: (() -> a) -> M a
Either.attempt = (f) => {
  try {
    return new Right(f())
  } catch (e) {
    return new Left(e)
  }
}

Either.pure = new Left(null).pure
```

### Credits

From the article [](https://www.toptal.com/javascript/option-maybe-either-future-monads-js) writen by [@alleycat-at-git](https://github.com/alleycat-at-git)

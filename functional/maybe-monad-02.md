# Functional Programming

## `Maybe` monad with `prototype`

Maybes allow us to gracefully work with data that might be `null` and to have defaults. A `maybe` is a constiable that either has some value or it doesn’t. And it doesn’t matter to the caller.

On its own, it might seem like this is not that big a deal. Everybody knows that nullchecks are easily accomplished with an `if-else` statement:

```js
if (getUsername() == null ) {
username = 'Anonymous') {
else {
username = getUsername();
}
```

`Maybes` are just **tools to help us keep the logic flowing through the pipeline**. To implement `Maybe`, we’ll first need to create some `constructors`.

- The `Maybe` monad constructor, empty for now

```js
const Maybe = function () {}
```

- The `None` instance, a wrapper for an object **without** a value

```js
const None = function () {}

None.prototype = Object.create(Maybe.prototype)

None.prototype.toString = function () {
  return 'None'
}

// now we can write the `none` function instead of `new None()` all the time
const none = function () {
  return new None()
}
```

- The `Just` instance, a wrapper for an `object` **with** a value

```js
const Just = (x) => (this.value = x)

Just.prototype = Object.create(Maybe.prototype)
Just.prototype.toString = function () {
  return 'Just ' + this.value
}

const just = function (x) {
  return new Just(x)
}
```

Finally, we can write the `maybe` function. It returns a new function that either returns `nothing` or a `maybe`. It is a **`functor`**.

```js
const maybe = function (m) {
  if (m instanceof None) {
    return m
  } else if (m instanceof Just) {
    return just(m.value)
  } else {
    throw new TypeError(
      'Error: Just or None expected, ' + m.toString() + 'given.'
    )
  }
}
```

And we can also create a **functor generator** just like we did with arrays.

```js
const maybeOf = function (f) {
  return function (m) {
    if (m instanceof None) {
      return m
    } else if (m instanceof Just) {
      return just(f(m.value))
    } else {
      throw new TypeError(
        'Error: Just or None expected, ' + m.toString() + ' given.'
      )
    }
  }
}
```

So `Maybe` is a monad, `maybe` is a functor, and `maybeOf` returns a _functor that is already assigned to a morphism_.

We’ll need one more thing before we can move forward. We’ll need to add a method to the `Maybe` monad object that helps us use it more intuitively.

```js
Maybe.prototype.orElse = function (y) {
  if (this instanceof Just) {
    return this.value
  } else {
    return y
  }
}
```

In its raw form, `Maybe` can be used directly.

```js
maybe(just(123)).value // Returns 123
maybeOf(plusplus)(just(123)).value // Returns 124
maybe(plusplus)(none()).orElse('none') // returns 'none'
```

But the real power of `Maybe` will become clear when the dirty business of directly calling the `none()` and `just()` functions is abstracted. We’ll do this with an example object `User`, that uses `Maybe` for the `username`.

```js
// initially set to `none`
const User = function () {
  this.username = none()
}

// it's now a `just
User.prototype.setUsername = function (name) {
  this.username = just(str(name))
}

User.prototype.getUsernameMaybe = function () {
  const usernameMaybe = maybeOf.curry()(str)
  return usernameMaybe(this.username).orElse('anonymous')
}

const user = new User()

user.getUsernameMaybe() // Returns 'anonymous'
user.setUsername('Laura')
user.getUsernameMaybe() // Returns 'Laura'
```

And now we have a powerful and safe way to define defaults.

### Credits

From the book [Functional Programming in JavaScript](http://sd.blackball.lv/library/Functional_Programming_in_JavaScript_(2015).pdf) written by [@dan-nix](https://github.com/dan-nix)

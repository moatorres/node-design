# Functional Programming

## Lenses

Another reason why programmers really like monads is that they make writing libraries very easy. To explore this, let’s extend our `User` object with more _functions for getting and setting values_ but, instead of using getters and setters, we’ll use **lenses**.

Lenses are first-class getters and setters. They allow us to not just `get` and `set` constiables, but also to run functions over it. But _instead of mutating the data, they clone and return the new data modified by the function_. They force data to be immutable, which is great for security and consistency as well for libraries. They’re great for elegant code no matter what the application, so long as the performance-hit of introducing additional array copies is not a critical issue.

Before we write the `lens()` function, let’s look at how it works.

```js
const first = lens(
  function (a) {
    return arr(a)[0]
  }, // get
  function (a, b) {
    return [b].concat(arr(a).slice(1))
  } // set
)

first([1, 2, 3]) // outputs 1

first.set([1, 2, 3], 5) // outputs [5, 2, 3]

function tenTimes(x) {
  return x * 10
}

first.modify(tenTimes, [1, 2, 3]) // outputs [10,2,3]
```

And here’s how the `lens()` function works. It returns a function with `get`, `set` and `mod` defined. The `lens()` function itself is a _functor_.

```js
const lens = fuction(get, set) {
  const f = function (a) {
    return get(a)
    }

  f.get = function (a) {
    return get(a)
  }

  f.set = set

  f.mod = function (f, a) {
    return set(a, f(get(a)))
  }

  return f
};
```

Let’s try an example. We’ll extend our User object from the previous example.

```js
// userName :: User -> str
const userName = lens(
  function (u) {
    return u.getUsernameMaybe()
  }, // get
  function (u, v) {
    // set
    u.setUsername(v)
    return u.getUsernameMaybe()
  }
)

const bob = new User()

bob.setUsername('Bob')
userName.get(bob) // => 'Bob'
userName.set(bob, 'Bobby') //return 'Bobby'
userName.get(bob) // => 'Bobby'
userName.mod(strToUpper, bob) // => 'BOBBY'
strToUpper.compose(userName.set)(bob, 'robert') // => 'ROBERT'
userName.get(bob) // => 'robert'
```

### Credits

From the book [Functional Programming in JavaScript](https://www.packtpub.com/product/functional-programming-in-javascript/9781784398224) written by [@dan-nix](https://github.com/dan-nix)

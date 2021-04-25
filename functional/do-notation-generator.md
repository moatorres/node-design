### `do-notation` generator

It's also nice to note that do-notation can easily be implemented with generators (as co.js and redux-saga do):

```js
function Do(m, f) {
  const gen = f()

  function doRec(v = undefined) {
    const { value, done } = gen.next(v)
    const valueM = value instanceof m ? value : m.of(value)
    return done ? valueM : valueM.then(doRec)
  }

  return doRec()
}
```

It can be used with any monad that implements `.of` and `.then` (being `.then == bind`), for example:

```js
function generateUserURL(userMaybe) {
  return Do(Maybe, function* () {
    let user = yield userMaybe
    let name = yield user.name
    return user.hasPage ? nameToURL(name) : null
  })
}
```

Or

```js
// Promise.of = Promise.resolve;
Do(Promise, function*() {
  const [user, friends] = yield Promise.all([
    getUserData(userId)
    getUserFriends(userId)
  ])

  return { ...user, friends }
})
```

It won't work with the list (Array) monad, though, because JS generators are stateful (Generator.prototype.next mutates the generator). That is, the following example can't be done in JS without special syntax or stateless (rewindable?) generators:

```js
// Array.of = a => [a];
// Array.prototype.then = function(f) {
//    return [].concat.apply([], this.map(f));
// };

Do(Array, function* () {
  let a = yield [1, 2, 3]
  let b = yield ['a', 'b']
  console.log(a, b)
})

// but the following naturally works:
;[1, 2, 3].then((a) => {
  ;['a', 'b'].then((b) => console.log(a, b))
})
```

It is possible to make it work for Array, although it is probably slow:

```js
function Do(m) {
  return function (gen) {
    return (function run(as) {
      return function (a) {
        const g = gen()
        as.forEach((a) => g.next(a))
        const { value, done } = g.next(a)
        if (done) {
          return m.of(value)
        }
        return value.flatMap(run(as.concat(a)))
      }
    })([])()
  }
}

Array.do = Do(Array)

const result = Array.do(function* () {
  const x = yield [1, 2]
  const y = yield [3, 4]
  return x + y
})

console.log(result) //=> [4, 5, 5, 6]
```

### Credits

From this [gist](https://gist.github.com/MaiaVictor/bc0c02b6d1fbc7e3dbae838fb1376c80) written by [@MaiaVictor](https://github.com/MaiaVictor/)

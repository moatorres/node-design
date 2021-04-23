### `I/O` monad utility

This is an example of an `I/O` monad in JavaScript

#### `infra.js`

```js
let cache = new Map()
let pending = new Map()

function fetchTextSync(url) {
  if (cache.has(url)) {
    return cache.get(url)
  }

  if (pending.has(url)) {
    throw pending.get(url)
  }

  let promise = fetch(url)
    .then((response) => response.text())
    .then((text) => {
      pending.delete(url)
      cache.set(url, text)
    })

  pending.set(url, promise)
  throw promise
}

async function runPureTask(task) {
  for (;;) {
    try {
      return task()
    } catch (promiseOrError) {
      if (promiseOrError instanceof Promise) {
        await promiseOrError
      } else {
        throw promiseOrError
      }
    }
  }
}
```

#### `program.js`

```js
function getUserName(id) {
  var user = JSON.parse(fetchTextSync('/users/' + id))
  return user.name
}

function getGreeting(name) {
  if (name === 'Seb') {
    return 'Hey'
  }
  return fetchTextSync('/greeting')
}

function getMessage() {
  let name = getUserName(123)
  return getGreeting(name) + ', ' + name + '!'
}

runPureTask(getMessage).then((message) => console.log(message))
```

#### Credits

From this [gist](https://gist.github.com/sebmarkbage/2c7acb6210266045050632ea611aebee) written by [@sebmarkbage](https://gist.github.com/sebmarkbage)

# Functional Programming

## Either Monad

The **Future monad** is basically **a container for a value which is either available now or will be available** in the near future. You can make chains of _Futures_ with `map` and `flatMap` that will wait for the `Future` value to be resolved **before executing the next piece of code** that depends on the value being resolved first. This is very similar to concept of Promises in JS.

Our **design goal** now **is to bridge the existing async APIs** in different languages to one consistent base. It turns out that the easiest design approach is using callbacks in `constructor`.

While the callback design introduced the callback hell problem in JavaScript and other languages, it will not be a problem for us, since we use monads. In fact, the `Promise` object—the basis for JavaScript’s solution to callback hell—is a monad itself.

What about the constructor of the Future monad? Is has this signature:

`constructor :: ((Either err a -> void) -> void) -> Future (Either err a)`

Let’s split it into pieces. First, let’s define:

`type Callback = Either err a -> void`

So `Callback` is a function which takes either an error or a resolved value as an argument, and returns nothing. Now our signature looks like this:

`constructor :: (Callback -> void) -> Future (Either err a)`

So we need to supply it a function that returns nothing and triggers a callback as soon as async computation is resolved to either an error or some value.

The basic flow is: we start the async computation supplied as the constructor argument, and point its callback to our internal callback method. In the meantime, we can subscribe to the Future monad and put your callbacks into the queue. Once the computation is done, the internal callback method calls all callbacks in the queue.

The public API of the Future monad consists of `pure`, `map`, and `flatMap`, just like in the previous monads. We’ll also need a couple of handy methods:

1. **`async`**, which takes a synchronous blocking function and executes it on a separate thread
2. **`traverse`**, which takes an array of values and function that maps a value to a `Future`, and returns a `Future` of an array of resolved values

```js
import Monad from './monad'
import { Either, Left, Right } from './either'
import { none, Some } from './option'

export class Future extends Monad {
  // constructor :: ((Either err a -> void) -> void) -> Future (Either err a)
  constructor(f) {
    super()
    this.subscribers = []
    this.cache = none
    f(this.callback)
  }

  // callback :: Either err a -> void
  callback = (value) => {
    this.cache = new Some(value)
    while (this.subscribers.length) {
      const subscriber = this.subscribers.shift()
      subscriber(value)
    }
  }

  // subscribe :: (Either err a -> void) -> void
  subscribe = (subscriber) =>
    this.cache === none
      ? this.subscribers.push(subscriber)
      : subscriber(this.cache.value)

  toPromise = () =>
    new Promise((resolve, reject) =>
      this.subscribe((val) =>
        val.isLeft() ? reject(val.value) : resolve(val.value)
      )
    )

  // pure :: a -> Future a
  pure = Future.pure

  // flatMap :: (a -> Future b) -> Future b
  flatMap = (f) =>
    new Future((cb) =>
      this.subscribe((value) =>
        value.isLeft() ? cb(value) : f(value.value).subscribe(cb)
      )
    )
}

Future.async = (nodeFunction, ...args) => {
  return new Future((cb) =>
    nodeFunction(...args, (err, data) =>
      err ? cb(new Left(err)) : cb(new Right(data))
    )
  )
}

Future.pure = (value) => new Future((cb) => cb(Either.pure(value)))

// traverse :: [a] -> (a -> Future b) -> Future [b]
Future.traverse = (list) => (f) =>
  list.reduce(
    (acc, elem) =>
      acc.flatMap((values) => f(elem).map((value) => [...values, value])),
    Future.pure([])
  )
```

Notice how the public API of Future doesn’t contain any low-level details like threads, semaphores, or any of that stuff. All you need is basically to supply something with a callback, and that’s it.

### Usage

Say we have a file with a list of URLs and we want to fetch each of these URLs in parallel. Then, we want to cut the responses to 200 bytes each, for brevity, and print out the result.

We start off by converting existing language APIs to monadic interfaces (see the functions readFile and fetch). Now that we have that,  we can just compose them to get the final result as one chain. Note that the chain itself is super safe, as all the gory details are contained in monads.

```js
import { Future } from './future'
import { Either, Left, Right } from './either'
import { readFile } from 'fs'
import https from 'https'

const getResponse = (url) =>
  new Future((cb) =>
    https.get(url, (res) => {
      var body = ''
      res.on('data', (data) => (body += data))
      res.on('end', (data) => cb(new Right(body)))
      res.on('error', (err) => cb(new Left(err)))
    })
  )

const getShortResponse = (url) =>
  getResponse(url).map((resp) => resp.substring(0, 200))

Future.async(readFile, 'resources/urls.txt')
  .map((data) => data.toString().split('\n'))
  .flatMap((urls) => Future.traverse(urls)(getShortResponse))
  .map(console.log)
```

### Credits

From the article [Option/Maybe, Either, and Future Monads in JavaScript, Python, Ruby, Swift, and Scala](https://www.toptal.com/javascript/option-maybe-either-future-monads-js) written by [@alleycat-at-git](https://github.com/alleycat-at-git)

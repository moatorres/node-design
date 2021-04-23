### The `Maybe` monad

In essence, a monad is simply a wrapper around a value. We can create that with an object that holds a single property:

```js
var Maybe = function (val) {
  this.__value = val
}

var maybeOne = new Maybe(1)
```

Typing that new keyword everywhere is a pain though (and has other problems). It would be nice to have a shortcut like `Promise.resolve()`. So we **create a class method** `of()`:

```js
Maybe.of = function (val) {
  return new Maybe(val)
}

var maybeOne = Maybe.of(1)
```

Because the point of our `Maybe` monad is to protect us from empty values (like `null` and `undefined`), we’ll **write a helper method** to test the value in our `Maybe`:

```js
Maybe.prototype.isNothing = function () {
  return this.__value === null || this.__value === undefined
}
```

Now we write a method that will let us get the value and do something with it. But we’ll also put a **guard** on it, to protect us from those pesky `null` and `undefined` values. We’ll call the method `map`, since it maps from one value to another.

```js
Maybe.prototype.map = function (f) {
  if (this.isNothing()) {
    return Maybe.of(null)
  }
  return Maybe.of(f(this.__value))
}
```

This is already enough to be useful. We can rewrite our `getUserBanner()` function so that it uses a `Maybe` to protect us from empty values:

```js
function getUserBanner(banners, user) {
  return Maybe.of(user)
    .map(prop('accountDetails'))
    .map(prop('address'))
    .map(prop('province'))
    .map(prop(R.__, banners))
}
```

If any of those prop calls returns `undefined` then `Maybe` just skips over it. We don’t have to catch or throw any errors. `Maybe` just quietly takes care of it.

This looks a lot like our `Promise` pattern. We have something that creates the monad, `Maybe.of()`, rather like `Promise.resolve()`. And then we have a chain of `.map()` methods that do something with the value, rather like `.then()`. A `Promise` lets us write code without worrying about whether data is asynchronous or not. The `Maybe` monad lets us write code without worrying whether data is empty or not.

Now, what if we got excited about this whole `Maybe` thing, and decided to write a function to grab the banner URL? We could return a `Maybe` for that function too:

```js
var getProvinceBanner = function (province) {
  return Maybe.of(banners[province])
}
```

With that done, we can add it in to our `getUserBanner()` function:

```js
function getUserBanner(user) {
  return Maybe.of(user)
    .map(prop('accountDetails'))
    .map(prop('address'))
    .map(prop('province'))
    .map(getProvinceBanner)
}
```

But now we have a problem. Instead of returning a `Maybe` with a string inside it, we get back a `Maybe` with another `Maybe` inside it. To do something with the value, I would have to add a `map` inside a `map`:

```js
getUserBanner(user)
  .map(function(m) {
    m.map(function(banner) {
        // I now have the banner,
        // but this is too many maps
    }
})
```

We need a way of flattening nested `Maybes` back down—join them together, you might say. So we create a `.join()` method that will unwrap an outer `Maybe` if we have them double-wrapped:

```js
Maybe.prototype.join = function () {
  return this.__value
}
```

This lets us flatten back to just one layer. So we can add in the `join` to `getUserBanner()`:

```js
function getUserBanner(user) {
  return Maybe.of(user)
    .map(prop('accountDetails'))
    .map(prop('address'))
    .map(prop('province'))
    .map(getProvinceBanner)
    .join()
}
```

That gets us back to one layer of `Maybe`. So we can work with functions that pass back `Maybes`. But, if we’re mapping and joining a lot, we might as well combine them into a single method. It allows us to chain together functions that return `Maybes`:

```js
Maybe.prototype.chain = function (f) {
  return this.map(f).join()
}
```

Now, using `.chain()`, our function has one less step:

```js
function getUserBanner(user) {
  return Maybe.of(user)
    .map(R.prop('accountDetails'))
    .map(R.prop('address'))
    .map(R.prop('province'))
    .chain(getProvinceBanner)
}
```

And because Ramda’s `path()` handles missing values in a sensible way, we can reduce this down even further:

```js
function getUserBanner(user) {
  return Maybe.of(user)
    .map(path(['accountDetails', 'address', 'province']))
    .chain(getProvinceBanner)
}
```

With `chain()` we now have a way of interacting with functions that return other `Maybe` monads. Notice that with this code, there’s no if-statements in sight. We don’t need to check every possible little thing that might be missing. If a value is missing, the next step just isn’t executed.

You may be thinking, “That’s all well and good, but my banner value is still wrapped up inside a `Maybe`. How do I get it out again?” And that’s definitely a legitimate question. But let me ask you another question first: “Do you need to get it out?”

Think about it for a moment. When you wrap a value up inside a `Promise`, you never get it out again. The event loop moves on, and you can never come back to the context you started with. Once you wrap the value in the `Promise`, you never unwrap it. And it’s just fine. We work inside callback functions to do what we need to do. It’s not a big deal.

Unwrapping a `Maybe` kind of defeats the purpose of having it at all. Eventually though, you will want to do something with your value. And we need to decide what to do if the value is `null` at that point. With our example, we will want to add our banner to the DOM. What if we wanted to have a fallback banner to use if we get back an empty `Maybe`? For this we’ll need one more little method:

```js
Maybe.prototype.orElse = function(default) {
  if (this.isNothing()) {
    return Maybe.of(default)
  }
  return this
}
```

Now, if our visiting user happens to come from Nunavut, we can at least show something. And since we’ve got that sorted, let’s also grab the banner element from the DOM. We’ll wrap it up in a `Maybe` too, since it’s possible someone could change the HTML on us.

```js
// Provide a default banner with .orElse()
var bannerSrc = getUserBanner(user).orElse('/assets/banners/default-banner.jpg')

// Grab the banner element and wrap it in a Maybe too.
var bannerEl = Maybe.of(document.querySelector('.banner > img'))
```

Now we have two `Maybes`: `bannerSrc` and `bannerEl`. We want to use them both together to set the banner image (our original problem). Specifically, we want to set the src attribute of the DOM element in `bannerEl` to be the string inside `bannerSrc`. What if we wrote a function that expected two `Maybes` as inputs?

```js
var applyBanner = function (mBanner, mEl) {
  mEl.__value.src = mBanner.__value
  return mEl
}

applyBanner(bannerSrc, bannerEl)
```

This would work just fine, until one of our values was `null`. Because we’re pulling values out directly, we’re not checking to see if the value is empty. It defeats the entire purpose of having things wrapped in a `Maybe` to start with. With `.map()`, we have a nice interface where our functions don’t need to know anything about `Maybe`. Instead, they just deal with the values they’re passed. If only there was some way to use `.map()` with our two `Maybes`…

Let’s rewrite our `applyBanner()` as if we were just working with regular values:

```js
var curry = require('ramda').curry

var applyBanner = curry(function (el, banner) {
  el.src = banner
  return el
})
```

Note that we’ve curried the function. Now, what happens if we run `.map()` with `applyBanner()`?

```js
bannerEl.map(applyBanner) // => Maybe([function])
```

We get a function wrapped in a `Maybe`. Now, stay with me. This isn’t as crazy as it might seem. The basic building block of functional programming is first-class functions. And all that means is that we can pass functions around just like any other variable. So why not stick one inside a `Maybe`? All we need then is a version of `.map()` that works with a Maybe-wrapped function. In other words, a method that applies the wrapped function to our `Maybe` with a value. We’ll call it `.ap` for short:

```js
Maybe.prototype.ap = function (someOtherMaybe) {
  return someOtherMaybe.map(this.__value)
}
```

Remember that in the context above, `this.__value` is a function. So we’re using map the same way we have been all along—it just applies a normal function to a `Maybe`. Putting it together we get:

```js
var mutatedBanner = bannerEl.map(applyBanner).ap(bannerSrc)
```

This works, but isn’t super clear. To read this code we have to remember that `applyBanner` takes two parameters. Then also remember that it’s partially applied by `bannerEl.map()`. And then it’s applied to `bannerSrc`.

It would be nicer if we could say “Computer, I’ve got this function that takes two regular variables. Transform it into one that works with `Maybe` monads.”

We can do just that with a function called `liftA2` (‘2’ because we have two parameters):

```js
var liftA2 = curry(function (fn, m1, m2) {
  return m1.map(fn).ap(m2)
})
```

Note that we assume `fn` is curried. We now have a neat function that can take another function and make it work with our `Maybes`:

```js
var applyBannerMaybe = liftA2(applyBanner)
var mutatedBanner = applyBannerMaybe(bannerEl, bannerSrc)
```

Mission accomplished. We’re now able to pluck the `province` value from deep within the user preference object. We can use that to look up a banner value, and then apply it to the DOM, safely, without a single if-statement.

We can just keep mapping and chaining without a care in the world. Using `Maybe`, I don’t have to think about all the checks for null. The monad takes care of that for me.

#### Pointfree style

Now, at this point you may be thinking “Hold on just a second there, Sir. You keep talking about functional programming, but all I see is objects and methods. Where’s the function composition?”

That is a valid objection. But we’ve been writing functional JavaScript all along, just using a different style. We can transform all these methods into plain functions easily:

```js
// map :: Monad m => (a -> b) -> m a -> m b
var map = curry(function (fn, m) {
  return m.map(fn)
})

// chain :: Monad m => (a -> m b) -> m a -> m b
var chain = curry(function (fn, m) {
  return m.chain(fn)
})

// ap :: Monad m => m (a -> b) -> m a -> m b
var ap = curry(function (mf, m) {
  // mf, not fn, because this is a wrapped function
  return mf.ap(m)
})

// orElse :: Monad m => m a -> a -> m a
var orElse = curry(function (val, m) {
  return m.orElse(val)
})
```

With that done, we can write the whole thing in a more **pointfree style**:

```js
var pipe = require('ramda').pipe
var bannerEl = Maybe.of(document.querySelector('.banner > img'))
var applyBanner = curry(function (el, banner) {
  el.src = banner
  return el
})

// customiseBanner :: Monad m => String -> m DOMElement
var customiseBanner = pipe(
  Maybe.of,
  map(R.path(['accountDetails', 'address', 'province'])),
  liftA2(applyBanner, bannerEl)
)

customiseBanner(user)
```

There are still two impure functions, but `customiseBanner` is now pointfree. And here’s were things start to get interesting…

Note that when we defined the functional forms of `map`, `chain`, `ap` etc. we didn’t include any mention of `Maybe`. This means that any object that implements `.map()` can work with the `map` function. Any object that implements `.chain()` can work with `chain`. And so on. Imagine if we had other objects that implemented these methods…

#### Pipelines

To show how this works, I’m going to break all the rules for a moment. I’m going to alter the `Promise` prototype. Note that this is being performed by a trained professional under controlled conditions. Do not try this at home:

```js
Promise.of = Promise.resolve
Promise.prototype.map = Promise.prototype.then
Promise.prototype.chain = Promise.prototype.then
Promise.prototype.ap = function (otherPromise) {
  return this.then(otherPromise.map)
}
```

With this done, I can now do things like this:

```js
// set the innerHTML attribute on an element
var setHTML = curry(function (el, htmlStr) {
  el.innerHTML = htmlStr
  return el
})

// get an element
var getEl = compose(Promise.of, document.querySelector)

// fetch an update from a server somewhere
var fetchUpdate = compose(Promise.of, $.getJSON)

// process update
var processUpdate = pipe(
  map(R.path(['notification', 'message'])),
  liftA2(setHTML, getEl('.notifications'))
)

//
var updatePromise = fetchUpdate('/path/to/update/api')

processUpdate(updatePromise)
```

Take a moment to look at that `processUpdate` function again. We’ve defined a pipeline that takes a monad input and then map and lift to transform it. But there’s nothing in the pipeline that assumes we’re working with a `Promise`. The pipeline would work just as well with our `Maybe` monad. And, in fact, it would work with any object that meets the [Fantasyland Monad Spec](https://github.com/fantasyland/fantasy-land).

So, let’s recap what we’ve looked at:

A monad is like a `Promise` in that you don’t act on a value directly. Instead, we use map to apply a callback, just like then with `Promises`.

The `Maybe` monad will only map if it has a value. So, when we map a `Maybe`, we don’t have to worry about `null` or `undefined` values.

If we use monad libraries that conform to a specification, we can compose pipelines. These pipelines can work interchangeably with different types of monad.

### Credits

From the article [THE MARVELLOUSLY MYSTERIOUS JAVASCRIPT MAYBE MONAD](https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/) written by [@jrsinclair](https://github.com/jrsinclair)

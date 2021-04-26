# Functional Programming

## Either Monad

To explore the topic, we’ll attempt to solve an example problem. Imagine we’re writing a function to display a list of notifications. We’ve already managed (somehow) to get the data back from the server. But, for whatever reason, the backend engineers decided to send it in CSV format rather than JSON. The raw data might look something like this:

```
timestamp,content,viewed,href
2018-10-27T05:33:34+00:00,@madhatter invited you to tea,unread,https://example.com/invite/tea/3801
2018-10-26T13:47:12+00:00,@queenofhearts mentioned you in 'Croquet Tournament' discussion,viewed,https://example.com/discussions/croquet/1168
2018-10-25T03:50:08+00:00,@cheshirecat sent you a grin,unread,https://example.com/interactions/grin/88
Now, eventually, we want to render this code as HTML. It might look something like this:
```

That we would need to show in HTML:

```html
<ul class="MessageList">
  <li class="Message Message--viewed">
    <a href="https://example.com/invite/tea/3801" class="Message-link"
      >@madhatter invited you to tea</a
    >
    <time datetime="2018-10-27T05:33:34+00:00">27 October 2018</time>
  </li>
  <li class="Message Message--viewed">
    <a href="https://example.com/discussions/croquet/1168" class="Message-link"
      >@queenofhearts mentioned you in 'Croquet Tournament' discussion</a
    >
    <time datetime="2018-10-26T13:47:12+00:00">26 October 2018</time>
  </li>
  <li class="Message Message--viewed">
    <a href="https://example.com/interactions/grin/88" class="Message-link"
      >@cheshirecat sent you a grin</a
    >
    <time datetime="2018-10-25T03:50:08+00:00">25 October 2018</time>
  </li>
</ul>
```

To keep the problem simple, for now, we’ll just focus on processing each line of the CSV data. We start with a few simple functions to process the row. The first one we’ll use to split the fields:

```js
function splitFields(row) {
  return row.split(',')
}
```

Once we’ve split the data, we want to create an object where the field names match the CSV headers. We’ll assume we’ve already parsed the header row somehow. Note that we throw an error if the length of the row doesn’t match the header row (and `_.zipObject` is a **lodash** function):

```js
function zipRow(headerFields, fieldData) {
  if (headerFields.length !== fieldData.length) {
    throw new Error('Row has an unexpected number of fields')
  }
  return _.zipObject(headerFields, fieldData)
}
```

After that, we’ll add a human-readable date to the object, so that we can print it out in our template. It’s a little verbose, as JavaScript doesn’t have awesome built-in date formatting support. Note that it throws an error for an invalid date:

```js
function addDateStr(messageObj) {
  const errMsg = 'Unable to parse date stamp in message object'
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const d = new Date(messageObj.datestamp)
  if (isNaN(d)) {
    throw new Error(errMsg)
  }

  const datestr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  return { datestr, ...messageObj }
}
```

And finally, we take our object and pass it through a template function to get an HTML string:

```js
const rowToMessage = _.template(`<li class="Message Message--<%= viewed %>">
  <a href="<%= href %>" class="Message-link"><%= content %></a>
  <time datetime="<%= datestamp %>"><%= datestr %></time>
<li>`)
```

If we end up with an error, it would also be nice to have a way to print that too:

```js
const showError = _.template(`<li class="Error"><%= message %></li>`)
```

And once we have all of those in place, we can put them together to create our function that will process each row:

```js
function processRow(headerFieldNames, row) {
  try {
    fields = splitFields(row)
    rowObj = zipRow(headerFieldNames, fields)
    rowObjWithDate = addDateStr(rowObj)
    return rowToMessage(rowObj)
  } catch (e) {
    return showError(e)
  }
}
```

### Exceptions: The good parts

The thing to note is that in the above example, any of the steps in the `try` block might `throw` an error. In `zipRow()` and `addDateStr()`, we intentionally throw errors. And if a problem happens, then we simply `catch` the error and show whatever message the error happens to have on the page.

Without this mechanism, the code gets really ugly. Here’s what it might look like without exceptions. Instead of throwing exceptions, we’ll assume that our functions will return `null`:

```js
function processRowWithoutExceptions(headerFieldNames, row) {
  fields = splitFields(row)
  rowObj = zipRow(headerFieldNames, fields)
  if (rowObj === null) {
    return showError(
      new Error('Encountered a row with an unexpected number of items')
    )
  }

  rowObjWithDate = addDateStr(rowObj)
  if (rowObjWithDate === null) {
    return showError(new Error('Unable to parse date in row object'))
  }

  return rowToMessage(rowObj)
}
```

We **don’t** have a way for each step **to tell us what the error message should be, or why they failed**. We have to guess, and explicitly call `showError()` if the function returns `null`.

**To write our own pure error handling code we need to always return a `value`**. What if we returned an `Error` object on failure? Wherever we were throwing an error, we just return it instead. That might look something like this:

```js
function processRowReturningErrors(headerFieldNames, row) {
  fields = splitFields(row)
  rowObj = zipRow(headerFieldNames, fields)
  if (rowObj instanceof Error) {
    return showError(rowObj)
  }

  rowObjWithDate = addDateStr(rowObj)
  if (rowObjWithDate instanceof Error) {
    return showError(rowObjWithDate)
  }

  return rowToMessage(rowObj)
}
```

We’ve moved responsibility for the error messages **back into the individual functions**. But that’s about it. We’ve still got all of those if statements.

It **would be really nice if there was some way we could encapsulate the pattern**. In other words, if we know we’ve got an error, don’t bother running the rest of the code.

### Polymorphism

**Polymorphism** means “providing a single interface to entities of different types”. In JavaScript, we do this by creating objects that have methods with the same name and signature. But we give them different behaviors.

A classic example of this is application logging. We might want to send our logs to different places depending on what environment we’re in. So, we define two logger objects.

**Both objects define a `log` function that expects a single `string` parameter, but they behave differently.**

```js
const consoleLogger = {
  log: function log(msg) {
    console.log('This is the console logger, logging:', msg)
  },
}

const ajaxLogger = {
  log: function log(msg) {
    return fetch('https://example.com/logger', { method: 'POST', body: msg })
  },
}
```

The beauty of this is that we can write code that calls `.log()`, but doesn’t care which object it’s using.

It might be a `consoleLogger` or an `ajaxLogger`. It works either way. For example, the code below would work equally well with either object:

```js
function log(logger, message) {
  logger.log(message)
}
```

Another example is the `.toString()` method on all JS objects. Perhaps we could create two classes that implement `.toString()` differently. We’ll call them `Left` and `Right`:

```js
class Left {
  constructor(val) {
    this._val = val
  }
  toString() {
    const str = this._val.toString()
    return `Left(${str})`
  }
}
class Right {
  constructor(val) {
    this._val = val
  }
  toString() {
    const str = this._val.toString()
    return `Right(${str})`
  }
}
```

Now, let’s create a function that will call `.toString()` on those two objects:

```js
function trace(val) {
  console.log(val.toString())
  return val
}

trace(new Left('Hello world')) // => Left(Hello world)

trace(new Right('Hello world')) // => Right(Hello world)
```

### Left and Right

Getting back to our problem, **we want to define a happy path and a sad path for our code**. On the happy path, we just keep happily running our code until an error happens or we finish. If we end up on the sad path though, we don’t bother with trying to run the code anymore.

We’ll call our sad path `Left` and our happy path `Right` just to stick with convention.

Let’s **create a method that will take a function and run it if we’re on the happy** path, but ignore it if we’re on the sad path:

```js
class Left {
  constructor(val) {
    this._val = val
  }
  runFunctionOnlyOnHappyPath() {
    // Left is the sad path. Do nothing
  }
  toString() {
    const str = this._val.toString()
    return `Left(${str})`
  }
}

class Right {
  constructor(val) {
    this._val = val
  }
  runFunctionOnlyOnHappyPath(fn) {
    return fn(this._val)
  }
  toString() {
    const str = this._val.toString()
    return `Right(${str})`
  }
}
```

Then we could do something like this:

```js
const leftHello  = new Left('Hello world');
const rightHello = new Right('Hello world');

leftHello.runFunctionOnlyOnHappyPath(trace); // does nothing


rightHello.runFunctionOnlyOnHappyPath(trace); // => "Hello world"
.map()
```

Our `.runFunctionOnlyOnHappyPath()` method now returns the `_value` property.

That makes things inconvenient **if we want to run more than one function** because we no longer know if we’re on the happy path or the sad path. That information **is gone as soon as we take the value outside of `Left` or `Right`**.

So, what we can do instead is return a `Left` or `Right` with a new `_value` inside. And we’ll shorten the name while we’re at it.

What we’re doing is mapping a function from the world of plain values to the world of Left and Right. So we call the method `.map()`:

```js
class Left {
  constructor(val) {
    this._val = val
  }
  map() {
    // Left is the sad path
    // so we do nothing
    return this
  }
  toString() {
    const str = this._val.toString()
    return `Left(${str})`
  }
}

class Right {
  constructor(val) {
    this._val = val
  }
  map(fn) {
    return new Right(fn(this._val))
  }
  toString() {
    const str = this._val.toString()
    return `Right(${str})`
  }
}
```

With that in place, we can use `Left` or `Right` with a fluent-style syntax:

```js
const leftHello = new Left('Hello world')
const rightHello = new Right('Hello world')
const worldToCity = (str) => str.replace(/world/, 'City')

leftHello.map(worldToCity).map(trace) // doesn't return anything

rightHello.map(worldToCity).map(trace) // => Right(Hello City)
```

We’ve effectively created two tracks. We can put a piece of data on the right track by calling `new Right()` and put a piece of data on the left track by calling new `new Left()`.

If we map along the right track, we follow the happy path and process the data. If we end up on the left path though, nothing happens. We just keep passing the value down the line.

As we go on, it gets to be a bit of a pain writing “a left or a right” all the time. So we’ll refer to the left and right combo together as “`Either`”. It’s either a `left` or a `right`.

### Shortcuts for making Either objects

The next step would be to rewrite our example functions so that they return an `Either`. A `left` for an `Error`, or a `right` for a `value`. But, before we do that, let’s take some of the tedium out of it. We’ll write a couple of little shortcuts.

The first is a static method called `.of()` that returns a `new Left` or `new Right` and a few shortcuts:

```js
Left.of = function of(x) {
  return new Left(x)
}

Right.of = function of(x) {
  return new Right(x)
}

function left(x) {
  return Left.of(x)
}

function right(x) {
  return Right.of(x)
}
```

With those in place, we can start rewriting our application functions:

```js
function zipRow(headerFields, fieldData) {
  const lengthMatch = headerFields.length == fieldData.length
  return !lengthMatch
    ? left(new Error('Row has an unexpected number of fields'))
    : right(_.zipObject(headerFields, fieldData))
}

function addDateStr(messageObj) {
  const errMsg = 'Unable to parse date stamp in message object'
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const d = new Date(messageObj.datestamp)
  if (isNaN(d)) {
    return left(new Error(errMsg))
  }

  const datestr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  return right({ datestr, ...messageObj })
}
```

With that done, we can start reworking our main function that processes a single row. We’ll start by putting the row string into an `Either` with `right()`, and then map `splitFields()` to split it:

```js
function processRow(headerFields, row) {
  const fieldsEither = right(row).map(splitFields)
  // …
}
```

This works just fine, but we get into trouble when we try the same thing with `zipRow()`:

```js
function processRow(headerFields, row) {
  const fieldsEither = right(row).map(splitFields)
  const rowObj = fieldsEither.map(zipRow /* wait. this isn't right */)
  // ...
}
```

This is because `zipRow()` expects two parameters. But functions we pass into `.map()` only get a single value from the `._value` property. One way to fix this is to create a curried version of `zipRow()`. It might look something like this:

```js
function zipRow(headerFields) {
  return function zipRowWithHeaderFields(fieldData) {
    const lengthMatch = headerFields.length == fieldData.length
    return !lengthMatch
      ? left(new Error('Row has an unexpected number of fields'))
      : right(_.zipObject(headerFields, fieldData))
  }
}
```

This slight change makes it easier to transform `zipRow()` so it will work nicely with `.map()`:

```js
function processRow(headerFields, row) {
    const fieldsEither   = right(row).map(splitFields);
    const rowObj         = fieldsEither.map(zipRow(headerFields));
    // ... But now we have another problem ...
}
.join()
```

Using `.map()` to run `splitFields()` is fine, **as `splitFields()` doesn’t return an `Either`**.

But `zipRow()` returns an `Either`. So, **if we use `.map()` with it, we end up sticking an `Either` inside an `Either`**.

If we go any further, we’ll be stuck unless we run `.map()` inside `.map()`. **We need some way to join those nested `Either`** together into one.

We’ll write a new method called `.join()`:

```js
class Left {
  constructor(val) {
    this._val = val
  }
  map() {
    // Left is the sad path
    // so we do nothing
    return this
  }
  join() {
    // On the sad path, we don't
    // do anything with join
    return this
  }
  toString() {
    const str = this._val.toString()
    return `Left(${str})`
  }
}

class Right {
  constructor(val) {
    this._val = val
  }
  map(fn) {
    return new Right(fn(this._val))
  }
  join() {
    if (this._val instanceof Left || this._val instanceof Right) {
      return this._val
    }
    return this
  }
  toString() {
    const str = this._val.toString()
    return `Right(${str})`
  }
}
```

Now we’re free to un-nest our values:

```js
function processRow(headerFields, row) {
    const fieldsEither   = right(row).map(splitFields);
    const rowObj         = fieldsEither.map(zipRow(headerFields)).join();
    const rowObjWithDate = rowObj.map(addDateStr).join();
    // Slowly getting better... but what do we return?
}
.chain()
```

This pattern of calling `.map()` and `.join()` together is so common that we’ll create a shortcut method for it. We’ll call it `.chain()` because it **allows us to chain together functions that return `Left` or `Right`**:

```js
class Left {
  constructor(val) {
    this._val = val
  }
  map() {
    // Left is the sad path
    // so we do nothing
    return this
  }
  join() {
    // On the sad path, we don't
    // do anything with join
    return this
  }
  chain() {
    // Boring sad path,
    // do nothing.
    return this
  }
  toString() {
    const str = this._val.toString()
    return `Left(${str})`
  }
}

class Right {
  constructor(val) {
    this._val = val
  }
  map(fn) {
    return new Right(fn(this._val))
  }
  join() {
    if (this._val instanceof Left || this._val instanceof Right) {
      return this._val
    }
    return this
  }
  chain(fn) {
    return fn(this._val)
  }
  toString() {
    const str = this._val.toString()
    return `Right(${str})`
  }
}
```

Going back to our railway track analogy, **`.chain()` allows us to switch rails if we come across an error**. With that in place, our code is a little clearer:

```js
function processRow(headerFields, row) {
  const fieldsEither = right(row).map(splitFields)
  const rowObj = fieldsEither.chain(zipRow(headerFields))
  const rowObjWithDate = rowObj.chain(addDateStr)
  // Slowly getting better... but what do we return?
}
```

### Doing something with the values

Eventually, we want to **take different action depending on whether we have a `Left` or `Right`**.

So we’ll write a function that will take different action accordingly:

```js
function either(leftFunc, rightFunc, e) {
  return e instanceof Left ? leftFunc(e._value) : rightFunc(e._value)
}
```

We’ve cheated and used the inner values of the `Left` or `Right` objects. But we’ll pretend you didn’t see that. We’re now able to finish our function:

```js
function processRow(headerFields, row) {
  const fieldsEither = right(row).map(splitFields)
  const rowObj = fieldsEither.chain(zipRow(headerFields))
  const rowObjWithDate = rowObj.chain(addDateStr)
  return either(showError, rowToMessage, rowObjWithDate)
}
```

We could write it using a fluent syntax:

```js
function processRow(headerFields, row) {
  const rowObjWithDate = right(row)
    .map(splitFields)
    .chain(zipRow(headerFields))
    .chain(addDateStr)
  return either(showError, rowToMessage, rowObjWithDate)
}
```

Note that in `processRow()`, the only time we mention `left` or `right` is at the very start when we call `right()`. For the rest, we just use the `.map()` and `.chain()` methods to apply the next function.

### `.ap()` and `lift`

Let’s take a look at how we might process the whole CSV data, rather than just each row. We’ll need a helper function or three:

```js
function splitCSVToRows(csvData) {
  // There should always be a header row... so if there's no
  // newline character, something is wrong.
  return csvData.indexOf('n') < 0
    ? left('No header row found in CSV data')
    : right(csvData.split('n'))
}

function processRows(headerFields, dataRows) {
  // Note this is Array map, not Either map.
  return dataRows.map((row) => processRow(headerFields, row))
}

function showMessages(messages) {
  return `<ul class="Messages">${messages.join('n')}</ul>`
}
```

So, we have a helper function that splits the CSV data into rows. And we get an `Either` back. Now, we can use `.map()` and some **lodash** functions to split out the header row from data rows. But we end up in an interesting situation…

```js
function csvToMessages(csvData) {
  const csvRows = splitCSVToRows(csvData)
  const headerFields = csvRows.map(_.head).map(splitFields)
  const dataRows = csvRows.map(_.tail)
  // What’s next?
}
```

We have our header fields and data rows all ready to map over with `processRows()`. But headerFields and dataRows are both wrapped up inside an `Either`. We need some way to convert `processRows()` to a function that works with `Either`.

As a first step, we will **curry** `processRows`:

```js
function processRows(headerFields) {
  return function processRowsWithHeaderFields(dataRows) {
    // Note this is Array map, not Either map.
    return dataRows.map((row) => processRow(headerFields, row))
  }
}
```

We have `headerFields`, which is an `Either` wrapped around an array. What would happen if we were to take `headerFields` and call `.map()` on it with `processRows()`?

```js
function csvToMessages(csvData) {
  const csvRows = splitCSVToRows(csvData)
  const headerFields = csvRows.map(_.head).map(splitFields)
  const dataRows = csvRows.map(_.tail)

  // How will we pass headerFields and dataRows to
  // processRows() ?
  const funcInEither = headerFields.map(processRows)
}
```

Using `.map()` here calls the outer function of `processRows()`, but not the inner one. In other words, `processRows()` returns a function. And because it’s `.map()`, we still get an `Either` back.

So we end up with a function inside an `Either`. I gave it away a little with the variable name. funcInEither is an `Either`. It contains a function that takes an array of strings and returns an array of different strings. We need some way to take that function and call it with the value inside dataRows.

To do that, we need to add one more method to our `Left` and `Right` classes. We’ll call it `.ap()` because the standard tells us to. The way to remember it is to recall that ap is short for “apply.” It helps us apply values to functions.

The method for the `Left` does nothing, as usual. And for the `Right` class, the variable name spells out that we expect the other Either to contain a function:

```js
// code is hidden to save space
// `apply` in Left
ap() {
    return this;
}
```

So, with that in place, we can finish off our main function:

```js
function csvToMessages(csvData) {
  const csvRows = splitCSVToRows(csvData)
  const headerFields = csvRows.map(_.head).map(splitFields)
  const dataRows = csvRows.map(_.tail)
  const funcInEither = headerFields.map(processRows)
  const messagesArr = dataRows.ap(funcInEither)
  return either(showError, showMessages, messagesArr)
}
```

Now, I’ve mentioned this before, but I find `.ap()` a little confusing to work with. Another way to think about it is to say: “I have a function that would normally take two plain values. I want to turn it into a function that takes two Eithers.” Now that we have `.ap()`, we can write a function that will do exactly that.

We’ll call it `liftA2()`, again because it’s a standard name. It takes a plain function expecting two arguments, and “lifts” it to work with applicatives. (Applicatives are things that have an `.ap()` method and an `.of()` method.) So, `liftA2()` is short for “lift applicative, two parameters.”

So, `liftA2()` might look something like this:

```js
function liftA2(func) {
  return function runApplicativeFunc(a, b) {
    return b.ap(a.map(func))
  }
}
```

So, our top-level function would use it like this:

```js
function csvToMessages(csvData) {
  const csvRows = splitCSVToRows(csvData)
  const headerFields = csvRows.map(_.head).map(splitFields)
  const dataRows = csvRows.map(_.tail)
  const processRowsA = liftA2(processRows)
  const messagesArr = processRowsA(headerFields, dataRows)
  return either(showError, showMessages, messagesArr)
}
```

**Please don’t use the implementation from this tutorial**. Try one of the well-established libraries like [`Crocks`](), [`Sanctuary`](), [`Folktale`](), or [`Monet`](). They’re better maintained, and we’ve papered over some things for the sake of simplicity.

### Credits

From the article [Elegant Error Handling with the JavaScript Either monad](https://blog.logrocket.com/elegant-error-handling-javascript-either-monad/) written by [@jrsinclair](https://github.com/jrsinclair)
[Try on CodePen](https://codepen.io/jrsinclair/pen/GYbJaW?editors=0010)

##### Related articles

- [Professor Frisby’s Mostly Adequate Guide to Functional Programming](https://github.com/MostlyAdequate/mostly-adequate-guide) by Brian Lonsdorf
- [The Fantasy Land Specification](https://github.com/fantasyland/fantasy-land)
- [Practical Intro to Monads in JavaScript: Either](https://tech.evojam.com/2016/03/21/practical-intro-to-monads-in-javascript-either/) by Jakub Strojewski

# Design Patterns

## Composable Factory Functions

This article is about using `pipe` and `compose` to improve the way we write procedural code.

### What is procedural code?

Procedural code is sequence based code. Think of it as a list of functions executed one after the other to produce some sort of output. Let’s look at an example. Given an array of numbers, we want to remove any numbers less than 10 and sort the numbers from lowest to highest.

```js
const numbers = [1, 4, 100, 2, 47, 20, 187]
const result = numbers.filter((number) => number > 10).sort((a, b) => a - b)
// => result = [20, 47, 100, 187]
```

This is a nice way to write procedural code. Unfortunately, we cannot chain all our JavaScript functions together this easily.

JavaScript only lets us chain `filter()` and `sort()` together because it knows that these functions will always:

- accept a single argument of an array
- return a single array as a result

When we write our own functions, JavaScript has no idea if the return type of our function will line up with another functions input type. JavaScript does not trust us, not even for a second. So it doesn’t let us chain functions together. This is actually a **good thing**. It stops us from writing buggy software.

### What are pipe and compose?

`pipe` and `compose` are functions that make it easy for us to chain functions together. They help us to write simpler, more declarative and more scalable procedural code.

Let’s look under the hood.

```js
const pipe = (...fns) => (a) => fns.reduce((b, f) => f(b), a)
```

So `pipe` is a curried function (its takes multiple arguments, one at a time). The first argument it takes is a list of functions. These are the sequence of functions we want to run, one after the other. The second argument is the value for the argument of the first function.

Internally, `pipe` uses reduce to run each function in the list, passing the starting value `a` to the first function in the list. It then returns the result of the first function to the next function and so on.

```js
pipe(
  firstFunction,
  secondFunction,
  thirdFunction
)('argument passed to firstFunction')
```

`compose` is the same as `pipe`, but is reduces right to left…

```js
const compose = (...fns) => (a) => fns.reduceRight((y, f) => f(y), a)

compose(
  thirdFunction,
  secondFunction,
  firstFunction
)('argument passed to firstFunction')
```

#### The Rules

Remember what I said about JavaScript not trusting us? Well we can still write horrible bugs using `pipe` if we aren’t careful. Here are the rules we need follow to make things work.

- The first function may have any arity (accept any number of arguments)
- The remaining functions must be unary (accept only a single argument)
- The types must align eg the return value type of `firstFunction` must match the input type of `secondFunction` and so on.

Let’s look at a real life example to show how we can use pipe. This example is very similar to something I worked on with a TV broadcasting company. You can also view the [full and final demo in code sandbox](https://codesandbox.io/s/pipe-demo-602gi).

### A quick demo

We have an API which returns a list of shows for a given channel. It looks something like this:

```js
{
  channelCode: 'output-2',
  shows: [
    {
      name: 'Spongebob',
      start: 1561867200000,
      end: 1561869000000,
    },
    ...121 more shows
  ]
}
```

For our app, we need to do some transformations to the payload we receive:

- the `channelCode` represents the physical output location of the video stream. We need to map this to the actual name of the TV channel. eg `output-2` maps to `kids`
- given the start and end times of a given show, calculate and attach the duration of the show

Let’s write some functions that do the required transformations as stated above. It doesn’t matter too much about how these functions work. They take our API response and return a new copy of the API response, but with some transformation made to it.

```js
// add duration(ms) for all shows in API response
const addDuration = (response) => {
  const formattedShows = response.shows.map((show) => ({
    duration: show.end - show.start,
    ...show,
  }))
  return {
    ...response,
    shows: formattedShows,
  }
}

// add channel name for all shows in API response
const addChannel = (response) => {
  const channelMap = [
    { code: 'output-1', name: 'music' },
    { code: 'output-2', name: 'kids' },
    { code: 'output-3', name: 'news' },
  ]
  const match = channelMap.find(
    (channel) => channel.code === response.channelCode
  )
  return {
    channelName: match.name,
    ...response,
  }
}
```

Now we need to write some procedural code that will perform the sequence of transformations on our api response.

#### Without pipe 😓

```js
// detch our shows data
const response = api.getShows()
const parsed = JSON.parse(response)
const withDuration = addDuration(parsed)
const formattedShows = addChannel(withDuration)
```

This approach works. It’s valid code, but it has some issues.

- It requires us to create, name and maintain variables whose sole purpose is to store a functions return value
- No declarative indication that this code is procedural. You need to read all the variable names closely before you see this
- Updating this code it harder. Each time we add or remove a step of the procedure, we must also add or remove a variable name.

Let’s improve this code using `pipe`!

#### With pipe 😎

```js
import { pipe } from 'ramda'

const response = await fetch('api.com/output-2/shows')
const formattedShows = pipe(JSON.parse, addDuration, addChannel)(response)
```

This approach is better for a few reasons.

1. We are **not creating unnecessary variables**. This reduces the noise and cognitive load required to read the code.
2. The code is also **more declarative**. It describes what the code should do, rather than the implementation of how to do it.
3. It is **easier to update** — just add or remove functions to the pipe. No need to come up with more variable names.

So our `pipe` function is working great. Then the boss tells us about a new feature…

### Refactor time

This new feature we are working on requires us to refactor the `addChannel()` function. The function needs to be able to accept different values for `channelMap`. We can solve this by adding a second argument to the `addChannel()` function.

```js
// add channel name for all shows in API response
const addChannel = (channelMap, response) => {
  const match = channelMap.find((channel) => channel.code === response.channel)
  return {
    channelName: match.name,
    ...response,
  }
}
```

##### The remaining functions must be **unary**(accept only a single argument)

Let’s use the power of currying to let us pass multiple arguments to a function in our `pipe`. Currying is where we create functions that accept multiple arguments, one at a time.

This means we would now call the `addChannel` function like this:

```js
addChannel(channelMap)(response)
```

Currying is a useful technique when we are using composition techniques that require functions to be unary, eg have a single argument.

First we curry the `addChannel` function

```js
// add channel name for all shows in API response
const addChannel = (channelMap) => (response) => {
  const match = channelMap.find((channel) => channel.code === response.channel)
  return {
    channelName: match.name,
    ...response,
  }
}
```

Now we can create a re-usable pipe function like so:

```js
import { pipe } from 'rambda'

const CHANNEL_MAP = [
  { code: 'output-1', name: 'music' },
  { code: 'output-2', name: 'news' },
  { code: 'output-3', name: 'kids' },
]

const CHANNEL_MAP_BRANDED = [
  { code: 'output-1', name: 'MTV' },
  { code: 'output-2', name: 'Sky' },
  { code: 'output-3', name: 'Nickelodeon' },
]

const response = await fetch(api.com / output - 2 / shows)

const formatShows = (channelMap, payload) =>
  pipe(JSON.parse, addDuration, addChannel(channelMap))(payload)

const formattedShows = formatShows(CHANNEL_MAP, response)

const brandedShows = formatShows(CHANNEL_MAP_BRANDED, response)
```

This works because `addChannel(CHANNEL_MAP)` returns a function with the value for `CHANNEL_MAP` in its closure scope.

### Usage

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { pipe } from 'rambda'
import ReactJson from 'react-json-view'

import getShows from './api'

import './styles.css'

// add duration(ms) for all shows in API response
const addDuration = (response) => {
  const formattedShows = response.shows.map((show) => ({
    duration: show.end - show.start,
    ...show,
  }))
  return {
    ...response,
    shows: formattedShows,
  }
}

// add channel name for all shows in api response
const addChannel = (channelMap) => (response) => {
  const match = channelMap.find(
    (channel) => channel.code === response.channelCode
  )
  return {
    channelName: match.name,
    ...response,
  }
}

const CHANNEL_MAP = [
  { code: 'output-1', name: 'music' },
  { code: 'output-2', name: 'kids' },
  { code: 'output-3', name: 'news' },
]

const CHANNEL_MAP_BRANDED = [
  { code: 'output-1', name: 'MTV' },
  { code: 'output-2', name: 'Nickelodeon' },
  { code: 'output-3', name: 'Sky' },
]

// fetch our shows from the (fake) API
const response = getShows()

// ⭐️ the reusable pipe function ⭐️
const formatShows = (channelMap, payload) =>
  pipe(JSON.parse, addDuration, addChannel(channelMap))(payload)

const formattedShows = formatShows(CHANNEL_MAP, response)
const brandedShows = formatShows(CHANNEL_MAP_BRANDED, response)

// create simple ui for displaying shows data
function App() {
  const sharedProps = {
    displayDataTypes: false,
    displayObjectSize: false,
  }

  return (
    <div className="App">
      <p>formattedShows</p>
      <ReactJson src={formattedShows} {...sharedProps} />
      <p>brandedShows</p>
      <ReactJson src={brandedShows} {...sharedProps} />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

### Credits

From the article [Using pipe and compose to improve procedural code](https://medium.com/dailyjs/using-pipe-and-compose-to-improve-procedural-code-ddf2c18094fd) written by [@simonschwartz](https://github.com/simonschwartz)

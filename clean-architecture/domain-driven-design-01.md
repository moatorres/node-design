# Clean Architecture

## Domain-Driven Design

Although ES6 defines sugar for writing classes in a more OOP way, it still is what it is: sugar over prototypal inheritance. Since functions are first-class citizens in javascript, we’re going to apply a more functional approach to DDD than an object-oriented one. We’re going to favor:

- modules and factory functions as an encapsulation mechanism over classes
- immutability and pure functions over mutable classes
- higher-order functions for dependency inversion and dependency injection over interfaces (well…because there is no interface in javascript)

This logic is implemented in the different aggregates/entities/value objects/domain services. We’re going to use modules and factory functions as encapsulation mechanisms. Let’s say we have a “Foo” aggregate type, we want to implement its data structure and the behaviors acting on the data, and the repository method for getting and saving a “Foo” aggregate in the database. Since we are in the domain layer, we must only define abstractions for the repository methods. Here what might be the folder structure :

```sh
├── projectName/
|   ├── domain/
|   |   ├── foo/
|   |   |   ├── behaviors.js
|   |   |   ├── data.js
|   |   |   ├── getFooOfId.js
|   |   |   ├── saveFoo.js
```

- the `projectName/domain/foo` module groups everything related to our “Foo” aggregate
- the `projectName/domain/foo/data.js` file contains the factory function used to create an immutable “Foo” data structure :

```js
// data.js
const FooData = ({ id, foo, bar, foobaz }) =>
  Object.freeze({
    id,
    foo,
    bar,
    foobaz,
  })

module.exports = {
  FooData,
}
```

- the `projectName/domain/foo/behaviors.js` file contains the behaviors function acting on `FooData`. These are **pure functions** that take a `FooData` with some additional parameters needed to apply the behavior and return a new `FooData` immutable structure. Let’s say that our “Foo” aggregate has a really useful business rule stating that when the `bar` value is set then the `foobaz` value should be set to `42` if the `bar` value contains a “?”:

```js
// behaviors.js
const { FooData } = require('./data')

const updateBar = ({ fooData, bar }) => {
  if (typeof bar !== typeof '') {
    throw new Error('bar should be a valid string')
  }
  return FooData({
    ...fooData,
    bar,
    foobaz: bar.indexOf('?') === -1 ? fooData.foobaz : 42,
  })
}

module.exports = {
  updateBar,
}
```

<sup>A very useful behavior! In a real project, this function should be named according to the ubiquitous language, not with a “setter” logic</sup>

- the `projectName/domain/foo/getFooOfId.js` is the higher-order function that we must use to build a concrete getFooOfId implementation. We are in javascript so nothing really forces us to use this method but it acts as a documentation of the domain needs:

```js
// getFoodOfId.js
const { FooData } = require('./data')

const getFooOfId = (
  getFooOfIdImpl = async (fooId) => {
    throw new Error(
      `Can't retrieved foo of id ${fooId} : missing implementation`
    )
  }
) => async (fooId) => {
  try {
    const fooData = await getFooOfIdImpl(fooId)
    return FooData(fooData)
  } catch (err) {
    throw new Error(`Unable to retrieve Foo with id ${fooId}`)
  }
}

module.exports = {
  getFooOdId,
}
```

This function is used to build a concrete implementation, for example with an in-memory database:

```js
const inMemoryFooDatabase = {
  foo17: {
    id: 'foo17',
    foo: 'a foo value',
    bar: 'a bar value',
    foobaz: 1234,
  },
}

const getFooOfIdFromInMemoryDatabase = getFooOfId(
  (fooId) => inMemoryFooDatabase[fooId]
)
```

### The Application layer

The application layer depends on the domain layer and has its infrastructural dependencies injected at runtime (repositories, domain services, etc.). The application layer contains application services: i.e: use case handlers. These handlers are responsible for retrieving the needed aggregates to this use case and for delegating them the responsibility to handle the use case since the behaviors (aka the business logic) belong inside the aggregates.

The code might look like this:

```js
// updateBarUseCaseHandler.js
const { updateBar } = require('../domain/foo/behaviors')

const updateBarUseCaseHandler = ({ getFooOfId, saveFoo }) => async ({
  fooId,
  bar,
}) => {
  if (typeof fooId !== typeof '') {
    throw new Error('fooId must be string')
  }
  const fooData = getFooOfId()
  const newFooData = updateBar({ fooData, bar })
  await saveFoo(newFooData)
}

module.exports = {
  updateBarUseCaseHandler,
}
```

The folders structure is now :

```sh
├── projectName/
| ├── domain/
| | ├── foo/
| | | ├── behaviors.js
| | | ├── data.js
| | | ├── getFooOfId.js
| | | ├── saveFoo.js
| ├── application/
| | ├── updateBarUseCaseHandler.js
```

### The infrastructure layer

As we can see in the above code, our updateBarUseCaseHandler is a higher-order function accepting a getFooOfI function and asaveFoo function as dependencies. These functions will be injected at runtime, be we need to create them in the first place! Let’s implement them as functions acting on an in-memory database for the sake of this example, based on the functions defined in the domain layer:

```js
// inMemoryDatabase.js
const { getFooOfId: createGetFooOfId } = require('../domain/foo/getFooOfId')
const { saveFoo: createSaveFoo } = require('../domain/foo/saveFoo')

const getFooOfId = (inMemoryDatabase) =>
  createGetFooOfId((fooId) => inMemoryDatabase[fooId])

const saveFoo = (inMemoryDatabase) =>
  createSaveFoo((fooState) => (inMemoryDatabase[fooState.id] = fooState))

module.exports = {
  getFooOfId,
  saveFoo,
}
```

The folders structure is now the following:

```sh
├── projectName/
| ├── domain/
| | ├── foo/
| | | ├── behaviors.js
| | | ├── data.js
| | | ├── getFooOfId.js
| | | ├── saveFoo.js
| ├── application/
| | ├── updateBarUseCaseHandler.js
| ├── infrastructure /
| | ├── inMemory.js
```

### The Composition Root

To tie it all together and inject the correct dependencies at runtime, we need a way to “instantiate” our whole project with the given dependencies. This is what we called a composition root. We need to compose those objects together as close as possible to the application’s entry point. Here, our application is not very useful and has only one use case, by “instantiating” our project I mean having the possibility to send commands to it, let’s expose a `MyVeryUsefulProject` function that will do that, in a `index.js` file for example:

```sh
├── projectName/
| ├── domain/
| | ├── foo/
| | | ├── behaviors.js
| | | ├── data.js
| | | ├── getFooOfId.js
| | | ├── saveFoo.js
| ├── application/
| | ├── updateBarUseCaseHandler.js
| ├── infrastructure /
| | ├── inMemory.js
├── index.js
```

```js
// index,js
const {
  updateBarUseCaseHandler,
} = require('./application/updateBarUseCaseHandler')

const MyVeryUsefulProject = ({ getFooOfId, saveFoo }) => ({
  updateBar: updateBarUseCaseHandler({ getFooOfId, saveFoo }),
})

module.exports = {
  MyVeryUsefulProject,
}
```

It’s a very very contrived example, but we can now write a unit test asserting that the foo object was correctly saved by using our `inMemory` functions in the `projectName/__tests__/updatingBar.test.js` file

### Credits

From the article [Domain Driven Design for JavaScript Developers](https://medium.com/spotlight-on-javascript/domain-driven-design-for-javascript-developers-9fc3f681931a) written by [@PCreations](https://github.com/PCreations)

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
|   |   ├── user/
|   |   |   ├── behaviors.js
|   |   |   ├── data.js
|   |   |   ├── createGetUserById.js
|   |   |   ├── createSaveUser.js
```

- the `projectName/domain/user` module groups everything related to our “Foo” aggregate
- the `projectName/domain/user/data.js` file contains the factory function used to create an immutable `Foo` data structure:

```js
// data.js
const UserData = ({ id, user, role, powered }) =>
  Object.freeze({
    id,
    user,
    role,
    powered,
  })

module.exports = {
  UserData,
}
```

- the `projectName/domain/user/behaviors.js` file contains the behaviors function acting on `UserData`.
  >
  - These are **pure functions** that take a `UserData` with some additional parameters needed to apply the behavior and return a new `UserData` immutable structure.

Let’s say that our `Foo` aggregate has a really useful business rule stating that when the `role` value is set then the `powered` value should be set to `100` if the `role` value contains a “guest”:

```js
const { UserData } = require('./data')

const updateRole = ({ userInfo, role }) => {
  if (typeof role !== typeof '')
    throw new Error('Role should be a valid string')

  return UserData({
    ...userInfo,
    role,
    powered: role.indexOf('guest') === -1 ? userInfo.powered : 100,
  })
}

module.exports = { updateRole }
```

On a real project, this function should be named according to the ubiquitous language, not with a “setter” logic.

- the `projectName/domain/user/createGetUserById.js` is the higher-order function that we must use to build a concrete `getUserById` implementation. We are in javascript so nothing really forces us to use this method but it acts as a documentation of the domain needs:

```js
// createGetUserById.js
const { UserData } = require('./data')

const createGetUserById = (
  getUserByIdImpl = async (userId) => {
    throw new Error(
      `Can't retrieved user of id ${userId} : missing implementation`
    )
  }
) => async (userId) => {
  try {
    const userInfo = await getUserByIdImpl(userId)
    return UserData(userInfo)
  } catch (err) {
    throw new Error(`Unable to retrieve Foo with id ${userId}`)
  }
}

module.exports = { getUserById }
```

This function is used to build a concrete implementation, for example with an in-memory database:

```js
const inMemoryDb = {
  user17: {
    id: 'user17',
    name: 'jonas',
    role: 'admin',
    powered: 1234,
  },
}

const getUserByIdFromMemory = getUserById((userId) => inMemoryDb[userId])
```

### The Application layer

The application layer depends on the domain layer and has its infrastructural dependencies injected at runtime (repositories, domain services, etc.). The application layer contains application services: i.e: use case handlers. These handlers are responsible for retrieving the needed aggregates to this use case and for delegating them the responsibility to handle the use case since the behaviors (aka the business logic) belong inside the aggregates.

The code might look like this:

```js
// updateRoleHandler.js
const { updateRole } = require('../domain/user/behaviors')

const updateRoleHandler = ({ getUserById, saveUser }) => async ({
  userId,
  role,
}) => {
  if (typeof userId !== typeof '') {
    throw new Error('userId must be string')
  }
  const userInfo = getUserById()
  const newUserData = updateRole({ userInfo, role })
  await saveUser(newUserData)
}

module.exports = {
  updateRoleHandler,
}
```

The folders structure is now :

```sh
├── projectName/
| ├── domain/
| | ├── user/
| | | ├── behaviors.js
| | | ├── data.js
| | | ├── createGetUserById.js
| | | ├── createSaveUser.js
| ├── application/
| | ├── updateRoleHandler.js
```

### The infrastructure layer

As we can see in the above code, our `updateRoleHandler` is a higher-order function accepting a `getFooById` function and a `saveUser` function as dependencies. These functions will be injected at runtime, but we need to create them in the first place.

Let’s implement them as functions acting on an in-memory database for the sake of this example, based on the functions defined in the domain layer:

```js
// inMemoryDb.js
const { createGetUserById } = require('../domain/user/createGetUserById')
const { createSaveUser } = require('../domain/user/createSaveUser')

const getUserById = (inMemoryDb) =>
  createGetUserById((userId) => inMemoryDb[userId])

const saveUser = (inMemoryDb) =>
  createSaveUser((userState) => (inMemoryDb[userState.id] = userState))

module.exports = {
  getUserById,
  saveUser,
}
```

The folders structure is now the following:

```sh
├── projectName/
| ├── domain/
| | ├── user/
| | | ├── behaviors.js
| | | ├── data.js
| | | ├── createGetUserById.js
| | | ├── createSaveUser.js
| ├── application/
| | ├── updateRoleHandler.js
| ├── infrastructure /
| | ├── inMemory.js
```

### The Composition Root

To tie it all together and inject the correct dependencies at runtime, we need a way to “instantiate” our whole project with the given dependencies. This is what we called a composition root. We need to compose those objects together as close as possible to the application’s entry point. Here, our application is not very useful and has only one use case, by “instantiating” our project I mean having the possibility to send commands to it, let’s expose a `UserDomainProject` function that will do that, in a `index.js` file for example:

```sh
├── projectName/
| ├── domain/
| | ├── user/
| | | ├── behaviors.js
| | | ├── data.js
| | | ├── createGetUserById.js
| | | ├── createSaveUser.js
| ├── application/
| | ├── updateRoleHandler.js
| ├── infrastructure /
| | ├── inMemory.js
├── index.js
```

```js
// index,js
const { updateRoleHandler } = require('./application/updateRoleHandler')

const UserDomainProject = ({ getUserById, saveUser }) => ({
  updateRole: updateRoleHandler({ getUserById, saveUser }),
})

module.exports = { UserDomainProject }
```

It’s a very very contrived example, but we can now write a unit test asserting that the user object was correctly saved by using our `inMemory` functions in `projectName/__tests__/updatingUser.test.js`

### Credits

From the article [Domain Driven Design for JavaScript Developers](https://medium.com/spotlight-on-javascript/domain-driven-design-for-javascript-developers-9fc3f681931a) written by [@PCreations](https://github.com/PCreations)

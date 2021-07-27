# Design Patterns

## Class vs Factory function: exploring the way forward

ECMAScript 2015 (aka ES6) comes with the `class` syntax, so now we have two competing patterns for creating objects. In order to compare them, I’ll create the same object definition `TodoModel` as a class, and then as a factory function.

#### TodoModel as a Class

```js
class TodoModel {
  constructor() {
    this.todos = []
    this.lastChange = null
  }

  addToPrivateList() {
    console.log('addToPrivateList')
  }

  add() {
    console.log('add')
  }

  reload() {}
}
```

#### TodoModel as a Factory Function

```js
function TodoModel() {
  let todos = []
  let lastChange = null

  function addToPrivateList() {
    console.log('addToPrivateList')
  }

  function add() {
    console.log('add')
  }

  function reload() {}

  return Object.freeze({
    add,
    reload,
  })
}
```

#### Encapsulation

The first thing we notice is that all members, fields, and methods of a class object are public.

```js
let todoModel = new TodoModel()

console.log(todoModel.todos) // []

console.log(todoModel.lastChange) // null

todoModel.addToPrivateList() // addToPrivateList
```

The lack of encapsulation may create security problems. Take the example of a global object that can be modified directly from the Developer Console.
When using factory function, only the methods we expose are public, everything else is encapsulated.

```js
let todoModel = TodoModel()

console.log(todoModel.todos) // undefined

console.log(todoModel.lastChange) // undefined

todoModel.addToPrivateList() // taskModel.addToPrivateList is not a function
```

#### this

`this` losing context problems are still there when using `class`. For example, `this` is losing context in nested functions. It is not only annoying during coding, but it’s also a constant source of bugs.

```js
class TodoModel {
  constructor() {
    this.todos = []
  }

  reload() {
    setTimeout(function log() {
      console.log(this.todos) // undefined
    }, 0)
  }
}

todoModel.reload() // undefined
```

or `this` is losing context when the method is used as a callback, like on a DOM event.

```js
$('#btn').click(todoModel.reload) // undefined
```

There are no such problems when using a factory function, as it doesn’t use this at all.

```js
function TodoModel() {
  let todos = []

  function reload() {
    setTimeout(function log() {
      console.log(todos) // []
    }, 0)
  }
}

todoModel.reload() // []

$('#btn').click(todoModel.reload) // []
```

#### this and arrow function

The arrow function partially solves the `this` loosing context issues in classes, but at the same time creates a new problem:

- `this` is no longer loosing context in nested functions
- `this` is loosing context when the method is used as a callback
- arrow function promotes the use of anonymous functions

I refactored the `TodoModel` using the arrow function. It’s important to note that in the process of refactoring to the arrow function we can loose something very important for readability, the function name. Look for example at:

```js
// using function name to express intent
setTimeout(function renderTodosForReview() {
  // ...
}, 0)

// versus using an anonymous function
setTimeout(() => {
  // ...
}, 0)
```

#### Immutable API

Once the object is created, I’m expecting its API to be immutable. I can easily change the implementation of a public method to do something else when it was created using a class.

```js
todoModel.reload = function () {
  console.log('a new reload')
}

todoModel.reload() //a new reload
```

This problem can be solved by calling `Object.freeze(TodoModel.prototype)` after the class definition.

The API of the object created using a factory function is immutable. Notice the use of `Object.freeze()` on the returned object containing only the public methods. The private data of the object can be modified, but only through these public methods.

```js
todoModel.reload = function () {
  console.log('a new reload')
}

todoModel.reload() //reload
```

#### new

`new` should be used when creating objects using classes.

`new` is not required when creating objects with factory functions, but if that makes it more readable, you can go for it, there is no harm.

```js
let todoModel = new TodoModel()
```

Using new with a factory function will just return the object created by the factory.

#### Composition over inheritance

Classes support both inheritance and composition.

Below is an example of inheritance where `SpecialService` class inherits from `Service` class:

```js
class Service {
  doSomething() {
    console.log('doSomething')
  }
}

class SpecialService extends Service {
  doSomethingElse() {
    console.log('doSomethingElse')
  }
}

let specialService = new SpecialService()

specialService.doSomething()
specialService.doSomethingElse()
```

Here is another example where `SpecialService` reuses member of Service using composition:

```js
class Service {
  doSomething() {
    console.log('doSomething')
  }
}

class SpecialService {
  constructor(args) {
    this.service = args.service
  }
  doSomething() {
    this.service.doSomething()
  }

  doSomethingElse() {
    console.log('doSomethingElse')
  }
}

let specialService = new SpecialService({
  service: new Service(),
})

specialService.doSomething()
specialService.doSomethingElse()
```

Factory functions promote composition over inheritance. Take a look at the next example where `SpecialService` reuses members of `Service`:

```js
function Service() {
  function doSomething() {
    console.log('doSomething')
  }
  return Object.freeze({
    doSomething,
  })
}

function SpecialService(args) {
  let service = args.service
  function doSomethingElse() {
    console.log('doSomethingElse')
  }
  return Object.freeze({
    doSomething: service.doSomething,
    doSomethingElse,
  })
}

let specialService = SpecialService({
  service: Service(),
})

specialService.doSomething()
specialService.doSomethingElse()
```

#### Memory

Classes are better at memory conservation, as they are implemented over the prototype system. All methods will be created only once in the prototype object and shared by all instances.

The memory cost of the factory function is noticeable when creating thousands of the same object.

Here is the page used for testing the memory cost when using factory function.

```sh
The memory cost (in Chrome)
+-----------+------------+------------+
| Instances | 10 methods | 20 methods |
+-----------+---------------+---------+
| 10        | 0          | 0          |
| 100       | 0.1Mb      | 0.1Mb      |
| 1000      | 0.7Mb      | 1.4Mb      |
| 10000     | 7.3Mb      | 14.2Mb     |
+-----------+------------+------------+
```

#### Objects vs Data Structures

Before analyzing the memory cost any further, a distinction should be made between two kinds of objects:

- OOP Objects
- Data Objects (aka Data Structures)

##### Objects expose behavior and hide data. Data Structures expose data and have no significant behavior. — Robert Martin “Clean Code”

I’ll take a look again at the TodoModel example and explain these two kinds of objects.

```js
function TodoModel() {
  let todos = []

  function add() {}
  function reload() {}

  return Object.freeze({
    add,
    reload,
  })
}
```

- `TodoModel` is responsible for storing and managing the list of `todos`. `TodoModel` is the OOP Object, the one exposing behavior and hiding data. There will be only one instance of it in the application, so there’s no extra memory cost when using the factory function.

- The `todos` objects represent the Data Structures. There may be a lot of these objects, but they are just plain JavaScript objects. We are not interested in keeping their methods private — rather we actually want to expose all their data and methods. So all these objects will be built over the prototype system, and they will benefit from the memory conservation. They can be built using a simple object literal or `Object.create()`.

#### UI Components

In the application, there may be hundreds or thousands of instances of a UI component. This is a situation where we need to make a trade-off between encapsulation and memory conservation.

Components will be built according to the component framework practice. For example, object literals will be used for Vue, or classes for React. Each component’s members will be public, but they will benefit from the memory conservation of the prototype system.

#### Conclusion

The strong points of class are its familiarity for people coming from a class-based background and its nicer syntax over the prototype system. However, its security problems and the usage of `this`, a continuous source of losing context bugs, makes it a second option. As an exception, classes will be used if required by the component’s framework, as in the case of React.

Factory function is not only the better option for creating secured, encapsulated, and flexible OOP Objects but also opens the door for a new, unique to JavaScript, programming paradigm.

### Credits

From the article [Class vs Factory function: exploring the way forward](https://medium.com/programming-essentials/class-vs-factory-function-exploring-the-way-forward-73258b6a8d15) written by [@cristi-salcescu](https://github.com/cristi-salcescu)

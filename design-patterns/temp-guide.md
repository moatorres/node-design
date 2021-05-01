## The Comprehensive Guide to JavaScript Design Patterns

JavaScript is a lightweight, interpreted, object-oriented programming language with first-class functions most commonly known as a scripting language for web pages.

```js
// we send in the function as an argument to be
// executed from inside the calling function
function performOperation(a, b, cb) {
  var c = a + b
  cb(c)
}

performOperation(2, 3, function (result) {
  // prints out 5
  console.log('The result of the operation is ' + result)
})
```

Each of the messages on the queue has a function associated with it. Once a message is dequeued, the runtime executes the function completely before processing any other message. This is to say, if a function contains other function calls, they are all performed prior to processing a new message from the queue. This is called run-to-completion.

```js
while (queue.waitForMessage()) {
  queue.processNextMessage()
}
```

The `queue.waitForMessage()` synchronously waits for new messages. Each of the messages being processed has its own stack and is processed until the stack is empty. Once it finishes, a new message is processed from the queue, if there is one.

Design patterns can be categorized in multiple ways, but the most popular one is the following:

### Creational

- Factory method
- Abstract factory
- Builder
- Prototype
- Singleton

### Structural Design Patterns

These patterns deal with object relationships. They ensure that if one part of a system changes, the entire system doesn’t need to change along with it. The most popular patterns in this category are:

- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Flyweight
- Proxy

### Behavioral Design Patterns

These types of patterns recognize, implement, and improve communication between disparate objects in a system. They help ensure that disparate parts of a system have synchronized information. Popular examples of these patterns are:

- Chain of responsibility
- Command
- Iterator
- Mediator
- Memento
- Observer
- State
- Strategy
- Visitor

### Concurrency Design Patterns

These types of design patterns deal with multi-threaded programming paradigms. Some of the popular ones are:

- Active object
- Nuclear reaction
- Scheduler

### Architectural Design Patterns

Design patterns which are used for architectural purposes. Some of the most famous ones are:

- MVC (Model-View-Controller)
- MVP (Model-View-Presenter)
- MVVM (Model-View-ViewModel)

## Design Pattern Examples

### Constructor Pattern

When thinking about classical object-oriented languages, a constructor is a special function in a class which initializes an object with some set of default and/or sent-in values.

Common ways to create objects in JavaScript are the three following ways:

```js
// either of the following ways can be used to create a new object
var instance = {}
// or
var instance = Object.create(Object.prototype)
// or
var instance = new Object()
```

After creating an object, there are four ways (since ES3) to add properties to these objects. They are the following:

```js
// supported since ES3
// the dot notation
instance.key = "A key's value"

// the square brackets notation
instance['key'] = "A key's value"

// supported since ES5
// setting a single property using Object.defineProperty
Object.defineProperty(instance, 'key', {
  value: "A key's value",
  writable: true,
  enumerable: true,
  configurable: true,
})

// setting multiple properties using Object.defineProperties
Object.defineProperties(instance, {
  firstKey: {
    value: "First key's value",
    writable: true,
  },
  secondKey: {
    value: "Second key's value",
    writable: false,
  },
})
```

The most popular way to create objects is the curly brackets and, for adding properties, the dot notation or square brackets. Anyone with any experience with JavaScript has used them.

We can use functions as constructors and initialize its properties the same way we would with a classic language constructor.

```js
// we define a constructor for Person objects
function Person(name, age, isDeveloper) {
  this.name = name
  this.age = age
  this.isDeveloper = isDeveloper || false

  this.writesCode = function () {
    console.log(
      this.isDeveloper
        ? 'This person does write code'
        : 'This person does not write code'
    )
  }
}

// creates a Person instance with properties name: Bob, age: 38, isDeveloper: true and a method writesCode
var person1 = new Person('Bob', 38, true)
// creates a Person instance with properties name: Alice, age: 32, isDeveloper: false and a method writesCode
var person2 = new Person('Alice', 32)

// prints out: This person does write code
person1.writesCode()
// prints out: this person does not write code
person2.writesCode()
```

However, there is still room for improvement here. If you’ll remember, I mentioned previously that JavaScript uses prototype-based inheritance.

The problem with the previous approach is that the method writesCode gets redefined for each of the instances of the Person constructor. We can avoid this by setting the method into the function prototype:

```js
function Person(name, age, isDeveloper) {
  this.name = name
  this.age = age
  this.isDeveloper = isDeveloper || false
}

Person.prototype.writesCode = function () {
  console.log(
    this.isDeveloper
      ? 'This person does write code'
      : 'This person does not write code'
  )
}

// creates a Person instance with properties name: Bob, age: 38, isDeveloper: true and a method writesCode
var person1 = new Person('Bob', 38, true)
// creates a Person instance with properties name: Alice, age: 32, isDeveloper: false and a method writesCode
var person2 = new Person('Alice', 32)

// prints out: This person does write code
person1.writesCode()
// prints out: this person does not write code
person2.writesCode()
```

Now, both instances of the `Person` constructor can access a shared instance of the `writesCode()` method.

### Module Pattern

As far as peculiarities go, JavaScript never ceases to amaze. Another peculiar thing to JavaScript is that it does not support access modifiers.

In a classical OOP language, a user defines a `class` and determines access rights for its members. Since JavaScript in its plain form supports neither classes nor access modifiers, JavaScript developers figured out a way to mimic this behavior when needed.

Before we go into the module pattern specifics, let’s talk about the concept of closure. A closure is a function with access to the parent scope, even after the parent function has closed.

They help us mimic the behavior of access modifiers through scoping. Let’s show this via an example:

```js
// we  used an immediately invoked function expression
// to create a private variable, counter
var counterIncrementer = (function () {
  var counter = 0

  return function () {
    return ++counter
  }
})()

// prints out 1
console.log(counterIncrementer())
// prints out 2
console.log(counterIncrementer())
// prints out 3
console.log(counterIncrementer())
```

Using the closures, we can create objects with private and public parts. These are called modules and are very useful whenever we want to hide certain parts of an object and only expose an interface to the user of the module. Let’s show this in an example:

```js
// through the use of a closure we expose an object
// as a public API which manages the private objects array
var collection = (function () {
  // private members
  var objects = []

  // public members
  return {
    addObject: function (object) {
      objects.push(object)
    },
    removeObject: function (object) {
      var index = objects.indexOf(object)
      if (index >= 0) {
        objects.splice(index, 1)
      }
    },
    getObjects: function () {
      return JSON.parse(JSON.stringify(objects))
    },
  }
})()

collection.addObject('Bob')
collection.addObject('Alice')
collection.addObject('Franck')
// prints ["Bob", "Alice", "Franck"]
console.log(collection.getObjects())
collection.removeObject('Alice')
// prints ["Bob", "Franck"]
console.log(collection.getObjects())
```

The most useful thing that this pattern introduces is the clear separation of private and public parts of an object, which is a concept very similar to developers coming from a classical object-oriented background.

However, not everything is so perfect. When you wish to change the visibility of a member, you need to modify the code wherever you have used this member because of the different nature of accessing public and private parts.

Also, methods added to the object after their creation cannot access the private members of the object.

### Revealing Module Pattern

This pattern is an improvement made to the module pattern as illustrated above. The main difference is that we write the entire object logic in the private scope of the module and then simply expose the parts we want to be public by returning an anonymous object.

We can also change the naming of private members when mapping private members to their corresponding public members.

```js
var namesCollection = (function () {
  // private members
  var objects = []

  function addObject(object) {
    objects.push(object)
  }

  function removeObject(object) {
    var index = objects.indexOf(object)
    if (index >= 0) {
      objects.splice(index, 1)
    }
  }

  function getObjects() {
    return JSON.parse(JSON.stringify(objects))
  }

  // public members
  return {
    addName: addObject,
    removeName: removeObject,
    getNames: getObjects,
  }
})()

namesCollection.addName('Bob')
namesCollection.addName('Alice')
namesCollection.addName('Franck')
// prints ["Bob", "Alice", "Franck"]
console.log(namesCollection.getNames())
namesCollection.removeName('Alice')
// prints ["Bob", "Franck"]
console.log(namesCollection.getNames())
```

The revealing module pattern is one of at least three ways in which we can implement a module pattern. The differences between the revealing module pattern and the other variants of the module pattern are primarily in how public members are referenced.

As a result, the revealing module pattern is much easier to use and modify; however, it may prove fragile in certain scenarios, like using RMP objects as prototypes in an inheritance chain. The problematic situations are the following:

- If we have a private function which is referring to a public function, we cannot override the public function, as the private function will continue to refer to the private implementation of the function, thus introducing a bug into our system.
- If we have a public member pointing to a private variable, and try to override the public member from outside the module, the other functions would still refer to the private value of the variable, introducing a bug into our system.

### Singleton Pattern

The singleton pattern is used in scenarios when we need exactly one instance of a class. For example, we need to have an object which contains some configuration for something.

In these cases, it is not necessary to create a new object whenever the configuration object is required somewhere in the system.

```js
var singleton = (function () {
  // private singleton value which gets initialized only once
  var config

  function initializeConfiguration(values) {
    this.randomNumber = Math.random()
    values = values || {}
    this.number = values.number || 5
    this.size = values.size || 10
  }

  // we export the centralized method for retrieving the singleton value
  return {
    getConfig: function (values) {
      // we initialize the singleton value only once
      if (config === undefined) {
        config = new initializeConfiguration(values)
      }

      // and return the same config value wherever it is asked for
      return config
    },
  }
})()

var configObject = singleton.getConfig({ size: 8 })
// prints number: 5, size: 8, randomNumber: someRandomDecimalValue
console.log(configObject)
var configObject1 = singleton.getConfig({ number: 8 })
// prints number: 5, size: 8, randomNumber: same randomDecimalValue as in first config
console.log(configObject1)
```

It is important to note that the access point for retrieving the singleton value needs to be only one and very well known. A downside to using this pattern is that it is rather difficult to test.

### Observer Pattern

The **observer pattern** is a very useful tool when we have a scenario where we need to improve the communication between disparate parts of our system in an optimized way. It promotes loose coupling between objects.

There are various versions of this pattern, but in its most basic form, we have two main parts of the pattern. The first is a _subject_ and the second is _observers_.

The main difference between a classical observer pattern and the publisher/subscriber pattern is that publisher/subscriber promotes even more loose coupling then the observer pattern does.

In the observer pattern, the subject holds the references to the subscribed observers and calls methods directly from the objects themselves whereas, in the publisher/subscriber pattern, we have channels, which serve as a communication bridge between a subscriber and a publisher. The publisher fires an event and simply executes the callback function sent for that event.

```js
var publisherSubscriber = {}

// we send in a container object which will handle the subscriptions and publishings
;(function (container) {
  // the id represents a unique subscription id to a topic
  var id = 0

  // we subscribe to a specific topic by sending in
  // a callback function to be executed on event firing
  container.subscribe = function (topic, f) {
    if (!(topic in container)) {
      container[topic] = []
    }

    container[topic].push({
      id: ++id,
      callback: f,
    })

    return id
  }

  // each subscription has its own unique ID, which we use
  // to remove a subscriber from a certain topic
  container.unsubscribe = function (topic, id) {
    var subscribers = []
    for (var subscriber of container[topic]) {
      if (subscriber.id !== id) {
        subscribers.push(subscriber)
      }
    }
    container[topic] = subscribers
  }

  container.publish = function (topic, data) {
    for (var subscriber of container[topic]) {
      // when executing a callback, it is usually helpful to read
      // the documentation to know which arguments will be
      // passed to our callbacks by the object firing the event
      subscriber.callback(data)
    }
  }
})(publisherSubscriber)

var subscriptionID1 = publisherSubscriber.subscribe(
  'mouseClicked',
  function (data) {
    console.log(
      "I am Bob's callback function for a mouse clicked event and this is my event data: " +
        JSON.stringify(data)
    )
  }
)

var subscriptionID2 = publisherSubscriber.subscribe(
  'mouseHovered',
  function (data) {
    console.log(
      "I am Bob's callback function for a hovered mouse event and this is my event data: " +
        JSON.stringify(data)
    )
  }
)

var subscriptionID3 = publisherSubscriber.subscribe(
  'mouseClicked',
  function (data) {
    console.log(
      "I am Alice's callback function for a mouse clicked event and this is my event data: " +
        JSON.stringify(data)
    )
  }
)

// NOTE: after publishing an event with its data, all of the
// subscribed callbacks will execute and will receive
// a data object from the object firing the event
// there are 3 console.logs executed
publisherSubscriber.publish('mouseClicked', { data: 'data1' })
publisherSubscriber.publish('mouseHovered', { data: 'data2' })

// we unsubscribe from an event by removing the subscription ID
publisherSubscriber.unsubscribe('mouseClicked', subscriptionID3)

// there are 2 console.logs executed
publisherSubscriber.publish('mouseClicked', { data: 'data1' })
publisherSubscriber.publish('mouseHovered', { data: 'data2' })
```

This design pattern is useful in situations when we need to perform multiple operations on a single event being fired.

A downside to using this pattern is difficult testing of various parts of our system. There is no elegant way for us to know whether or not the subscribing parts of the system are behaving as expected.

### Prototype Pattern

As we have already mentioned throughout the article, JavaScript does not support classes in its native form. Inheritance between objects is implemented using prototype-based programming.

It enables us to create objects which can serve as a prototype for other objects being created. The prototype object is used as a blueprint for each object the constructor creates.

As we have already talked about this in the previous sections, let’s show a simple example of how this pattern might be used.

```js
var personPrototype = {
  sayHi: function () {
    console.log('Hello, my name is ' + this.name + ', and I am ' + this.age)
  },
  sayBye: function () {
    console.log('Bye Bye!')
  },
}

function Person(name, age) {
  name = name || 'John Doe'
  age = age || 26

  function constructorFunction(name, age) {
    this.name = name
    this.age = age
  }

  constructorFunction.prototype = personPrototype

  var instance = new constructorFunction(name, age)
  return instance
}

var person1 = Person()
var person2 = Person('Bob', 38)

// prints out Hello, my name is John Doe, and I am 26
person1.sayHi()
// prints out Hello, my name is Bob, and I am 38
person2.sayHi()
```

Take notice how prototype inheritance makes a performance boost as well because both objects contain a reference to the functions which are implemented in the prototype itself, instead of in each of the objects.

### Command Pattern

The command pattern is useful in cases when we want to decouple objects executing the commands from objects issuing the commands.

For example, imagine a scenario where our application is using a large number of API service calls. Then, let’s say that the API services change. We would have to modify the code wherever the APIs that changed are called.

This would be a great place to implement an abstraction layer, which would separate the objects calling an API service from the objects which are telling them when to call the API service.

This way, we avoid modification in all of the places where we have a need to call the service, but rather have to change only the objects which are making the call itself, which is only one place.

As with any other pattern, we need to be aware of the tradeoff we are making, as we are adding an additional abstraction layer over the API calls, which will reduce performance but potentially save a lot of time when we need to modify objects executing the commands.

```js
// the object which knows how to execute the command
var invoker = {
  add: function (x, y) {
    return x + y
  },
  subtract: function (x, y) {
    return x - y
  },
}

// the object which is used as an abstraction layer when
// executing commands; it represents an interface
// toward the invoker object
var manager = {
  execute: function (name, args) {
    if (name in invoker) {
      return invoker[name].apply(invoker, [].slice.call(arguments, 1))
    }
    return false
  },
}

// prints 8
console.log(manager.execute('add', 3, 5))
// prints 2
console.log(manager.execute('subtract', 5, 3))
```

### Credits

From this [article](https://www.toptal.com/javascript/comprehensive-guide-javascript-design-patterns) published on [toptal.com](https://toptal.com)

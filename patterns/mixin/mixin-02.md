# Design Patterns

## Functional Mixin

In JavaScript we can only inherit from a single object. There can be only one `[[Prototype]]` for an object. And a `class` may extend only one other `class`.

But sometimes that feels limiting. For instance, we have a class `StreetSweeper` and a class `Bicycle`, and want to make their mix: a `StreetSweepingBicycle`.

Or we have a class `User` and a class `EventEmitter` that implements event generation, and we’d like to add the functionality of `EventEmitter` to `User`, so that our users can emit events.

There’s a concept that can help here, called “mixins”.

As defined in Wikipedia, a **[mixin](https://en.wikipedia.org/wiki/Mixin)** is a class containing methods that can be used by other classes without a need to inherit from it.

In other words, a mixin provides methods that implement a certain behavior, but we do not use it alone, we use it to add the behavior to other classes.

### Example A

The simplest way to implement a mixin in JavaScript is to make an object with useful methods, so that we can easily merge them into a prototype of any class.

For instance here the mixin `sayHiMixin` is used to add some “speech” for `User`:

```js
let sayHiMixin = {
  sayHi() {
    alert(`Hello ${this.name}`)
  },
  sayBye() {
    alert(`Bye ${this.name}`)
  },
}

// usage
class User {
  constructor(name) {
    this.name = name
  }
}

// copy the methods
Object.assign(User.prototype, sayHiMixin)

// now User can say hi
new User('Dude').sayHi() // Hello Dude!
```

There’s no inheritance, but a simple method copying. So `User` may inherit from another class and also include the mixin to “mix-in” the additional methods, like this:

```js
class User extends Person {
  // ...
}

Object.assign(User.prototype, sayHiMixin)
```

Mixins can make use of inheritance inside themselves.

For instance, here `sayHiMixin` inherits from `sayMixin`:

```js
let sayMixin = {
  say(phrase) {
    alert(phrase)
  },
}

let sayHiMixin = {
  __proto__: sayMixin, // or Object.setPrototypeOf()

  sayHi() {
    // call parent method
    super.say(`Hello ${this.name}`)
  },
  sayBye() {
    super.say(`Bye ${this.name}`)
  },
}

class User {
  constructor(name) {
    this.name = name
  }
}

// copy the methods
Object.assign(User.prototype, sayHiMixin)

// now User can say hi
new User('Dude').sayHi() // Hello Dude!
```

Please note that the call to the parent method `super.say()` from `sayHiMixin` looks for the method in the prototype of that mixin, not the class.

That’s because methods `sayHi` and `sayBye` were initially created in `sayHiMixin`. So even though they got copied, their `[[HomeObject]]` internal property references `sayHiMixin`, as shown in the picture above.

As `super` looks for parent methods in `[[HomeObject]].[[Prototype]]`, that means it searches `sayHiMixin.[[Prototype]]`, not `User.[[Prototype]]`.

### `EventMixin`

Now let’s make a mixin for real life.

Let’s make a mixin that allows us to easily add event-related functions to any class/object.

- #### `.trigger(name, [...data])`

  Method to “generate an event” when something important happens to it. The `name` argument is a name of the event, optionally followed by additional arguments with event data.

- #### `.on(name, handler)`

  Method that adds handler function as the listener to events with the given name. It will be called when an event with the given name triggers, and get the arguments from the `.trigger` call.

- #### `.off(name, handler)`
  Method that removes the handler listener.

After adding the mixin, an object **user** will be able to generate an event "login" when the visitor logs in. An object **calendar** may want to listen for such events to load the calendar for the logged-in person. Or, a **menu** can generate the event "select" when a menu item is selected, and other objects may assign handlers to react on that event. And so on.

```js
let eventMixin = {
  on(eventName, handler) {
    if (!this._handlers) this._handlers = {}
    if (!this._handlers[eventName]) {
      this._handlers[eventName] = []
    }
    this._handlers[eventName].push(handler)
  },

  off(eventName, handler) {
    let handlers = this._handlers?.[eventName]
    if (!handlers) return
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1)
      }
    }
  },

  trigger(eventName, ...args) {
    if (!this._handlers?.[eventName]) {
      return // no handlers for that eventName
    }

    // call the handlers
    this._handlers[eventName].forEach((handler) => handler.apply(this, args))
  },
}
```

#### Usage

The `eventMixin` makes it easy to add such behavior to as many classes as we’d like, without interfering with the inheritance chain.

```js
class Menu {
  choose(value) {
    this.trigger('select', value)
  }
}

Object.assign(Menu.prototype, eventMixin)

let menu = new Menu()

// add a handler to be called on "select"
menu.on('select', (value) => alert(`Value selected: ${value}`))

// triggers the event
menu.choose('123') // => Value selected: 123
```

_Mixin_ – is a generic object-oriented programming term: a class that contains methods for other classes.

We can use mixins as a way to augment a class by adding multiple behaviors, like event-handling as we have seen above.

JavaScript does not support multiple inheritance, but mixins can be implemented by copying methods into prototype.

Although, mixins may become a point of conflict if they accidentally overwrite existing class methods. So generally one should think well about the naming methods of a mixin, to minimize the probability of that happening.

### Credits

From this [tutorial](https://javascript.info/mixins) published on [javascript.info](https://javascript.info/)

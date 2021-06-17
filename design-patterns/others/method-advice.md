# Design Patterns

## Method Advice

Let's take a quick look at the method **Decorator** below.

```js
const fluent = (method) =>
  function (...args) {
    method.apply(this, args)
    return this
  }

class Person {
  setName(first, last) {
    this.firstName = first
    this.lastName = last
  }

  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}

Person.prototype.setName = fluent(Person.prototype.setName)
```

### What question do method decorators answer?

But sometimes, this is not what you want. Consider a responsibility like authentication. Let’s imagine that we validate permissions in our model classes. We might write something like this:

```js
const wrapWith = (decorator) =>
  function (target, name, descriptor) {
    descriptor.value = decorator(descriptor.value)
  }

const mustBeMe = (method) =>
  function (...args) {
    if (currentUser() && currentUser().person().equals(this))
      return method.apply(this, args)
    else throw new PermissionsException('Must be me!')
  }

class Person {
  // @wrapWith(mustBeMe)
  setName(first, last) {
    this.firstName = first
    this.lastName = last
  }

  fullName() {
    return this.firstName + ' ' + this.lastName
  }

  // @wrapWith(mustBeMe)
  setAge(age) {
    this.age = age
  }

  // @wrapWith(mustBeMe)
  age() {
    return this.age
  }
}

Person.prototype.setName = mustBeMe(Person.prototype.setName)
Person.prototype.setAge = mustBeMe(Person.prototype.setAge)
Person.prototype.age = mustBeMe(Person.prototype.age)
```

Obviously real permissions systems involve roles and all sorts of other important things.

Now we can look at `setName` and see that users can only set their own name, likewise if we look at `setAge`, we see that users can only set their own `age`.

In a tiny toy example the next question is easy to answer: What methods can only be invoked by the person themselves? We see at a glance that the answer is `setName`, `setAge`, and `age`.

But as classes grow, this becomes more difficult to answer. This especially becomes difficult if we decompose classes using mixins. For example, what if `setAge` and `age` come from a **mixin**:

```js
@HasAge
class Person {
  @wrapWith(mustBeMe)
  setName(first, last) {
    this.firstName = first
    this.lastName = last
  }

  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}
```

Are they wrapped with `mustBeMe`? Quite possibly not, because the **mixin** is responsible for defining the behaviour, it’s up to the model class to decide the permissions required. But how would you know?

**Method decorators** make it easy to answer the question “what is the behaviour of this method?” But they don't make it easy to answer the question “what methods share this behaviour?”

That question matters, because when decomposing responsibilities, we often decide that a cross-cutting responsibility like permissions should be distinct from an implementation responsibility like storing a name.

### Cross-cutting Method Decorators

There is another way to decorate methods: we can decorate **multiple methods in a single declaration**. This is called providing **method advice**.

In JavaScript, we can implement **method advice** by decorating the entire class. A class decorator is nothing more than a function that takes a class as an argument and returns the same or a different class. We already have a combinator for making mixins:

```js
function mixin(behaviour, sharedBehaviour = {}) {
  const instanceKeys = Reflect.ownKeys(behaviour)
  const sharedKeys = Reflect.ownKeys(sharedBehaviour)
  const typeTag = Symbol('isa')

  function _mixin(clazz) {
    for (let property of instanceKeys)
      Object.defineProperty(clazz.prototype, property, {
        value: behaviour[property],
        writable: true,
      })

    Object.defineProperty(clazz.prototype, typeTag, { value: true })

    return clazz
  }

  for (let property of sharedKeys)
    Object.defineProperty(_mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property),
    })

  Object.defineProperty(_mixin, Symbol.hasInstance, {
    value: (i) => !!i[typeTag],
  })

  return _mixin
}

const HasAge = mixin({
  setAge(age) {
    this.age = age
  },

  age() {
    return this.age
  },
})

// @HasAge
class Person {
  setName(first, last) {
    this.firstName = first
    this.lastName = last
  }

  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}

Person.prototype = hasAge(Person.prototype)
```

##### We can use the same technique to write a class decorator that decorates one or more methods:

```js
const around = (behaviour, ...methodNames) => (clazz) => {
  for (let methodName of methodNames)
    Object.defineProperty(clazz.prototype, property, {
      value: behaviour(clazz.prototype[methodName]),
      writable: true,
    })
  return clazz
}

@HasAge
@around(mustBeMe, 'setName', 'setAge', 'age')
class Person {
  setName(first, last) {
    this.firstName = first
    this.lastName = last
  }

  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}

// Person.prototype = HasAge(Person.prototype)
// Person.prototype = around(
//   mustBeMe,
//   'setName',
//   'setAge',
//   'age'
// )(Person.prototype)
```

Now when you look at setName, you don’t see what permissions apply.

However, when we look at `@around(mustBeMe, 'setName', 'setAge', 'age')`, we see that we’re wrapping `setName`, `setAge` and `age` with `mustBeMe`.

This focuses the responsibility for permissions in one place. Of course, we could make things simpler. For one thing, some actions are only performed **before** a method, and some only **after** a method:

```js
let before = (behaviour, ...methodNames) => (clazz) => {
  if (typeof behaviour === 'string') {
    behaviour = clazz.prototype[behaviour]
  }

  for (let method of methodNames) {
    let decoratedMethodFn = clazz.prototype[method]

    Object.defineProperty(clazz.prototype, method, {
      value: function (...args) {
        let behaviourValue = behaviour.apply(this, ...args)

        if (behaviourValue === undefined || !!behaviourValue)
          return decoratedMethodFn.apply(this, args)
      },
      writable: true,
    })
  }

  return clazz
}

let after = (behaviour, ...methodNames) => (clazz) => {
  if (typeof behaviour === 'string') {
    behaviour = clazz.prototype[behaviour]
  }

  for (let method of methodNames) {
    let decoratedMethodFn = clazz.prototype[method]

    Object.defineProperty(clazz.prototype, method, {
      value: function (...args) {
        let decoratedMethodValue = decoratedMethodFn.apply(this, args)

        behaviour.apply(this, ...args)
        return decoratedMethodValue
      },
      writable: true,
    })
  }

  return clazz
}
```

Precondition checks like `mustBeMe` are good candidates for `before`. Here’s `mustBeLoggedIn` and `mustBeMe` set up to use before. They’re far simpler since before handles the wrapping:

```js
const mustBeLoggedIn = () => {
  if (currentUser() == null)
    throw new PermissionsException('Must be logged in!')
}

const mustBeMe = () => {
  if (currentUser() == null || !currentUser().person().equals(this))
    throw new PermissionsException('Must be me!')
}

@HasAge
@before(mustBeMe, 'setName', 'setAge', 'age')
@before(mustBeLoggedIn, 'fullName')
class Person {
  setName(first, last) {
    this.firstName = first
    this.lastName = last
  }

  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}
```

This style of moving the responsibility for decorating methods to a single declaration will appear familiar to Ruby on Rails developers. As you can see, it does not require “deep magic” or complex libraries, it is a pattern that can be written out in just a few lines of code.

Mind you, there’s always room for polish and gold plate. We could enhance `before`, `after`, and `around` to include conveniences like regular expressions to match method names, or special declarations like `except:` or `only:` if we so desired.

### Final thought

Although decorating methods in bulk has appeared in other languages and paradigms, it’s not something special and alien to JavaScript, it’s really the same pattern we see over and over again: Programming by composing small and single-responsibility entities, and using functions to transform and combine the entities into their final form.

### About ES6

Although _ES.later_ has not been approved, there is extensive support for _ES.later_ method decorators in transpilation tools. The examples in this post were evaluated with **Babel**. If we don’t want to use _ES.later_ decorators, **we can use the exact same decorators as ordinary functions**, like this:

```js
const mustBeLoggedIn = () => {
  if (currentUser() == null)
    throw new PermissionsException('Must be logged in!')
}

const mustBeMe = () => {
  if (currentUser() == null || !currentUser().person().equals(this))
    throw new PermissionsException('Must be me!')
}

const Person = HasAge(
  before(
    mustBeMe,
    'setName',
    'setAge',
    'age'
  )(
    before(
      mustBeLoggedIn,
      'fullName'
    )(
      class {
        setName(first, last) {
          this.firstName = first
          this.lastName = last
        }

        fullName() {
          return this.firstName + ' ' + this.lastName
        }
      }
    )
  )
)
```

Composition could also help:

```js
const mustBeLoggedIn = () => {
  if (currentUser() == null)
    throw new PermissionsException('Must be logged in!')
}

const mustBeMe = () => {
  if (currentUser() == null || !currentUser().person().equals(this))
    throw new PermissionsException('Must be me!')
}

const Person = compose(
  HasAge,
  before(mustBeMe, 'setName', 'setAge', 'age'),
  before(mustBeLoggedIn, 'fullName')
)(
  class {
    setName(first, last) {
      this.firstName = first
      this.lastName = last
    }

    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  }
)
```

### Credits

From the article [Method Advice in Modern JavaScript](http://raganwald.com/2015/08/05/method-advice.html) written by [@raganwald](https://github.com/raganwald)

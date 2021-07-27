# Design Patterns

## JavaScript Mixins

In contrast to more rigidly structured languages, JavaScript objects can invoke any public function regardless of lineage. The most straightforward approach is delegation – any public function can be invoked directly via call or apply. It’s a powerful feature and I use it extensively. However delegation is so convenient that sometimes it actually works against structural discipline in your code; moreover the syntax can get a little wordy.

**Mixins** are a great compromise, allowing entire functional units to be borrowed and accessed with minimal syntax and they play very well with prototypes. They offer the descriptive prowess of hierarchical inheritance without the brain-cracking issues associated with multi-tiered, single-rooted ancestry.

In general computer science, **a mixin is a class that defines a set of functions relating to a type** (e.g. Person, Circle, Observer). Mixins classes are usually considered abstract in that they will not themselves be instantiated – instead their functions are copied (or ‘borrowed’) by concrete classes as a means of ‘inheriting’ behaviour without entering into a formal relationship with the behaviour provider.

In JavaScript, a mixin can be a regular object, a prototype, a function – whatever. JavaScript lets us use objects (instances) for that too, which offer clarity and flexibility, therefore the mixin process becomes transparent and obvious.

### 1. Classic Mixins

Scanning the first two pages returned from a google search for “javascript mixin” I noticed the majority of authors define the mixin object as full-blown constructor type with its function-set defined in the prototoype. This could be seen as a natural progression – early mixins were classes and this is the closest thing JavaScript has to a class. Here’s a circle mixin modeled after that style:

```js
const Circle = function () {}

Circle.prototype = {
  area: function () {
    return Math.PI * this.radius * this.radius
  },
  grow: function () {
    this.radius++
  },
  shrink: function () {
    this.radius--
  },
}
```

In practice, however, such a heavyweight mixin is unnecessary. A simple object literal will suffice:

```js
const circleFns = {
  area: function () {
    return Math.PI * this.radius * this.radius
  },
  grow: function () {
    this.radius++
  },
  shrink: function () {
    this.radius--
  },
}
```

And how does such a mixin object get mixed into your `object`? By means of an `extend` function (sometimes known as `augment`). Usually `extend` simply copies (not clones) the mixin’s functions into the receiving object. A quick survey reveals some minor constiations in this implementation. For example _Prototype.js_ omits a `hasOwnProperty` check (suggesting the mixin will have no enumerable properties in its prototype chain) while other versions assume you want to only copy the mixin’s prototype object. Here’s a version that is both safe and flexible…

```js
import { circleFns, buttonFns } from './my-fns'

function extend(destination, source) {
  for (const k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k]
    }
  }
  return destination
}

// which we can call to extend our prototype
const RoundButton = function (radius, label) {
  this.radius = radius
  this.label = label
}

extend(RoundButton.prototype, circleFns)
extend(RoundButton.prototype, buttonFns)
```

### 2. Functional Mixins

##### If the functions defined by mixins are intended solely for the use of other objects, why bother creating mixins as regular objects at all?

Put another way, a mixin should be a process\*\* not an object. The logical conclusion is to make our mixins into functions into which consumer objects inject themselves by delegation, thus cutting out the middle guy (the `extend` function) entirely.

```js
const asCircle = function () {
  this.area = function () {
    return Math.PI * this.radius * this.radius
  }
  this.grow = function () {
    this.radius++
  }
  this.shrink = function () {
    this.radius--
  }
  return this
}

const Circle = function (radius) {
  this.radius = radius
}

asCircle.call(Circle.prototype)

const myCircle = new Circle(5)

myCircle.area() // => 78.54
```

#### Mixins as verbs instead of nouns; lightweight one stop function shops.

There are other things to like here too – the programming style is natural and concise: `this` always refers to the receiver of the function set, instead of an abstract object we don’t need and will never use; moreover, in contrast to the traditional approach, we don’t have to protect against inadvertent copying of inherited properties and (for what its worth) functions are now cloned instead of copied.

Now here’s a mixin for the button functions…

```js
const asButton = function () {
  this.hover = function (bool) {
    bool ? mylib.appendClass('hover') : mylib.removeClass('hover')
  }
  this.press = function (bool) {
    bool ? mylib.appendClass('pressed') : mylib.removeClass('pressed')
  }
  this.fire = function () {
    return this.action()
  }
  return this
}

// put the two mixins together and we’ve got round buttons:
const RoundButton = function (radius, label, action) {
  this.radius = radius
  this.label = label
  this.action = action
}

asButton.call(RoundButton.prototype)
asCircle.call(RoundButton.prototype)

const myButton = new RoundButton(4, 'yes!', function () {
  return 'you said yes!'
})

myButton.fire() // => 'you said yes!'
```

- ### Adding `Options`

This functional strategy also allows the _borrowed behaviours to be parameterized by means of an options argument_. Let’s see this in action by creating an `asOval` mixin with a custom `grow` and `shrink` factor:

```js
const asOval = function (options) {
  this.area = function () {
    return Math.PI * this.longRadius * this.shortRadius
  }
  this.ratio = function () {
    return this.longRadius / this.shortRadius
  }
  this.grow = function () {
    this.shortRadius += options.growBy / this.ratio()
    this.longRadius += options.growBy
  }
  this.shrink = function () {
    this.shortRadius -= options.shrinkBy / this.ratio()
    this.longRadius -= options.shrinkBy
  }
  return this
}

const OvalButton = function (longRadius, shortRadius, label, action) {
  this.longRadius = longRadius
  this.shortRadius = shortRadius
  this.label = label
  this.action = action
}

asButton.call(OvalButton.prototype)
asOval.call(OvalButton.prototype, { growBy: 2, shrinkBy: 2 })

const button2 = new OvalButton(3, 2, 'send', function () {
  return 'message sent'
})
button2.area() // => 18.84955592153876
button2.grow()
button2.area() // => 52.35987755982988
button2.fire() // => 'message sent'
```

- ### Adding `Caching`

By forming a closure around the mixins we can cache the results of the initial definition run and the performance implications are outstanding. Functional mixins now easily outperform classic mixins in every browser (in my tests by a factor of 20 in Chrome and a factor of 13 in Firefox 4). Again it doesn’t matter much either way but it leaves a nice feeling.

Here’s a version of the `asRectangle` with caching added…

```js
const asRectangle = (function () {
  function area() {
    return this.length * this.width
  }
  function grow() {
    this.length++, this.width++
  }
  function shrink() {
    this.length--, this.width--
  }
  return function () {
    this.area = area
    this.grow = grow
    this.shrink = shrink
    return this
  }
})()

const RectangularButton = function (length, width, label, action) {
  this.length = length
  this.width = width
  this.label = label
  this.action = action
}

asButton.call(RectangularButton.prototype)
asRectangle.call(RectangularButton.prototype)

const button3 = new RectangularButton(4, 2, 'delete', function () {
  return 'deleted'
})
button3.area() // => 8
button3.grow()
button3.area() // => 15
button3.fire() // => 'deleted'
```

- ### Adding `Curry`

Everything in life is a trade off and the aforementioned caching enhancement is no exception. We’ve now lost the ability to create true clones for every mixin, furthermore we can no longer customize our borrowed functions by passing option arguments to the mixin. The latter problem can be fixed up by running a `curry` function over each cached function, thereby pre-assigning custom options to subsequent function calls.

Here’s the asRectangle mixin with functions appropriately curried to allow parameterization of the grow and shrink increments.

```js
Function.prototype.curry = function () {
  let fn = this
  let args = [].slice.call(arguments, 0)
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments, 0)))
  }
}

const asRectangle = (function () {
  function area() {
    return this.length * this.width
  }
  function grow(growBy) {
    ;(this.length += growBy), (this.width += growBy)
  }
  function shrink(shrinkBy) {
    ;(this.length -= shrinkBy), (this.width -= shrinkBy)
  }
  return function (options) {
    this.area = area
    this.grow = grow.curry(options['growBy'])
    this.shrink = shrink.curry(options['shrinkBy'])
    return this
  }
})()

asButton.call(RectangularButton.prototype)
asRectangle.call(RectangularButton.prototype, { growBy: 2, shrinkBy: 2 })

const button4 = new RectangularButton(2, 1, 'add', function () {
  return 'added'
})
button4.area() // => 2
button4.grow()
button4.area() // => 12
button4.fire() // => 'added'
```

### Wrap Up

JavaScript is an amalgam of function and state. State is generally specific to instances, while functions will almost certainly be shared across instances. Maybe it’s in our interest to separate these two most basic concerns and maybe mixins can help us do this.

In particular the functional mixin pattern offers a clear delineation. Objects are state while functions are organized in bunches like fruit on a tree, ripe for picking. In fact the strategy can be extended beyond pure mixins – functional sets can act as repositories for any object…

```js
const myCircle = asCircle.call({ radius: 25 })

myCircle.area() // => 1963.50
```

### Credits

From the article [A fresh look at JavaScript Mixins](https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/) written by [@angus-c](https://github.com/angus-c)

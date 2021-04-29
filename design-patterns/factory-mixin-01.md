# Design Patterns

## Factory Mixin

Factories are great at cranking out objects using a nice calling API. Usually, they’re all you need, but once in a while, **you’ll find yourself building similar features into different types of objects**, and you may want to abstract those features into functional mixins so you can reuse them more easily.

That’s where **functional mixins** shine.

### `withConstructor`

Let’s build a `withConstructor` mixin to add the `.constructor` property to all object instances.

```js
const withConstructor = (constructor) => (o) => ({
  __proto__: {
    constructor,
  },
  ...o,
})
```

### `withFlying` mixin

Now you can use it with other mixins:

```js
const withFlying = (o) => {
  let isFlying = false
  return {
    ...o,
    fly() {
      isFlying = true
      return this
    },
    land() {
      isFlying = false
      return this
    },
    isFlying: () => isFlying,
  }
}
```

### `withBattery` mixin

```js
const withBattery = ({ capacity }) => (o) => {
  let percentCharged = 100
  return {
    ...o,
    draw(percent) {
      const remaining = percentCharged - percent
      percentCharged = remaining > 0 ? remaining : 0
      return this
    },
    getCharge: () => percentCharged,
    getCapacity() {
      return capacity
    },
  }
}
```

### Usage

As you can see, the reusable `withConstructor()` mixin is simply _dropped_ into the `pipeline` with other mixins. `withBattery()` could be used with other kinds of objects, like robots, electric skateboards, or portable device chargers. `withFlying()` could be used to model flying cars, rockets, or air balloons.

```js
const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x)

const createDrone = ({ capacity = '3000mAh' }) =>
  pipe(withFlying, withBattery({ capacity }), withConstructor(createDrone))({})

const myDrone = createDrone({ capacity: '5500mAh' })

console.log(`
can fly: ${myDrone.fly().isFlying() === true}
can land: ${myDrone.land().isFlying() === false}
battery capacity: ${myDrone.getCapacity()}
battery status: ${myDrone.draw(50).getCharge()}%
battery drained: ${myDrone.draw(75).getCharge()}%
`)

console.log(`constructor linked: ${myDrone.constructor === createDrone}`)
```

Composition is more of a way of thinking than a particular technique in code. You can accomplish it in many ways. Function composition is just the easiest way to build it up from scratch, and factory functions are a simple way to wrap a friendly API around the implementation details.

### Credits

From the book [Composing Software]() written by [@ericelliott](https://github.com/ericelliott)

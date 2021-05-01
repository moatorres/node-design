# Design Patterns

## Chain of Responsability

```js
const Light = function (direction, timer) {
  // initial state
  this.state = {
    color: 'red',
    direction,
  }

  // set next function to be other light
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }

  // instantiate the colors then set order and time interval they are to be called
  this.exec = function () {
    let green = new Color(this.state, 'green', 10)
    let yellow = new Color(this.state, 'yellow', 5)
    let red = new Color(this.state, 'red', 0)
    green.setNext(yellow)
    yellow.setNext(red)
    red.setNext(this.next)
    green.exec()
  }
}

const Color = function (light, color, seconds) {
  this.light = light

  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }

  this.exec = function () {
    this.light.color = color

    console.log(this.light.color, this.light.direction)

    // call next fn after n seconds
    setTimeout(() => {
      this.next.exec()
    }, seconds * 1000)
  }
}

// log seconds passed
const Timer = function () {
  this.seconds = 0

  this.init = () => {
    setInterval(() => {
      this.seconds += 1
      console.log(this.seconds)
    }, 1000)
  }
}

// Setup the lights with given direction, set next ones to be called to be each other (infinite loop), then call NS first
let NS = new Light('North South')
let EW = new Light('East West')
NS.setNext(EW)
EW.setNext(NS)
NS.exec()

let timer = new Timer()
timer.init()

module.exports = { Timer, Light, Color }
```

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns/blob/master/chain-of-resp/trafficLights.js) written by [@howardmann](https://github.com/howardmann)

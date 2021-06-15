// utility function
function extend(destination, source) {
  for (const k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k]
    }
  }
  return destination
}

// classic mixin
const circleFns = {
  area: function () {
    return (Math.PI * this.radius * this.radius).toFixed(2)
  },
  grow: function () {
    this.radius++
  },
  shrink: function () {
    this.radius--
  },
}

const RoundButton = function (radius, label) {
  this.radius = radius
  this.label = label
}

extend(RoundButton.prototype, circleFns)

let btn = new RoundButton(3, 'bla')
console.log('btn area:', btn.area())

// functional mixin
const asCircle = function () {
  this.area = function () {
    return (Math.PI * this.radius * this.radius).toFixed(2)
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

console.log('circle area:', myCircle.area())

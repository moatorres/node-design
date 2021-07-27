// class constuctor
class Car {
  drive() {
    console.log('Vroom!')
  }
}

const carFromClass = new Car()
console.log(carFromClass.drive())

// prototype constructor
function CarConstructor() {}

CarConstructor.prototype.drive = function () {
  console.log('Vroom!')
}

const carFromPrototype = new CarConstructor()
console.log(carFromPrototype.drive())

// factory prototype
const proto = {
  drive() {
    console.log('Vroom!')
  },
}

const factoryCar = () => Object.create(proto)

const carFromFactory = factoryCar()
console.log(carFromFactory.drive())

// instanceof lies
function base() {}
const thing = { a: 'a' }

base.prototype = thing

// is thing an instance of base?
console.log(thing instanceof base) // => false

const that = Object.create(thing)

// is that an instance of base?
console.log(that instanceof base) // true. oops.

// factory refactored
const AutoMaker = {
  Car(bundle) {
    return Object.create(this.bundle[bundle])
  },

  bundle: {
    premium: {
      drive() {
        console.log('Vrooom!')
      },
      getOptions: function () {
        return ['leather', 'wood', 'pearl']
      },
    },
  },
}

const newCar = AutoMaker.Car('premium')
newCar.drive() // => 'Vrooom!'

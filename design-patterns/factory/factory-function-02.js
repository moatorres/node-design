class Car {
  constructor(name) {
    const id = Math.random().toString(36).substring(2, 15)
    this.name = `${name}-${id}`
  }

  showInfo() {
    console.log(`I'm ${this.name}`)
  }
}

class Audi extends Car {
  constructor() {
    super('Audi')
  }
}

class BMW extends Car {
  constructor() {
    super('BMW')
  }
}

class Mercedes extends Car {
  constructor() {
    super('Mercedes')
  }
}

class CarFactory {
  static create(type) {
    switch (type) {
      case 'Audi':
        return new Audi()

      case 'BMW':
        return new BMW()

      case 'Mercedes':
        return new Mercedes()

      default: {
        console.log('Unknown Car type...')
      }
    }
  }
}

const audi = CarFactory.create('Audi')
const bmw = CarFactory.create('BMW')
const mercedes = CarFactory.create('Mercedes')

audi.showInfo() // => I'm Audi-7nuweb00pkj
bmw.showInfo() // => I'm BMW-ygw7tqsdbxr
mercedes.showInfo() // => I'm Mercedes-1vfgp9wnhvk

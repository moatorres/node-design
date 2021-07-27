function Car() {
  this.name = 'Car'
  this.tires = 4
}

function Tractor() {
  this.name = 'Tractor'
  this.tires = 4
}

function Bike() {
  this.name = 'Bike'
  this.tires = 2
}

const vehicleFactory = {
  createVehicle: function (type) {
    switch (type.toLowerCase()) {
      case 'car':
        return new Car()
      case 'tractor':
        return new Tractor()
      case 'bike':
        return new Bike()
      default:
        return null
    }
  },
}

const carro = vehicleFactory.createVehicle('Car')

console.log(carro)

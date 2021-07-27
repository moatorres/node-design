class Pelican {
  walk() {
    console.log('Pelican walk')
  }

  quack() {
    console.log('Pelican quack')
  }

  dive() {
    console.log('Pelican dive')
  }
}

class Duck {
  walk() {
    console.log('Duck walk')
  }

  quack() {
    console.log('Duck quack')
  }
}

class Platypus {
  walk() {
    console.log('Platypus walk')
  }

  growl() {
    console.log('Platypus growl')
  }
}

function checkDuck(testObj) {
  if (typeof testObj.walk == 'function' && typeof testObj.quack == 'function') {
    return true
  }
  return false
}

let duck = new Duck()
let pelican = new Pelican()
let platypus = new Platypus()

console.log('Pelican implements Duck: ' + checkDuck(pelican))
console.log('Duck implements Duck: ' + checkDuck(duck))
console.log('Platypus implements Duck: ' + checkDuck(platypus))

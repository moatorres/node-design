class Person {
  constructor(name = 'unnamed person') {
    this.name = name
  }

  toString() {
    return JSON.stringify(this)
  }
}

class Shopper extends Person {
  constructor(name, money = 0) {
    super(name)
    this.money = money
    this.employed = false
  }
}

class Employee extends Shopper {
  constructor(name, money = 0, employer = '') {
    super(name, money)
    this.employer = employer
    this.employed = true
  }

  payDay(money = 0) {
    this.money += money
  }
}

const userFactory = (name, money = 0, type, employer) => {
  if (type === 'employee') {
    return new Employee(name, money, employer)
  } else {
    return new Shopper(name, money)
  }
}

const alex = userFactory('Alex Banks', 100)
const eve = userFactory('Eve Porcello', 100, 'employee', 'This and That')

eve.payDay(100)

console.log(alex)
console.log(alex.toString())
console.log(eve)
console.log(eve.toString())

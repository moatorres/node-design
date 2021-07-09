class Mall {
  constructor() {
    this.sales = []
  }

  notify(storeName, discount) {
    this.sales.push({ storeName, discount })
  }
}

class Shopper {
  constructor(name) {
    this.name = name
  }

  notify(storeName, discount) {
    console.log(
      `${this.name}, there is a sale at ${storeName}! ${discount}% off everything!`
    )
  }
}

class Store {
  constructor(name) {
    this.name = name
    this.subscribers = []
  }

  subscribe(observer) {
    this.subscribers.push(observer)
  }

  sale(discount) {
    this.subscribers.forEach((observer) => observer.notify(this.name, discount))
  }
}

const catsAndThings = new Store('Cats & Things')
const insAndOuts = new Store('Ins and Outs')

const alex = new Shopper('Alex')
const eve = new Shopper('Eve')
const sharon = new Shopper('Sharon')
const mike = new Shopper('Mike')

const valleyMall = new Mall()

catsAndThings.subscribe(alex)
catsAndThings.subscribe(eve)
catsAndThings.subscribe(mike)
catsAndThings.subscribe(valleyMall)

insAndOuts.subscribe(sharon)
insAndOuts.subscribe(valleyMall)

catsAndThings.sale(20)
insAndOuts.sale(50)

console.log(valleyMall.sales)

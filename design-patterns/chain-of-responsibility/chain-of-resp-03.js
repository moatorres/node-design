const log = (v) => console.log(v)

let Products = function () {
  this.products = []
  this.addProduct = (product) => {
    this.products.push(product)
  }
}

const Discount = function () {
  let numberDiscount = new NumberDiscount()
  let priceDiscount = new PriceDiscount()
  let noDiscount = new NoDiscount()
  let subtotal = new Subtotal()

  this.calculate = (products) => {
    numberDiscount.setNext(priceDiscount)
    priceDiscount.setNext(subtotal)
    subtotal.setNext(noDiscount)
    numberDiscount.exec(products).toFixed(2)
  }
}

const NumberDiscount = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }

  this.exec = function (products) {
    let result = null

    if (products.length > 3) {
      result = 0.1
    }
    return result + this.next.exec(products)
  }
}

const PriceDiscount = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }

  this.exec = function (products) {
    let result = null
    let reducer = (sum, item) => sum + item.price
    let total = products.reduce(reducer, 0)

    total > 100 && (result = 0.2)

    return this.next.exec(result, total, products)
  }
}

const NoDiscount = function () {
  this.exec = function () {
    return 0
  }
}

const Subtotal = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }

  this.printResult = (discount, amount) => {
    let subtotal = amount.toFixed(2)
    let percentage = discount * 100
    let discounted = (amount * discount).toFixed(2)
    let total = (subtotal - discounted).toFixed(2)

    return log(`
    Subtotal: $${subtotal}
    Bonus: ${percentage}%
    Discounted: $${discounted}
    Total: $${total}
    `)
  }

  this.exec = this.printResult
}

const list = new Products()

list.addProduct({ name: 'iPhone 11', price: 699 })
list.addProduct({ name: 'Samsung Galaxy S10', price: 599 })
list.addProduct({ name: 'Apple Watch', price: 199 })
list.addProduct({ name: 'Nokia Neo', price: 69 })

const discount = new Discount()
discount.calculate(list.products)

// Subtotal: $1566.00
// Bonus: 20%
// Discounted: $313.20
// Total: $1252.80

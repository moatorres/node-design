class Item {
  constructor(name, price) {
    this.name = name
    this.price = price
  }

  writeLn() {
    process.stdout.write(`${this.name}: $${this.price}`)
  }
}

class Iterator {
  constructor(items = []) {
    this.index = 0
    this.items = items
  }

  first() {
    var [first] = this.items
    return first
  }

  last() {
    var [last] = [...this.items].reverse()
    return last
  }

  hasNext() {
    return this.index < this.items.length - 1
  }

  current() {
    return this.items[this.index]
  }

  next() {
    if (this.hasNext()) {
      this.index += 1
    }
    return this.current()
  }

  previous() {
    if (this.index !== 0) {
      this.index -= 1
    }
    return this.current()
  }
}

require('readline').emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

console.log('Press any direction key...')

var inventory = new Iterator([
  new Item('Poles', 9.99),
  new Item('Skis', 799.99),
  new Item('Boots', 799.99),
  new Item('Burgers', 5.99),
  new Item('Fries', 2.99),
  new Item('Shake', 4.99),
  new Item('Jeans', 59.99),
  new Item('Shoes', 39.99),
])

process.stdin.on('keypress', (str, key) => {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)

  switch (key.name) {
    case 'right':
      inventory.next().writeLn()
      break

    case 'left':
      inventory.previous().writeLn()
      break

    case 'down':
      inventory.last().writeLn()
      break

    case 'up':
      inventory.first().writeLn()
      break

    case 'c':
      if (key.ctrl) {
        process.exit()
      }
  }
})

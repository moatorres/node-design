class InventoryItem {
  constructor(name, price) {
    this.name = name
    this.price = price
  }

  print() {
    console.log(`${item.name} costs ${item.price}`)
  }
}

class GoldenInventoryItem {
  constructor(baseItem) {
    this.name = `Golden ${baseItem.name}`
    this.price = 1000 + baseItem.price
  }
}

class DiamondInventoryItem {
  constructor(baseItem) {
    this.name = `Diamond ${baseItem.name}`
    this.price = 1000 + baseItem.price
    this.cutsGlass = true
  }

  print() {
    console.log(`${this.name} costs a lot of money...`)
  }
}

class Shopper {
  constructor(name, account = 0) {
    this.name = name
    this.account = account
    this.items = []
  }

  purchase(item) {
    if (item.price > this.account) {
      console.log(`Cannot afford ${item.name}`)
    } else {
      console.log(`Purchasing item ${item.name}`)
      this.account -= item.price
      this.items.push(item)
    }
  }

  printStatus() {
    console.log(`${this.name} has purchased ${this.items.length} items:`)
    this.items.forEach((item) => {
      console.log(`   * ${item.name} - ${item.price}`)
    })
    console.log(`${this.name} has $${this.account.toFixed(2)} remaining.`)
  }
}

var alex = new Shopper('Alex', 4000)

var walkman = new InventoryItem('Walkman', 29.99)
var necklace = new InventoryItem('Necklace', 9.99)

var gold_necklace = new GoldenInventoryItem(necklace)
var diamond_gold_necklace = new DiamondInventoryItem(gold_necklace)

var diamond_walkman = new DiamondInventoryItem(walkman)

alex.purchase(diamond_gold_necklace)
alex.purchase(diamond_walkman)

alex.printStatus()

diamond_walkman.print()

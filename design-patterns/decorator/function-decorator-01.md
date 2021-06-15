# Design Patterns

## Function Decorator

#### `invetory-item.js`

```js
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
```

#### `shopper.js`

```js
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
```

### Usage

```js
const alex = new Shopper('Alex', 4000)

const walkman = new InventoryItem('Walkman', 29.99)
const necklace = new InventoryItem('Necklace', 9.99)

const gold_necklace = new GoldenInventoryItem(necklace)
const diamond_gold_necklace = new DiamondInventoryItem(gold_necklace)

const diamond_walkman = new DiamondInventoryItem(walkman)

alex.purchase(diamond_gold_necklace)
alex.purchase(diamond_walkman)

alex.printStatus()

diamond_walkman.print()
```

### Credits

From this [repo](https://github.com/diegomais/node-js-design-patterns/) written by [@diegomais](https://github.com/diegomais)

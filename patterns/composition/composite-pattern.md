# Design Patterns

## Composite Pattern

#### `CatalogItem`

```js
class CatalogItem {
  constructor(name, price) {
    this.name = name
    this.price = price
  }

  get total() {
    return this.price
  }

  print() {
    console.log(`${this.name} $${this.price} `)
  }
}

module.exports = CatalogItem
```

#### `CatalogGroup`

```js
class CatalogGroup {
  constructor(name, composites = []) {
    this.name = name
    this.composites = composites
  }

  get total() {
    return this.composites.reduce(
      (total, nextItem) => total + nextItem.total,
      0
    )
  }

  print() {
    console.log(`\n${this.name.toUpperCase()}`)
    this.composites.forEach((item) => item.print())
  }
}

module.exports = CatalogGroup
```

### Usage

```js
const CatalogItem = require('./CatalogItem')
const CatalogGroup = require('./CatalogGroup')

const boots = new CatalogItem('Leather Boots', 79.99)
const sneakers = new CatalogItem('Kicks', 39.99)
const flipFlops = new CatalogItem('California work boots', 19.99)

const group_shoes = new CatalogGroup('Shoes and Such', [
  boots,
  sneakers,
  flipFlops,
])

const group_food = new CatalogGroup('Food for while you try on clothes', [
  new CatalogItem('Milkshake', 5.99),
  new CatalogItem('French Fries', 3.99),
])

const keychain = new CatalogItem('Key Chain', 0.99)

const catalog = new CatalogGroup('Clothes and Food', [
  keychain,
  group_shoes,
  group_food,
])

console.log(`$${catalog.total}`)

catalog.print()
```

### Credits

From this [repo](https://github.com/diegomais/node-js-design-patterns/) written by [@diegomais](https://github.com/diegomais)

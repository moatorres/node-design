class Storage {
  constructor(name, inventory = [], deliveryTime = 0) {
    this.name = name
    this.inventory = inventory
    this.deliveryTime = deliveryTime
    this.next = null
  }

  setNext(storage) {
    this.next = storage
  }

  lookInLocalInventory(itemName) {
    let index = this.inventory.map((item) => item.name).indexOf(itemName)
    return this.inventory[index]
  }

  find(itemName) {
    let foundItem = this.lookInLocalInventory(itemName)
    if (foundItem) {
      return {
        name: foundItem.name,
        qty: foundItem.qty,
        location: this.name,
        deliveryTime:
          this.deliveryTime === 0 ? 'now' : `${this.deliveryTime} day(s)`,
      }
    } else if (this.next) {
      return this.next.find(itemName)
    } else {
      return `we do not carry ${itemName}`
    }
  }
}

class Store {
  constructor(name, inventory = []) {
    this.name = name
    let floor = new Storage('store floor', inventory.floor)
    let backroom = new Storage('store backroom', inventory.backroom)
    let localStore = new Storage('nearby store', inventory.localStore, 1)
    let warehouse = new Storage('warehouse', inventory.warehouse, 5)

    floor.setNext(backroom)
    backroom.setNext(localStore)
    localStore.setNext(warehouse)

    this.storage = floor
  }

  find(itemName) {
    return this.storage.find(itemName)
  }
}

const inventory = {
  floor: [
    { name: 'ski googles', qty: 5 },
    { name: 'ski hats', qty: 15 },
    { name: 'all mountain skis', qty: 2 },
    { name: 'ski boots', qty: 2 },
  ],
  backroom: [
    { name: 'ski googles', qty: 5 },
    { name: 'ski hats', qty: 15 },
    { name: 'ski poles', qty: 2 },
    { name: 'ski rack', qty: 1 },
  ],
  localStore: [
    { name: 'ski boots', qty: 2 },
    { name: 'ski poles', qty: 4 },
    { name: 'wax', qty: 8 },
  ],
  warehouse: [
    { name: 'ski googles', qty: 100 },
    { name: 'ski hats', qty: 100 },
    { name: 'all mountain skis', qty: 10 },
    { name: 'ski boots', qty: 20 },
    { name: 'ski poles', qty: 20 },
    { name: 'powder skis', qty: 10 },
    { name: 'wax', qty: 100 },
    { name: 'powder skis', qty: 10 },
    { name: 'ski rack', qty: 3 },
  ],
}

let skiShop = new Store('Steep and Deep', inventory)
let searchItem = 'powder skis'
let results = skiShop.find(searchItem)

console.log(results)

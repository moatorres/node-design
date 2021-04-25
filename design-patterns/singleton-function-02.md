# Functional Programming

## Singleton Pattern

Let's create a `Bank` object that has 3 methods:

- `deposit()` increases cash
- `withdraw()` decreases cash
- `total()` returns cash

```js
let cash = 0

const Bank = {
  deposit(amount) {
    cash += amount
    return cash
  },
  withdraw(amount) {
    if (amount <= cash) {
      cash -= amount
      return true
    } else {
      return false
    }
  },
  total() {
    return cash
  },
}

module.exports = Bank
```

**Note**: our `Bank` object behaves like a Singleton because we will use `module.exports` and `require()` statement

```js
const fund = require('./Bank')
const atm1 = require('./Bank')
const atm2 = require('./Bank')

fund.deposit(10000)

atm1.deposit(20)
console.log(`total-atm1: ${atm1.total()}`) // => total-atm1: 9900

atm2.withdraw(120)
console.log(`total-atm2: ${atm2.total()}`) // => total-atm2: 9900

fund.deposit(2000)
console.log(`total-fund: ${fund.total()}`) // => total-fund: 11900
```

We have now created 3 `Bank` objects (`fund`, `atm1`, `atm2`). Every `Bank` object can deposit or withdraw money. All actions interact with a single cash resource that lives inside our `Bank` singleton.

### Credits

From this [article](https://grokonez.com/node-js/how-to-implement-singleton-in-node-js-example) published on [grokonez.com](https://grokonez.com/)

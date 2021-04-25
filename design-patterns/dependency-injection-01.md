# Design Patterns

## Dependency Injection

**Dependency Injection** is a form of _Inversion of Control_ technique that supports the Dependency Inversion Principle (the last one of SOLID Principles – decoupling software modules).

What is the problem with tightly coupled modules? We may end up hardwiring multiple modules. It’s difficult to change a module later, so we may need to refactor a lot of code.

The Dependency Inversion principle states that _high-level modules should not depend on low-level modules_.

- Modules shouldn't connect to each other directly. Instead, they should use interfaces/references to external modules
- Dependency is instantiated before being passed (or injected) to other modules as parameters

Low-level modules are “dependencies” of higher-level modules, in that high-level module implementations depend on low-level modules.

There are two common ways to implement Dependency Injection in Node.js.

- **Constructor Injection**
  Dependency is injected to a class via its `constructor` method
- **Setter Injection**
  Dependencies are injected to a class via a `setter` method

For example, we could use a `config()` method as the `setter` method to inject a `logger` to `AnyClass`:

```js
class AnyClass {
  config({ logger }) {
    this.logger = logger
  }
  doSomething(amount) {
    this.logger.write(`Logging ${amount} units`)
  }
}

module.exports = new AnyClass()
```

Then, if we want to use a `logger`, we initiate it before injecting:

```js
// const logger = require('./logger-console');
const AnyThing = require('./AnyClass')
const logger = require('./logger-file')

AnyThing.config({ logger })
```

Now we can use `AnyThing` without caring about `logger` details. This provides us a **loose-coupling**, reusable modules with different dependencies (e.g. `logger-console` or `logger-file`).

Let's create a `Bank` class that has `config()` method with a property called `logger`, which will work as an interface for us to plug-in any `logger` module.

```js
class Bank {
  constructor() {
    this.cash = 0
  }

  config({ logger }) {
    this.logger = logger
  }

  deposit(amount) {
    this.cash += amount

    if (this.logger) {
      this.logger.write(`deposit: ${amount}, cash: ${this.cash}`)
    }

    return this.cash
  }

  withdraw(amount) {
    if (amount <= this.cash) {
      this.cash -= amount

      if (this.logger) {
        this.logger.write(`withdraw: ${amount}, cash: ${this.cash}`)
      }

      return true
    } else {
      if (this.logger) {
        this.logger.write('failed to withdraw!')
      }

      return false
    }
  }

  total() {
    if (this.logger) {
      this.logger.write(`check cash: ${this.cash}`)
    }

    return this.cash
  }
}

module.exports = new Bank()
```

Let's create a `logger-console`

```js
const write = (log) => console.log(`${new Date()} > ${log}`)

module.exports = {
  write,
}
```

And a `logger-file` module

```js
const { appendFile } = require('fs')
const { join } = require('path')

const logText = join(__dirname, 'log.txt')
const logString = (log) => `${new Date()} > ${log}\n`

const write = (log = null) => {
  if (!log) return

  appendFile(logText, logString(log), (error) => {
    if (error) {
      return console.log('Error writing to the log file')
    }
  })
}

module.exports = { write }
```

### Usage

First, we initiate `logger` object and choose which logger module we'll need. Then we use our `config()` method to inject that dependency.

```js
const Bank = require('./Bank')
const logger = require('./logger-file')

Bank.config({ logger })

Bank.deposit(50000)
// => Date > deposit: 50000, current cash: 50000

Bank.withdraw(200)
// => Date > withdraw: 200, current cash: 49800

Bank.withdraw(500)
// => Date > withdraw: 500, current cash: 49300

Bank.total()
// => Date > check cash: 49300
```

### Credits

From this [article](https://grokonez.com/design-pattern/implement-dependency-injection-node-js-example) published on [grokonez.com](https://grokonez.com)

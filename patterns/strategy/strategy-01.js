const path = require('path')
const { appendFile } = require('fs')

class Strategies {
  static noDate(timestamp, message) {
    console.log(message)
  }

  static toFile(timestamp, message) {
    let fileName = path.join(__dirname, 'logs.txt')
    appendFile(fileName, `${timestamp} - ${message} \n`, (error) => {
      if (error) {
        console.log('Error writing to file')
        console.error(error)
      }
    })
  }

  static toConsole(timestamp, message) {
    console.log(`${timestamp} - ${message}`)
  }

  static none() {}
}

class Logger {
  constructor(strategy = 'toConsole') {
    this.logs = []
    this.strategy = Strategies[strategy]
  }

  get count() {
    return this.logs.length
  }

  changeStrategy(newStrategy) {
    this.strategy = Strategies[newStrategy]
  }

  log(message) {
    const timestamp = new Date().toISOString()
    this.logs.push({ message, timestamp })
    this.strategy(timestamp, message)
  }
}

// module.exports = new Logger(config.logs.strategy)

const config = require('./strategy-01-config.json')
const logger = new Logger(config.logs.type)

logger.log('Hello World')
logger.log('Hi World')
logger.log('Yo World')

logger.changeStrategy('toConsole')

logger.log('Hello World')
logger.log('Hi World')
logger.log('Yo World')

logger.changeStrategy('toFile')

logger.log('Hello World')
logger.log('Hi World')
logger.log('Yo World')

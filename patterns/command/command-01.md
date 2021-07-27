# Design Patterns

## Command Pattern

#### `commands.js`

```js
let { writeFile, unlink } = require('fs')
let path = require('path')

class ExitCommand {
  get name() {
    return 'exit... bye!'
  }

  execute() {
    process.exit(0)
  }
}

class CreateCommand {
  constructor(fileName, text) {
    this.fileName = fileName
    this.fullPath = path.join(__dirname, fileName)
    this.body = text
  }

  get name() {
    return `create ${this.fileName}`
  }

  execute() {
    writeFile(this.fullPath, this.body, (f) => f)
  }

  undo() {
    unlink(this.fullPath, (f) => f)
  }
}

module.exports = { ExitCommand, CreateCommand }
```

#### `conductor.js`

```js
class Conductor {
  constructor() {
    this.history = []
    this.undone = []
  }

  run(command) {
    console.log(`Executing command: ${command.name}`)
    command.execute()
    this.history.push(command)
  }

  printHistory() {
    this.history.forEach((command) => console.log(command.name))
  }

  undo() {
    let command = this.history.pop()
    console.log(`undo ${command.name}`)
    command.undo()
    this.undone.push(command)
  }

  redo() {
    let command = this.undone.pop()
    console.log(`redo ${command.name}`)
    command.execute()
    this.history.push(command)
  }
}

module.exports = new Conductor()
```

### Usage

```js
let { createInterface } = require('readline')
let conductor = require('./conductor')
let { ExitCommand, CreateCommand } = require('./commands')
let rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('create <fileName> <text> | history | undo | redo | exit')
rl.prompt()

rl.on('line', (input) => {
  let [commandText, ...remaining] = input.split(' ')
  let [fileName, ...fileText] = remaining
  let text = fileText.join(' ')

  switch (commandText) {
    case 'history':
      conductor.printHistory()
      break

    case 'undo':
      conductor.undo()
      break

    case 'redo':
      conductor.redo()
      break

    case 'exit':
      conductor.run(new ExitCommand())
      break

    case 'create':
      conductor.run(new CreateCommand(fileName, text))
      break

    default:
      console.log(`${commandText} command not found!`)
  }

  rl.prompt()
})
```

### Credits

From this [repo](https://github.com/diegomais/node-js-design-patterns/) written by [@diegomais](https://github.com/diegomais)

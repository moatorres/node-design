# Design Patterns

## Function Decorator

Decorators are wrapper functions that enhance the wrapped function. You don’t change the original function behavior, instead you decorate it with new behavior, achieving extensability and composability.

```js
const fn = () => {}

const decorator = (fn) => () => {
  //do some enhancement
  return fn()
}

const anotherDecorator = (fn) => () => {
  //do another enhancement
  return fn()
}

//compose decorated functions
const f1 = anotherDecorator(fn) // => f1()
const f2 = anotherDecorator(decorator(fn)) // => f2()
```

Imagine that you are developing a javascript application that runs shell commands through a interactive interface. The user runs a command by pressing a button, and sees the output through a panel.

You create a function to abstract the sometimes complicated `spawn`/`exec` Node API. These abstractions are called **facades**.

Let's write a promisified facade for the complicated NodeJS spawn API. It should accept two arguments:

- a shell command string to run
- some options to the spawn native function

It should run the command, print to `stdout`, and resolve or reject the promise.

```js
const { spawn } = require('child_process')

const runCommand = (command, options) =>
  new Promise((resolve, reject) => {
    const cmd = spawn(command, {
      shell: true,
      ...options,
    })

    cmd.stdout.on('data', (data) => console.info(data.toString()))
    cmd.stdout.on('end', () => resolve(command))

    cmd.stderr.on('data', (data) => console.info(data.toString()))

    cmd.on('error', (error) => {
      console.error(`Command could not be run: ${error}`)
      reject(error)
    })
  })
```

`withLogger`

```js
const withLogger = (func) => (command, options) => {
  console.info(`Running command: ${command}`)
  return func(command, options)
}

export default withLogger(runCommand)
```

`withTimeTracker`

```js
const withTimeTracker = (func) => (command, options) => {
  const start = process.hrtime()
  const [seconds, milliseconds] = process.hrtime(start)

  console.info(`Time ellapsed ${seconds}s ${milliseconds / 1000000}ms`)

  const result = func(command, options)

  return result
}
```

### Usage

```js
const run = withTimeTracker(withLogger(runCommand)))

run('ls', { cwd: '/home/user' })
```

### Credits

From the article [Decorator design pattern in functional and object oriented programming](https://medium.com/qualyteam-engineering/decorator-design-pattern-in-functional-and-object-oriented-programming-e0a2be3c5679) written by [@MarcoNicolodi](https://github.com/MarcoNicolodi)

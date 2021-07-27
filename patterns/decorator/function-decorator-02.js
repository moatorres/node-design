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

const withLogger = (func) => (command, options) => {
  console.log(`Running command: ${command}`)
  return func(command, options)
}

const withTimeTracker = (func) => (command, options) => {
  const start = process.hrtime()
  const [seconds, milliseconds] = process.hrtime(start)

  console.info(`Time ellapsed ${seconds}s ${milliseconds / 1000000}ms`)

  const result = func(command, options)

  return result
}

const run = withTimeTracker(withLogger(runCommand))

run('ls', { cwd: '' }) // => cwd works from the execution folder

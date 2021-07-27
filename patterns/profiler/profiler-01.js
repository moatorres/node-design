class Profiler {
  constructor(label) {
    this.label = label
    this.lastTime = null
  }

  start() {
    this.lastTime = process.hrtime()
  }

  end() {
    const diff = process.hrtime(this.lastTime)
    const microTimeInSeconds = diff[1] * 1e-9
    console.log(`Timer ${this.label} took ${diff[0]} seconds and ${diff[1]}ns`)
  }
}

function createProfiler(label) {
  if (process.env.NODE_ENV === 'development') return new Profiler(label)

  if (process.env.NODE_ENV === 'production')
    return {
      start: () => {},
      end: () => {},
    }

  throw new Error('Environment not set')
}

function getRandomArray(len) {
  const profiler = createProfiler(`Generating a ${len} items long array`)

  profiler.start()

  const arr = [].fill(null, len)

  for (let i = 0; i < arr; i++) {
    arr[i] = Math.random()
  }

  profiler.end()
}

process.env.NODE_ENV = 'development'

getRandomArray(1e14)

console.log('Done')

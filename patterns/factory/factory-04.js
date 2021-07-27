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
    console.log(
      `Timer "${this.label}" took ${diff[0]} seconds ` +
        `and ${diff[1]} nanoseconds.`
    )
  }
}

const noopProfiler = {
  start() {},
  end() {},
}

function createProfiler(label) {
  if (process.env.NODE_ENV === 'production') return noopProfiler
  return new Profiler(label)
}

function getAllFactors(intNumber) {
  let max = Number.MAX_SAFE_INTEGER
  if (intNumber > max) {
    console.log(`Please enter a number smaller than ${max}`)
    return
  }

  const profiler = createProfiler(`Finding all factors of ${intNumber}`)

  profiler.start()
  let factors = []

  // change factor to 1 to heap out of memory
  for (let factor = 2; factor <= intNumber; factor++) {
    while (intNumber % factor === 0) {
      factors.push(factor)
      intNumber = intNumber / factor
    }
  }

  profiler.end()

  return factors
}

function factorBack(factors) {
  if (!factors) return
  const profiler = createProfiler(`Finding the original number from ${factors}`)

  profiler.start()
  let result = factors.reduce((acc, value) => acc * value)
  profiler.end()

  return result
}

const myNumber = 120937172839
const myFactors = getAllFactors(myNumber)
const myOriginalNumber = factorBack(myFactors)

if (myFactors) {
  console.log(`Factors of ${myNumber} are: `, myFactors)
  console.log(`Factoring ${myFactors} returns: `, myOriginalNumber)
}

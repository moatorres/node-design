class Person {
  setName(first, last) {
    this.firstName = first
    this.lastName = last
    return this
  }
  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}

const requireAll = (fn) =>
  function (...args) {
    if (args.length < fn.length) throw new Error('Missing required arguments')
    else return fn.apply(this, args)
  }

Object.defineProperty(Person.prototype, 'setName', {
  value: requireAll(Person.prototype.setName),
})

// const thinker = new Person().setName('Albert')
// => Error: Missing required arguments

const thinker = new Person().setName('Albert', 'Einstein')
// => Person { firstName: 'Prince', lastName: 'Edward' }

console.log(thinker)

// for methods
const onceForMethods = (fn) => {
  let invocations = new WeakSet()

  return function (...args) {
    if (invocations.has(this)) return
    invocations.add(this)
    return fn.apply(this, args)
  }
}

Object.defineProperty(Person.prototype, 'setName', {
  value: onceForMethods(requireAll(Person.prototype.setName)),
})

const musician = new Person().setName('Miles', 'Davis')
musician.setName('Frank', 'Sinatra') // fails silently

const logician = new Person().setName('Xuxa', 'Meneghel')
logician.setName('Angélica', 'Huck') // fails silently

console.log(musician.fullName()) // => Miles Davis
console.log(logician.fullName()) // => Xuxa Meneghel

// for functions
const onceForFunctions = (fn) => {
  let invocations = new WeakSet(),
    undefinedContext = Symbol('undefined-context')

  return function (...args) {
    const context = this === undefined ? undefinedContext : this

    if (invocations.has(context)) return
    invocations.add(context)
    return fn.apply(this, args)
  }
}

const hello = onceForFunctions(() => "Call me again and I'll be undefined")

console.log(hello()) // => hello!
console.log(hello()) // => undefined

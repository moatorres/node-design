class TodoModelClass {
  constructor() {
    this.todos = []
    this.lastChange = null
  }

  addToPrivateList() {
    console.log('addToPrivateList')
  }

  add() {
    console.log('add')
  }

  reload() {}
}

function TodoModelFunction() {
  let todos = []
  let lastChange = null

  function addToPrivateList() {
    console.log('addToPrivateList')
  }

  function add() {
    console.log('add')
  }

  function reload() {}

  return Object.freeze({
    add,
    reload,
  })
}

// no encapsulation
let todoModel1 = new TodoModelClass()
console.log(todoModel1.todos) // []
console.log(todoModel1.lastChange) // null
todoModel1.addToPrivateList() // addToPrivateList

// encapsulated
let todoModel2 = TodoModelFunction()
console.log(todoModel2.todos) // undefined
console.log(todoModel2.lastChange) // undefined
// todoModel2.addToPrivateList()
// => taskModel.addToPrivateList is not a function

class Service {
  doSomething() {
    console.log('doSomething')
  }
}

class SpecialService {
  constructor(args) {
    this.service = args.service
  }
  doSomething() {
    this.service.doSomething()
  }

  doSomethingElse() {
    console.log('doSomethingElse')
  }
}

let specialService1 = new SpecialService({
  service: new Service(),
})

specialService1.doSomething()
specialService1.doSomethingElse()

function ServiceFunction() {
  function doSomething() {
    console.log('doSomething')
  }
  return Object.freeze({
    doSomething,
  })
}

function SpecialServiceFunction(args) {
  let service = args.service
  function doSomethingElse() {
    console.log('doSomethingElse')
  }
  return Object.freeze({
    doSomething: service.doSomething,
    doSomethingElse,
  })
}

let specialService2 = SpecialServiceFunction({
  service: ServiceFunction(),
})

specialService2.doSomething()
specialService2.doSomethingElse()

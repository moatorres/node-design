//
//----------------------------------------------------------------------
//
// This source file is part of the @mokacloud/common-js project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Simple Mixin ]---------------------------------------------------

class Todo {
  constructor(name) {
    this.name = name || 'Untitled'
    this.done = false
  }
  do() {
    this.done = true
    return this
  }
  undo() {
    this.done = false
    return this
  }
}

// const SimplyColoured = {
//   setColourRGB({ r, g, b }) {
//     this.colourCode = { r, g, b }
//     return this
//   },
//   getColourRGB() {
//     return this.colourCode
//   },
// }

// "colourCode" will be a prop of Todo
// => Todo { name: 'test', done: false, colourCode: { r: 1, g: 2, b: 3 } }

const colourCode = Symbol('colourCode')

// upgraded to have a private prop
const PrivatelyColoured = {
  setColourRGB({ r, g, b }) {
    this[colourCode] = { r, g, b }
    return this
  },
  getColourRGB() {
    return this[colourCode]
  },
}

// "colourCode" will not be a prop of Todo
// Todo {
//   name: 'test',
//   done: false,
//   [Symbol(colourCode)]: { r: 1, g: 2, b: 3 }
// }

// Object.assign(Todo.prototype, SimplyColoured)
// Object.assign(Todo.prototype, PrivatelyColoured)

// const todo = new Todo('test').setColourRGB({ r: 1, g: 2, b: 3 })

// console.log(todo)

// --[ Functional Mixin ]-----------------------------------------------

// without a mixin factory
// const ColouredMixin = (target) =>
//   Object.assign(target, {
//     setColourRGB({ r, g, b }) {
//       this.colourCode = { r, g, b }
//       return this
//     },
//     getColourRGB() {
//       return this.colourCode
//     },
//   })

// ColouredMixin(Todo.prototype)

//  mixin factory
const FunctionalMixin = (behaviour) =>
  function (target) {
    for (let property of Reflect.ownKeys(behaviour))
      Object.defineProperty(target, property, { value: behaviour[property] })
    return target
  }

// with mixin factory
const Coloured = FunctionalMixin({
  setColourRGB({ r, g, b }) {
    this.colourCode = { r, g, b }
    return this
  },
  getColourRGB() {
    return this.colourCode
  },
})(Todo.prototype)

const todo = new Todo('test').setColourRGB({ r: 1, g: 2, b: 3 })

console.log(todo)

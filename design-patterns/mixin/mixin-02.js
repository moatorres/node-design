let eventMixin = {
  on(eventName, handler) {
    if (!this._handlers) this._handlers = {}
    if (!this._handlers[eventName]) {
      this._handlers[eventName] = []
    }
    this._handlers[eventName].push(handler)
  },

  off(eventName, handler) {
    let handlers = this._handlers?.[eventName]
    if (!handlers) return
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1)
      }
    }
  },

  trigger(eventName, ...args) {
    if (!this._handlers?.[eventName]) {
      return // no handlers for that eventName
    }

    // call the handlers
    this._handlers[eventName].forEach((handler) => handler.apply(this, args))
  },
}

class Menu {
  choose(value) {
    this.trigger('select', value)
  }
}

Object.assign(Menu.prototype, eventMixin)

let menu = new Menu()

// add a handler to be called on "select"
menu.on('select', (value) => console.log(`Value selected: ${value}`))
// menu.on('select', (value) => alert(`Value selected: ${value}`))

// triggers the event
menu.choose('123') // => Value selected: 123

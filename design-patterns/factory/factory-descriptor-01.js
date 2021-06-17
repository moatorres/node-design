// create "backend" object to hold data for getters and setters on main object
const _ = Object.create(null)

Object.defineProperties(_, {
  firstname: {
    value: 'John',
    writable: true,
    enumerable: false,
    configurable: false,
  },
  middlename: {
    value: 'Jack',
    writable: true,
    enumerable: false,
    configurable: false,
  },
  lastname: {
    value: 'Doe',
    writable: true,
    enumerable: false,
    configurable: false,
  },
})

// create main object
const dbEntry = Object.create(null)

Object.defineProperties(dbEntry, {
  _: {
    value: _,
    writable: false,
    enumerable: false,
    configurable: false,
  },
  id: {
    value: 1,
    enumerable: true,
  },
  ssn: {
    value: '123-45-6789',
    writable: false,
    enumerable: true,
    configurable: false,
  },
  birthdate: {
    value: '01/21/1980',
    writable: false,
    enumerable: true,
    configurable: false,
  },
  lastAccessed: {
    value: Date.now(),
    writable: true,
    configurable: false,
    enumerable: true,
  },
  lastModified: {
    value: Date.now(),
    writable: true,
    configurable: false,
    enumerable: true,
  },
  name: {
    enumerable: true,
    configurable: false,
    get() {
      this.lastAccessed = Date.now()
      const { firstname, middlename, lastname } = this._
      return `${firstname} ${middlename} ${lastname}`
    },
    set(newName) {
      this.lastModified = Date.now()
      const [firstname, middlename, lastname] = newName.split(' ')
      this._.firstname = firstname
      this._.middlename = middlename
      this._.lastname = lastname
    },
  },
  [Symbol.iterator]: {
    value: function* () {
      yield this.id
      yield this.name
      yield this.birthdate
      yield this.ssn
      yield this.lastAccessed
      yield this.lastModified
    },
  },
  [Symbol.toPrimitive]: {
    value: function (hint) {
      if (hint === 'string') {
        return [...this].join(', ')
      }
      return NaN
    },
  },
})

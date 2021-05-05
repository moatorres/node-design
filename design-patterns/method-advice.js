function mixin(behaviour, sharedBehaviour = {}) {
  const instanceKeys = Reflect.ownKeys(behaviour)
  const sharedKeys = Reflect.ownKeys(sharedBehaviour)
  const typeTag = Symbol('isa')

  function _mixin(clazz) {
    for (let property of instanceKeys)
      Object.defineProperty(clazz.prototype, property, {
        value: behaviour[property],
        writable: true,
      })
    Object.defineProperty(clazz.prototype, typeTag, { value: true })
    return clazz
  }
  for (let property of sharedKeys)
    Object.defineProperty(_mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property),
    })
  Object.defineProperty(_mixin, Symbol.hasInstance, {
    value: (i) => !!i[typeTag],
  })
  return _mixin
}

const HasAge = mixin({
  setAge(age) {
    this.age = age
  },

  age() {
    return this.age
  },
})

let before = (behaviour, ...decoratedMethodNames) => (clazz) => {
  if (typeof behaviour === 'string') {
    behaviour = clazz.prototype[behaviour]
  }

  for (let decoratedMethodName of decoratedMethodNames) {
    let decoratedMethodFunction = clazz.prototype[decoratedMethodName]

    Object.defineProperty(clazz.prototype, decoratedMethodName, {
      value: function (...args) {
        let behaviourValue = behaviour.apply(this, ...args)

        if (behaviourValue === undefined || !!behaviourValue)
          return decoratedMethodFunction.apply(this, args)
      },
      writable: true,
    })
  }

  return clazz
}

const after = (behaviour, ...methodNames) => (clazz) => {
  for (let methodName of methodNames) {
    const method = clazz.prototype[methodName]

    Object.defineProperty(clazz.prototype, property, {
      value: function (...args) {
        const returnValue = method.apply(this, args)

        behaviour.apply(this, args)
        return returnValue
      },
      writable: true,
    })
  }
  return clazz
}

const mustBeLoggedIn = () => {
  if (currentUser() == null)
    throw new PermissionsException('Must be logged in!')
}

const mustBeMe = () => {
  if (currentUser() == null || !currentUser().person().equals(this))
    throw new PermissionsException('Must be me!')
}

const Person = HasAge(
  before(
    mustBeMe,
    'setName',
    'setAge',
    'age'
  )(
    before(
      mustBeLoggedIn,
      'fullName'
    )(
      class {
        setName(first, last) {
          this.firstName = first
          this.lastName = last
        }

        fullName() {
          return this.firstName + ' ' + this.lastName
        }
      }
    )
  )
)

# Utilities

## JavaScript Mutability

In the beggining JavaScript's `var` really didn't cared about immutable data.

```js
var animal = 'panda'
animal = 'lion'
```

### Why Use Immutable Data

Let’s say we have an e-commerce site.

```js
// Module: checkout.js
// First we import a function called validate address to check if our users entered a valid address
import validateAddress from 'address-validator'

const checkout = (user, cart) => {
  //... checkout code

  var userAddress = user.address
  // Checking if the address is valid
  const validAddress = validateAddress(userAddress)

  // If the address is valid then
  if (validAddress) {
    //... proceed to checkout
  }
}
```

Let’s say we got our address-validator by installing an `npm` package.

`$ npm install address-validator`

Everything works as expected but one day a new version is released, and a new line of code is introduced to the package:

```js
// Module: validateAddress.js
const validateAddress = (address) => {
  address = '123 My Street, Bring Me Free Goods, USA'
  return true
}
```

Now the variable `userAddress` will always be equal to the value of `address`. 

Of course, malicious code is an edge case.  This specific issue can be solved by using immutability. But it can also be solved with proper scoping.

There are many ways in which immutable data can help you write better code. For example, a very common mistake is to accidentally mutate the property of an object.

```js
// Module: accidental-change.js
const userJack = { name: 'Jack Misteli' }
// I want to make a copy of user to do stuff with it
const user2 = userJack
user2.name = 'Bob'

// Because we didn't do a copy:
// userJack.name === 'bob'
```

### Immutability Tools

The most intuitive immutability tool is to use `const`.

```js
const animal = 'panda'

// This will throw a TypeError!
panda = 'lion'
```

However, `const` sometimes only gives the illusion of immutability.

```js
// Module: example-checkout.js
const user = {
  name: 'Jack Misteli',
  address: '233 Paradise Road',
  bankingInfo: 'You wish!',
}

const maliciousAddressValidator = (user) => {
  user.address = 'Malicious Road'
  return true
}

const validAddress = maliciousAddressValidator(user)
// Now user.address === 'Malicious Road' !!
```

There are different ways to solve this problem and introducing immutability is one of them.

First, we can use the `Object.freeze` method.

```js
const user = {
  address: '233 Paradise Road',
}
Object.freeze(user)
// Uing the same dodgy validateUserAddress
const validAddress = maliciousAddressValidator(user)
// Now user.address === '233 Paradise Road' !!
```

One issue with `Object.freeze` is that you don’t affect sub-properties. To reach all sub-properties you can write something like:

```js
const superFreeze = (obj) => {
  Object.values(obj).forEach((val) => {
    if (typeof val === 'object') superFreeze(val)
  })
  Object.freeze(obj)
}
```

Another solution is to use proxies if you need flexibility.

### Using Property Descriptors

You can modify property descriptors to create immutable properties, but you make sure that configurable and writeable are set to false.

```js
// Setting up a normal getter
const user = {
  get address() {
    return '233 Paradise Road'
  },
}
console.log(Object.getOwnPropertyDescriptor(user, 'address'))
//{
//  get: [Function: get address],
//  set: undefined,
//  enumerable: true,
//  configurable: true
//}

const validAddress = maliciousAddressValidator(user)

// It looks like our data is immutable!
// user.address ===  '233 Paradise Road'
```

But the data is still mutable, it is just more difficult to mutate it:

```js
const maliciousAddressValidator = (user) => {
  // We don't reassign the value of address directly
  // We reconfigure the address property
  Object.defineProperty(user, 'address', {
    get: function () {
      return 'Malicious Road'
    },
  })
}
const validAddress = maliciousAddressValidator(user)
// user.address === 'Malicious Road'
```

Arr!

If we set writable and configurable to false we get:

```js
const user = {}
Object.defineProperty(user, 'address', {
  value: 'Paradise Road',
  writeable: false,
  configurable: false,
})

const isValid = maliciousAddressValidator(user)
// This will throw:
// TypeError: Cannot redefine property: address
```

### Immutable Arrays

`Array`s have the same problem as `Object`s.

```js
const arr = ['a', 'b', 'c']
arr[0] = 10
// arr === [ 10, 'b', 'c' ]
```

You can use the same tools we used above.

```js
Object.freeze(arr)
arr[0] = 10
// arr[0] === 'a'

const zoo = []
Object.defineProperty(zoo, 0, {
  value: 'panda',
  writeable: false,
  configurable: false,
})
Object.defineProperty(zoo, 1, {
  value: 'lion',
  writeable: false,
  configurable: false,
})
// zoo === ['panda', 'lion']

zoo[0] = 'alligator'
// The value of zoo[0] hasn't changed
// zoo[0] === 'panda
```

### Credits

From the article [Mutable Immutable JavaScript](https://www.digitalocean.com/community/tutorials/js-mutability) written by [@Otomakan](https://github.com/Otomakan)

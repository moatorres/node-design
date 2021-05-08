# Utilities

## JavaScript `Set`

**Sets** are a new object type with ES6 (ES2015) that **allow creating collections of unique values**. The values in a set can be either simple primitives like strings or integers as well as more complex object types like object literals or arrays.

Here’s a simple example showing off a basic `Set` and a few of the available methods on it like `add`, `size`, `has`, `forEach`, `delete` and `clear`:

```js
let animals = new Set()

animals.add('🐷')
animals.add('🐼')
animals.add('🐢')
animals.add('🐿')
console.log(animals.size) // 4
animals.add('🐼')
console.log(animals.size) // 4

console.log(animals.has('🐷')) // true
animals.delete('🐷')
console.log(animals.has('🐷')) // false

animals.forEach((animal) => {
  console.log(`Hey ${animal}!`)
})

// Hey 🐼!
// Hey 🐢!
// Hey 🐿!

animals.clear()
console.log(animals.size) // 0
```

Here’s another example where we pass-in an array to initialize the set. Notice how the initializing array gets deconstructed, but an array added added later stays in the form of an array:

```js
let myAnimals = new Set(['🐷', '🐢', '🐷', '🐷'])

myAnimals.add(['🐨', '🐑'])
myAnimals.add({ name: 'Rud', type: '🐢' })
console.log(myAnimals.size) // 4

myAnimals.forEach((animal) => {
  console.log(animal)
})

// 🐷
// 🐢
// ["🐨", "🐑"]
// Object { name: "Rud", type: "🐢" }
```

Strings are a valid iterable so they can also be passed-in to initialize a set:

```js
console.log('Only unique characters will be in this set.'.length) // 43

let sentence = new Set('Only unique characters will be in this set.')
console.log(sentence.size) // 18
```

On top of using `forEach` on a set, `for…of` loops can also be used to iterate over sets:

```js
let moreAnimals = new Set(['🐺', '🐴', '🐕', '🐇'])

for (let animal of moreAnimals) {
  console.log(`Howdy ${animal}`)
}

// Howdy 🐺
// Howdy 🐴
// Howdy 🐕
// Howdy 🐇
```

#### Keys and Values

Sets also have the keys and values methods, with keys being an alias for values, so both methods do exactly the same thing. Using either of these methods returns a new iterator object with the values of the set in the same order in which they were added to the set. Here’s an example:

```js
let partyItems = new Set(['🍕', '🍾', '🎊'])
let items = partyItems.values()

console.log(items.next())
console.log(items.next())
console.log(items.next())
console.log(items.next().done)

// Object {
// done: false,
// value: "🍕"
// }

// Object {
// done: false,
// value: "🍾"
// }

// Object {
// done: false,
// value: "🎊"
// }

// true
```

### Credits

From the article [Introduction to Sets in JavaScript](https://alligator.io/js/sets-introduction/) published on [alligator.io](https://alligator.io)

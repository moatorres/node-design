# Utilities

## JavaScript `Set`

**Sets** are a new object type with ES6 (ES2015) that **allow creating collections of unique values**. The values in a set can be either simple primitives like strings or integers as well as more complex object types like object literals or arrays.

Hereβs a simple example showing off a basic `Set` and a few of the available methods on it like `add`, `size`, `has`, `forEach`, `delete` and `clear`:

```js
let animals = new Set()

animals.add('π·')
animals.add('πΌ')
animals.add('π’')
animals.add('πΏ')
console.log(animals.size) // 4
animals.add('πΌ')
console.log(animals.size) // 4

console.log(animals.has('π·')) // true
animals.delete('π·')
console.log(animals.has('π·')) // false

animals.forEach((animal) => {
  console.log(`Hey ${animal}!`)
})

// Hey πΌ!
// Hey π’!
// Hey πΏ!

animals.clear()
console.log(animals.size) // 0
```

Hereβs another example where we pass-in an array to initialize the set. Notice how the initializing array gets deconstructed, but an array added added later stays in the form of an array:

```js
let myAnimals = new Set(['π·', 'π’', 'π·', 'π·'])

myAnimals.add(['π¨', 'π'])
myAnimals.add({ name: 'Rud', type: 'π’' })
console.log(myAnimals.size) // 4

myAnimals.forEach((animal) => {
  console.log(animal)
})

// π·
// π’
// ["π¨", "π"]
// Object { name: "Rud", type: "π’" }
```

Strings are a valid iterable so they can also be passed-in to initialize a set:

```js
console.log('Only unique characters will be in this set.'.length) // 43

let sentence = new Set('Only unique characters will be in this set.')
console.log(sentence.size) // 18
```

On top of using `forEach` on a set, `forβ¦of` loops can also be used to iterate over sets:

```js
let moreAnimals = new Set(['πΊ', 'π΄', 'π', 'π'])

for (let animal of moreAnimals) {
  console.log(`Howdy ${animal}`)
}

// Howdy πΊ
// Howdy π΄
// Howdy π
// Howdy π
```

#### Keys and Values

Sets also have the keys and values methods, with keys being an alias for values, so both methods do exactly the same thing. Using either of these methods returns a new iterator object with the values of the set in the same order in which they were added to the set. Hereβs an example:

```js
let partyItems = new Set(['π', 'πΎ', 'π'])
let items = partyItems.values()

console.log(items.next())
console.log(items.next())
console.log(items.next())
console.log(items.next().done)

// Object {
// done: false,
// value: "π"
// }

// Object {
// done: false,
// value: "πΎ"
// }

// Object {
// done: false,
// value: "π"
// }

// true
```

### Credits

From the article [Introduction to Sets in JavaScript](https://alligator.io/js/sets-introduction/) published on [alligator.io](https://alligator.io)

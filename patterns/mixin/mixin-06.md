# Design Patterns

## Mixin

**Mixins** are a powerful way to build and manage behaviors. Let's imagine that we'd like to recreate some functionalities of [Ragnarok Online](). In this example I'll create two characters that I've actually played with with my brother: the `Priest` and the `Archer`.

#### Specs

- All characters should have common properties like `name`, `level`, `hp`, `agi` and `clothes`
- We should be able to choose our characters' gender
- We should be able to choose our characters' class (Archer or Priest)
- When a character changes its `level` they should have their `hp` increased
- Different characters should have different abilities

First we'd need the ability to create characters.

```js
const createCharacter = (name, initialLevel = 1) => {
  const setHP = (level) => level * 10
  const setAgi = (agility) => agility + 3
  return {
    name,
    level: initialLevel,
    agility: initialLevel,
    levelUp: function () {
      // we also have access to props from other mixins
      // if(this.class === 'Archer') return
      this.level++
      this.hp = setHP(this.level)
      this.agility = setAgi(this.level)
    },
    hp: setHP(initialLevel),
  }
}
```

Now let's create a mixin function that adds a `gender` prop to our character so we can reuse it.

```js
const gender = (gender) => (character) => ({
  gender,
  ...character,
})
```

Now we'll build **character mixin** for each character and their specific properties

- `Archer`

```js
const archer = (character) => ({
  class: 'Archer',
  abilities: ['Arrow Strike', 'Wind Walker'],
  clothes: 'Suit',
  ...character,
})
```

- `Archer`

```js
const priest = (character) => ({
  class: 'Priest',
  abilities: ['Heal', 'Blessing'],
  clothes: 'Dress',
  ...character,
})
```

#### Usage

```js
// user "alex" built a Male Priest named Orwell
const alex = pipe(createCharacter, priest, gender('Male'))('Orwell')
// user "john" built a Male Archer named Hunts
const john = pipe(createCharacter, archer, gender('Male'))('Hunts')

console.log(alex)
console.log(john)

alex.levelUp()
john.levelUp()

console.log(alex)
console.log(john)
```

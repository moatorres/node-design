# Design Patterns

## Template Class

In the example below, the `Pokemon` class will be our template class

```js
class Pokemon {
  constructor(_pokemon) {
    this.name = _pokemon.name || 'unknown'
    this.power = _pokemon.power || 1
    this.attack = _pokemon.attack || 1
    this.defense = _pokemon.defense || 1
  }

  toString() {
    return `${this.name} -  power: ${this.power}; attack: ${this.attack}; defense: ${this.defense}`
  }

  calculateMultiplier() {
    // Step 1 - Common
    return (1 / 2) * this.power * Math.random()
  }

  showDamage(damage) {
    // Step 3 - Common
    console.log('Pokemon damage is:', damage)
  }

  calculateDamage() {
    const multipliers = this.calculateMultiplier() // Step 1
    const damage = this.calculateImpact(multipliers) // Step 2
    this.showDamage(damage) // Step 3
  }
}
```

Let's write classes that implement our `Pokemon` template

### **`FightingPokemon`**

```js
class FightingPokemon extends Pokemon {
  constructor(_pokemon) {
    super(_pokemon)
  }
  calculateImpact(multipliers) {
    return Math.floor((this.attack / this.defense) * multipliers) + 1
  }
}
```

#### Usage

```js
const passimian = new FightingPokemon({
  name: 'Passimian',
  attack: 10,
  power: 10,
  defense: 10,
})

passimian.calculateDamage()
console.log(passimian.toString())
```

### **`PoisonPokemon`**

```js
class PoisonPokemon extends Pokemon {
  constructor(_pokemon) {
    super(_pokemon)
  }
  calculateImpact(multipliers) {
    return Math.floor((this.attack - this.defense) * multipliers) + 1
  }
}
```

#### Usage

```js
const poipole = new PoisonPokemon({
  name: 'Poipole',
  attack: 10,
  power: 10,
  defense: 10,
})

console.log(poipole.toString())

poipole.calculateDamage()
```

### **`GroundPokemon`**

```js
class GroundPokemon extends Pokemon {
  constructor(_pokemon) {
    super(_pokemon)
  }
  calculateImpact(multipliers) {
    return Math.floor((this.attack + this.defense) * multipliers) + 1
  }
}
```

#### Usage

```js
const mudsdale = new GroundPokemon({
  name: 'Mudsdale',
  attack: 10,
  power: 10,
  defense: 10,
})

console.log(mudsdale.toString())

mudsdale.calculateDamage()
```

### Credits

From this [repo](https://github.com/Caballerog/blog) written by [@Caballerog](https://github.com/Caballerog)

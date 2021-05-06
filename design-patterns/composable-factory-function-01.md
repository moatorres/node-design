# Design Patterns

## Composable Factory Functions

In this article we’re going to hack, slash and fire-blast our way through an example of **how to build a video game character creator service**, and we will do it all **using factory functions**.

### What are factory functions?

A factory function is a function that returns a new object, without requiring the `new` keyword. The `new` keyword is required if you are using classes.

Let’s step through an example of creating objects that describe characters in the video game we are building.

```js
const createCharacter = (name, initialLevel) => {
  return {
    name: name,
    level: initialLevel,
  }
}
const carl = createCharacter('Carl', 1) // => carl = { name: 'Carl', level: 1 }
```

As we can see in the above example, our function `createCharacter` just returns a plain old JavaScript object.

### Why use factory functions?

Objects are the building blocks of JavaScript. When we are writing software with JavaScript our code is organised and described using objects, even if we don’t realise it.

If we only need a single object, we don’t need a factory function. We instead declare an object literal like this:

```js
const carl = {
  name: 'Carl',
  level: 1,
}
// => carl = { name: 'Carl', level: 1 }
```

What about when we need to create several, dozens or even thousands of characters? This is where factories come in handy.

```js
const createCharacter = (name, initialLevel) => {
  return {
    name: name,
    level: initialLevel,
  }
}

const carl = createCharacter('Carl', 1)
const tom = createCharacter('Tom', 1)
const sophie = createCharacter('Sophie', 3)
```

We can see above that a factory function makes it easy for us to create many instances of objects. It also allows us to describe the structure of our object in a single place, reducing repetition in our code.

#### Adding some (syntax) sugar

We can write the previous code in a more concise manner using [implicit return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#Advanced_syntax) and [shorthand property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) names. Take a look:

```js
const createCharacter = (name, initialLevel) => ({
  name,
  level: initialLevel,
})

const carl = createCharacter('Carl', 1)
const tom = createCharacter('Tom', 1)
const sophie = createCharacter('Sophie', 3)
```

Also notice how most new characters we create start at level 1? We can use default parameters for our factory functions arguments. This will let us default the value of `initialLevel` to `1`, unless a value for it is defined when we call our `createCharacter()` factory function.

```js
const createCharacter = (name, initialLevel = 1) => ({
  name,
  level: initialLevel,
})

const carl = createCharacter('Carl')
const tom = createCharacter('Tom')
const sophie = createCharacter('Sophie', 3)
```

#### Adding methods to factories

Carl has been busy slaying monsters at the gates of Ironforge. We must reward all his hard work! Let’s add a method to our factory that gives our characters the ability to level up:

```js
const createCharacter = (name, initialLevel = 1) => ({
  name,
  level: initialLevel,
  levelUp: function () {
    this.level++
  },
})
const carl = createCharacter('Carl')
// => carl = { name: 'Carl', level: 1, levelUp: f() }
carl.levelUp()
// => carl = { name: 'Carl', level: 2, levelUp: f() }
```

Ok, there’s some new stuff going on here. The important thing to take note is that the object that our factory returns has a function for the value of `levelUp`. This function is a method of our object. We can run this method on our object like so:

```js
carl.levelUp()
```

When writing the logic inside our methods, we use the `this` keyword to target values in the current object the method belongs to. This is really powerful because it allows our object instances to update and manage their own state.

#### Data privacy

As we all know, all video game characters need health points(HP). In our game a characters HP rises with their level. We calculate our characters health by multiplying their level by a coefficient. In our case this coefficient is 10.

```js
const setHealthPoints = (level) => level * 10
```

Determining the HP for our characters is an implementation detail of our factory function. The consumers of our factory function don’t need to know how HP is calculated. In fact it might even be detrimental. They could override the function to make their character get more health. They might also build code that relies on the `setHealthPoints`. This would mean if we needed to update how we calculate HP it may break our consumers code.

Let’s look at how we can add the ability to calculate HP in our factory, without exposing the logic to our consumers:

```js
const createCharacter = (name, initialLevel = 1) => {
  const setHealthPoints = (level) => level * 10
  return {
    name,
    level: initialLevel,
    levelUp: function () {
      this.level++
      this.hp = setHealthPoints(this.level)
    },
    hp: setHealthPoints(initialLevel),
  }
}
const carl = createCharacter('Carl')
// => carl = { name: 'Carl', level: 1, levelUp: f(), hp: 10 }
carl.levelUp()
// => carl = { name: 'Carl', level: 2, levelUp: f(), hp: 20 }
// => carl.setHealthPoints = undefined
```

Our function for setting health points is part of the closure scope of our factory. This means that the objects our factory creates will have access to it, **but it will not be part of the object our consumers can access**. This is why `carl.setHealthPoints` will always be undefined.

### Composing software using factories

Carl has a lot to offer the world of Azeroth. He has the ability to heal and resurrect his allies. Our character factory also doesn’t even make mention of his Dwarven heritage or his gender.

Let’s look at how we can start using factory functions as building blocks to start creating meaningful characters. We might be able to do this by building factories that **inherit** other factories.

Here is an example of how we might use inheritance to create a Male Priest Dwarf character.

```js
const createCharacter = (name, initialLevel = 1) => {
  const setHealthPoints = (level) => level * 10
  return {
    name,
    level: initialLevel,
    levelUp: function () {
      this.level++
      this.hp = setHealthPoints(this.level)
    },
    hp: setHealthPoints(initialLevel),
  }
}

const createMaleCharacter = (name, initialLevel = 1) => {
  const baseCharacter = createCharacter(name, initialLevel)
  return {
    gender: 'Male',
    ...baseCharacter,
  }
}

const createMalePriestCharacter = (name, initialLevel = 1) => {
  const baseCharacter = createMaleCharacter(name, initialLevel)
  return {
    class: 'Priest',
    abilities: ['Flash heal', 'Resurrect'],
    armourType: 'Cloth',
    ...baseCharacter,
  }
}

const createMalePriestDwarfCharacter = (name, initialLevel = 1) => {
  const baseCharacter = createPriestCharacter(name, initialLevel)
  return {
    race: 'Dwarf',
    racialAbility: 'Stone form',
    ...baseCharacter,
  }
}

const carl = createMalePriestDwarfCharacter('Carl')
```

Inheritance is where we describe relationships between the parts of our software as a taxonomy. For example, `createMalePriestDwarfCharacter()` inherits the properties of `createPriestCharacter()` which inherits the properties of `createMaleCharacter()`.

##### I don’t recommend you do this.

Imagine building out a massive hierarchy that can accommodate all the different combinations of classes and races. It would be total spaghetti code. Amongst other issues it creates:

- **Tight coupling** — Each child factory is dependant on its parent factory. Changes to the parent factory could possible break or cause unintended consequences in it’s descendants
- **Inflexibility** — Eventually you will need to make a change that doesn’t fit into the taxonomy structure your inheritance uses
- **Duplication** — In the above example we add the Dwarf properties to our factory in the `createMalePriestDwarfCharacter` function. What if we want to create a Male Warrior Dwarf? The factory for adding Dwarf properties is tightly coupled to `createMalePriestCharacter` (which creates Priest properties). The only easy way is to duplicate the code for adding Dwarf properties…

I want to share a better technique that we can use to **compose** our factory functions together. Composition is the act of combining things together. Let’s learn about **composing** factories using functional mixins.

### Functional Mixins

```js
import { pipe } from 'rambda'

const createCharacter = (name, initialLevel = 1) => {
  const setHealthPoints = (level) => level * 10
  return {
    name,
    level: initialLevel,
    levelUp: function () {
      this.level++
      this.hp = setHealthPoints(this.level)
    },
    hp: setHealthPoints(initialLevel),
  }
}

const withGender = (gender) => (character) => ({
  gender,
  ...character,
})

const isDwarf = (character) => ({
  race: 'Dwarf',
  racialAbility: 'Stone form',
  ...character,
})

const isPriest = (character) => ({
  class: 'Priest',
  abilities: ['Flash heal', 'Resurrect'],
  armourType: 'Cloth',
  ...character,
})

const carl = pipe(
  createCharacter,
  isDwarf,
  isPriest,
  withGender('Male')
)('Carl')
```

Let’s step through what is going on here.

A functional mixin is a function that takes an object, and returns a new object with additional properties.

```js
const isPriest = (character) => ({
  class: 'Priest',
  abilities: ['Flash heal', 'Penance'],
  armourType: 'Cloth',
  ...character,
})
```

Functional mixins are completely decoupled from each other. All they do is extend an object. This makes them incredibly flexible as they don’t have any of the issues we get with inheritance.

We combine functional mixins in a pipeline to compose and enhance our factories. Each mixin adds properties to an object, and then passes it to the next mixin.

In the example we are using `pipe` to compose our mixins. If this is new to you, read my article [Using pipe and compose to improve procedural code](https://medium.com/dailyjs/using-pipe-and-compose-to-improve-procedural-code-ddf2c18094fd).

Let’s take a look at this [more comprehensive factory function example on code sandbox](https://codesandbox.io/s/character-bios-jpcqc). We need to create some friends for Carl to go on adventures with.

### Benefits of composing factories

Why is it almost always better to compose factories using functional mixins rather than using inheritance?

- **More scalable** — If we need to add more features to our characters, it is as simple as adding mixins to our pipe.
- **Easier to change** — Need to remove a feature? Just remove the mixin from the pipe.
- **More declarative** — It’s much easier to see what features makes up each character.
  Reduces tight coupling — Each mixin is not dependant on the presence of each other.

### Credits

From the article [Building and Composing Factory Functions](https://medium.com/dailyjs/building-and-composing-factory-functions-50fe90141374) written by [@simonschwartz](https://github.com/simonschwartz)

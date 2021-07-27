const _pipe = (a, b) => (arg) => b(a(arg))
const pipe = (...ops) => ops.reduce(_pipe)

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
  const baseCharacter = createMalePriestCharacter(name, initialLevel)
  return {
    race: 'Dwarf',
    racialAbility: 'Stone form',
    ...baseCharacter,
  }
}

const carlPriest = createMalePriestDwarfCharacter('Carl')

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

console.log(carl)

carl.levelUp()

console.log(carl)

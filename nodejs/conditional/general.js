// --[ option #1 (object literal) ]-----------------------------------

const isRedFruit = (fruit) => {
  return fruit === 'apple' || fruit === 'strawberry' || fruit === 'rasberry'
}

const checkColor = (fruit) => (isRedFruit(fruit) ? 'red' : 'not red')

checkColor('strawberry') // => red
checkColor('poo') // => not red

// --[ option #2 (Array.includes) ]-----------------------------------

let redFruits = ['apple', 'strawberry', 'rasberry', 'pomegranite', 'cherry']

const checkFruitColor = (fruit) => {
  return redFruits.includes(fruit) ? 'red' : 'not red'
}

checkFruitColor('cherry') // => red
checkFruitColor('poo') // => not red

// --[ option #3 (early return) ]-------------------------------------

let isBerry = (str) => /berry/.test(str)

// nasty!
const checkFruit = (fruit) => {
  if (typeof fruit === 'string') {
    if (redFruits.includes(fruit)) {
      if (isBerry(fruit)) return 'red berry'
      else return 'red fruit'
    } else return 'not red fruit'
  } else return 'not a string'
}

checkFruit('strawberry') // red berry

// better
let checkFruit2 = (fruit) => {
  // condition 1: return early
  if (typeof fruit !== 'string') return 'not a string'

  // condition 2: check if red and berry
  if (redFruits.includes(fruit) && isBerry(fruit)) return 'red berry'

  // condition 3: check if red fruit or not
  return redFruits.includes(fruit) ? 'red fruit' : 'not red fruit'
}

checkFruit2(42) // not a string
checkFruit2('strawberry') // red berry
checkFruit2('apple') // red fruit
checkFruit2('halleberry') // not red fruit

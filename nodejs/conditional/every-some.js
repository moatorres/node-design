//----------------------------------------------------------------//

const fruits = [
  { name: 'apple', color: 'red' },
  { name: 'banana', color: 'yellow' },
  { name: 'grape', color: 'purple' },
]

//----------------------------------------------------------------//

const areAllFruitsRed = (fruits) => {
  let isAllRed = true

  fruits.forEach((o) => {
    if (!isAllRed) return false
    isAllRed = o.color === 'red'
  })

  return isAllRed
}

areAllFruitsRed(fruits) // => false

//----------------------------------------------------------------//

let areAllRed = (fruits) => fruits.every((o) => o.color === 'red')

areAllRed(fruits) // => false

//----------------------------------------------------------------//

let isAnyFruitRed = (fruits) => fruits.some((o) => o.color === 'red')

isAnyFruitRed(fruits) // => true

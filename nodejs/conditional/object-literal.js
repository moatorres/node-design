//----------------------------------------------------------------//

// 👎

let findFruit = (color) => {
  // use switch case to find fruits in color
  switch (color) {
    case 'red':
      return ['apple', 'strawberry']
    case 'yellow':
      return ['banana', 'pineapple']
    case 'purple':
      return ['grape', 'plum']
    default:
      return []
  }
}

findFruit('red') // ['apple', 'strawberry']

//----------------------------------------------------------------//

let findFruit2 = (color) => {
  const colors = {
    red: ['apple', 'strawberry'],
    yellow: ['banana', 'pineapple'],
    purple: ['grape', 'plum'],
  }
  return colors[color] || []
}

findFruit2('red') // ['apple', 'strawberry']

//----------------------------------------------------------------//

let findFruit3 = (color) => {
  const fruits = [
    { name: 'apple', color: 'red' },
    { name: 'strawberry', color: 'red' },
    { name: 'banana', color: 'yellow' },
    { name: 'pineapple', color: 'yellow' },
    { name: 'grape', color: 'purple' },
    { name: 'plum', color: 'purple' },
  ]

  return fruits.filter((o) => o.color === color).map((o) => o.name)
}

findFruit3('red') // ['apple', 'strawberry']

//----------------------------------------------------------------//

let findFruit4 = (color) => {
  const fruits = new Map([
    ['red', ['apple', 'strawberry']],
    ['yellow', ['banana', 'pineapple']],
    ['purple', ['grape', 'plum']],
  ])

  return fruits.get(color)
}

let res = findFruit4('red') // ['apple', 'strawberry']

console.log(res)

//----------------------------------------------------------------//

let findFruit5 = (color) => {
  const fruits = {
    apple: 'red',
    strawberry: 'red',
    banana: 'yellow',
    pineapple: 'yellow',
    grape: 'purple',
    plum: 'purple',
  }

  let res = []

  for (let key in fruits) if (fruits[key] === color) res.push(key)

  return res
}

let res2 = findFruit5('red') // ['apple', 'strawberry']

console.log(res2)

//----------------------------------------------------------------//

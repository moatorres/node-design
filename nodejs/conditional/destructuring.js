//------------------------------------------------------------------
// destructuring
//------------------------------------------------------------------

// // #1
// function buyFood({ foodName, quantity }) {
//   return { foodName, quantity }
// }

// // #2
// const buyFood = ({ foodName, quantity }) => {
//   return { foodName, quantity }
// }

// // #3
// const buyFood = (foodName, quantity) => ({ foodName, quantity })

// #4
const buyFood = ({ foodName, quantity = 1 }) => {
  const addTax = (value) => Number((value * 1.1).toFixed(2))

  // list #1
  const priceList = {
    apple: 0.99,
    orange: 1.99,
  }
  const subtotal = priceList[foodName] * quantity

  // list #2
  // const priceList = new Map([
  //   ['apple', 0.99],
  //   ['orange', 1.99],
  // ])
  // const subtotal = priceList.get(foodName) * quantity

  const total = addTax(subtotal)

  // return #1
  // return { subtotal, total }

  // return #2
  return [subtotal, total]
}

// both
const res = buyFood({ foodName: 'apple' })
console.log(res)
// #1 => { subtotal: 0.99, total: 1.09 }
// #2 => [ 0.99, 1.09 ]

// // #1
// const { subtotal } = buyFood({ foodName: 'apple' })
// console.log('subtotal:', subtotal) // => subtotal: 0.99

// // #1
// const { total } = buyFood({ foodName: 'apple' })
// console.log('total:', total) // => total: 1.09

// #2
const [subtotal, total] = buyFood({ foodName: 'apple' })
console.log(subtotal, total) // => 0.99 1.09

// #2
const [one, all] = buyFood({ foodName: 'apple' })
console.log(one, all) // => 0.99 1.09

// #2
const [, r] = buyFood({ foodName: 'apple' })
console.log(r) // => 1.09

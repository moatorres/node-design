//----------------------------------------------------------------//

// 👎 default param
let orderFruit = (fruit, quantity) => {
  let qty = quantity || 1
  return `Order ${qty} ${fruit}`
}

orderFruit('apple') // => Order 1 apple
orderFruit('apple', 2) // => Order 2 apple

//----------------------------------------------------------------//

// 👍 default param
let orderFruit2 = (fruit, quantity = 1) => {
  return `Order ${quantity} ${fruit}`
}

orderFruit2('apple') // => Order 1 apple
orderFruit2('apple', 2) // => Order 2 apple

//----------------------------------------------------------------//

// where fruit is an object
let buyFruit = (fruit) => {
  if (fruit && fruit.name) {
    let q = fruit.quantity ? fruit.quantity : 1
    return `Buy ${q} ${fruit.name}`
  } else {
    return 'No fruit'
  }
}

buyFruit({}) // => No fruit
buyFruit({ name: 'apple' }) // => Buy 1 apple
buyFruit({ name: 'apple', quantity: 2 }) // => Buy 2 apple

//----------------------------------------------------------------//

// destructuring with default params
let buyFruit2 = ({ name, quantity = 1 } = {}) => {
  return name ? `Buy ${quantity} ${name}` : 'No fruit'
}

buyFruit2({}) // => No fruit
buyFruit2({ name: 'apple' }) // => Buy 1 apple
buyFruit2({ name: 'apple', quantity: 2 }) // => Buy 2 apple

//----------------------------------------------------------------//

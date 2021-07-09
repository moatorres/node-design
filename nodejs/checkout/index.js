// order
let order = {
  customer: 'john doe',
  currency: 'AUD',
  lineItems: [
    { product: 'book', price: 1.5, quantity: 2, discount: 0.05 },
    { product: 'shirt', price: 21.5, quantity: 1 },
    { product: 'underwear', price: 5.5, quantity: 3 },
    { product: 'shoes', price: 55.5, quantity: 1, discount: 0.1 },
  ],
  address: '123 fake street',
  shippingZone: 'A',
}

// utils
const calcSubTotal = (arr) => {
  let subTotalReducer = (prev, product) => {
    let subTotal = product.price * product.quantity
    return prev + subTotal
  }

  let initialValue = 0
  let result = arr.reduce(subTotalReducer, initialValue)

  return Number(result.toFixed(2))
}

const calcSubTotalWithDiscount = (arr) => {
  let subTotalReducer = (prev, product) => {
    let subTotal = product.price * product.quantity
    let discount = product.discount ? 1 - product.discount : 1

    return prev + subTotal * discount
  }

  let initialValue = 0
  let result = arr.reduce(subTotalReducer, initialValue)

  return Number(result.toFixed(2))
}

const checkTax = (currency) => {
  const tax = {
    AUD: 0.1,
    USD: 0,
    EUR: 0.05,
    CNY: 0,
  }
  return tax[currency] ? tax[currency] : 0
}

const checkShipping = (zone) => {
  const shipping = {
    A: 5,
    B: 10,
    C: 15,
    D: 25,
  }
  return shipping[zone] ? shipping[zone] : 5
}

const toCurrency = (num) => `$${num.toFixed(2)}`
const toPercent = (num) => `${(num * 100).toFixed(2)}%`

// checkout
const getReceipt = (order) => {
  let subTotal = calcSubTotal(order.lineItems)
  let subTotalWithDiscount = calcSubTotalWithDiscount(order.lineItems)
  let tax = checkTax(order.currency)
  let shipping = checkShipping(order.shippingZone)
  let totalCost = Number(
    (subTotalWithDiscount * (1 + tax) + shipping).toFixed(2)
  )

  return {
    subTotal: toCurrency(subTotal),
    subTotalWithDiscount: toCurrency(subTotalWithDiscount),
    tax: toPercent(tax),
    shipping: toCurrency(shipping),
    totalCost: toCurrency(totalCost),
  }
}

// usage
let res = getReceipt(order)

console.log(res)
// => {
//   subTotal: '$96.50',
//   subTotalWithDiscount: '$90.80',
//   tax: '10.00%',
//   shipping: '$5.00',
//   totalCost: '$104.88'
// }

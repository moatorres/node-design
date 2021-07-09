const R = require('ramda')
const data = require('./stocks')

// Convert string to float number
let toInteger = R.pipe((d) => d.replace(/[^0-9.]/g, ''), parseFloat)

// Calc average
let average = (arr) => arr.reduce((sum, tally) => sum + tally, 0) / arr.length

// Add market_cap_int property
let addMarketCapInt = (arr) =>
  arr.map((o) =>
    Object.assign({}, o, { market_cap_int: toInteger(o.market_cap) })
  )

// Filter for big health stocks
let filterHealthBigCap = R.filter(
  R.where({
    sector: R.equals('Health Care'),
    market_cap: (o) => toInteger(o) > 100,
  })
)

let x = filterHealthBigCap(data)
x

// List all big health stocks by market_cap descending
let healthSort = R.pipe(
  filterHealthBigCap,
  addMarketCapInt,
  R.sortWith([R.descend(R.prop('market_cap_int'))])
)

let sorted = healthSort(data)

// Avg marketcap of big health stocks
let healthAvgMktCap = R.pipe(
  filterHealthBigCap,
  R.map((o) => toInteger(o.market_cap)),
  average
)

let result = healthAvgMktCap(data) // 371

console.log(result)

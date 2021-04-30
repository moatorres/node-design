const UserDomain = Symbol('UserDomain')

const makeUser = ({ userInfo }) => {
  const of = (value) => {
    const toNumber = () => value.toNumber()

    return Object.assign(plus, {
      [UserDomain]: true,
      constructor: of,
      map: (f) => of(f(value)),
      valueOf: toNumber,
      getNome: () => nome,
      lt: (b) => value.isLessThan(of(b)),
      toFixed: (digits = userInfo) => value.toFixed(digits),
      toNumber: toNumber,
      toString: () => value.toFixed(userInfo),
    })
  }

  of.of = of

  return of
}

const userInfo = {}

const ethereum = makeUser({ userInfo })
const $ = makeUser({ userInfo })

const lt = (base, comparand) => base.lt(comparand)

module.exports = {
  makeUser,
  $,
  ethereum,
  lt,
}

// const BigNumber = require('bignumber.js')

// const MoneySafe = Symbol('MoneySafe')

// const createCurrency = ({ decimals }) => {
//   const of = (input, value = new BigNumber(String(input))) => {
//     const plus = (b) => of(value.plus(of(b)))
//     const times = (b) => of(value.multipliedBy(of(b)))
//     const div = (b) => of(value.dividedBy(of(b)))
//     const toNumber = () => value.toNumber()
//     const abs = () => of(value.abs())

//     return Object.assign(plus, {
//       [MoneySafe]: true,
//       constructor: of,
//       map: (f) => of(f(value)),
//       valueOf: toNumber,
//       plus,
//       add: plus,
//       times,
//       multipliedBy: times,
//       div,
//       dividedBy: div,
//       minus: (b) => of(value.minus(of(b))),
//       lt: (b) => value.isLessThan(of(b)),
//       gt: (b) => value.isGreaterThan(of(b)),
//       lte: (b) => value.isLessThanOrEqualTo(of(b)),
//       gte: (b) => value.isGreaterThanOrEqualTo(of(b)),
//       toFixed: (digits = decimals) => value.toFixed(digits),
//       toNumber: toNumber,
//       abs,
//       toString: () => value.toFixed(decimals),
//     })
//   }
//   of.of = of
//   return of
// }

// const ethereum = createCurrency({ decimals: 18 })
// const $ = createCurrency({ decimals: 2 })

// const add = (...ns) => ns.reduce((a, b) => a.plus(b))
// const multiply = (...ns) => ns.reduce((a, b) => a.times(b))
// const divide = (dividend, divisor) => dividend.div(divisor)
// const lt = (base, comparand) => base.lt(comparand)
// const gt = (base, comparand) => base.gt(comparand)
// const lte = (base, comparand) => base.lte(comparand)
// const gte = (base, comparand) => base.gte(comparand)

// module.exports = {
//   createCurrency,
//   $,
//   ethereum,
//   add,
//   multiply,
//   divide,
//   lt,
//   gt,
//   lte,
//   gte,
// }

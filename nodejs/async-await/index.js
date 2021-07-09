// see: https://github.com/howardmann/node-design-patterns/tree/master/async-await

const axios = require('axios')

// fetch top 10 cryptocurrencies
const fetchList = () => {
  let url = 'https://api.coinmarketcap.com/v1/ticker/?limit=10'
  return axios.get(url)
}

// fetch coin by ticker
const fetchCoin = (ticker) => {
  let url = `https://www.cryptocompare.com/api/data/coinsnapshot/?fsym=${ticker}&tsym=USD`
  return axios.get(url)
}

const getTop3Coins = async () => {
  // fetch full list then pick out top 3 ones
  let topCoins = await fetchList()
  let firstTicker = topCoins.data[0].symbol
  let secondTicker = topCoins.data[1].symbol
  let thirdTicker = topCoins.data[2].symbol

  // use await with [destructuring] and Promise.all
  let [first, second, third] = await Promise.all([
    fetchCoin(firstTicker),
    fetchCoin(secondTicker),
    fetchCoin(thirdTicker),
  ])

  return {
    [firstTicker]: first.data.Data,
    [secondTicker]: second.data.Data,
    [thirdTicker]: third.data.Data,
  }
}

let res = getTop3Coins()

console.log(res)

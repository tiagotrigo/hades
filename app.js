'use stricts';

const R = require('ramda');
const Coins = require('./coins.js');
const Novadax = require('./novadax.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.fee_bl = 0.0025,
    this.fee_exc = 0.0025,
    this.entry = 0.00100000,
    this.min = 0.00020000,
    this.profit = null
  }

  atraso(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  repetir(ms, func) {
    return new Promise((resolve) => (
      setInterval(func, ms), 
      this.atraso(ms).then(resolve)
    ));
  }

  formatNumber(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  getBalance() {
    return Novadax.getBalance().then((balance) => {
      return balance.data.data;
    }).catch((er) => {
      return er
    });
  }

  getOrderBook(market, size) {
    return Novadax.getOrderBook(market, size).then((order) => {
      return order.data.data
    }).catch((er) => {
      return er
    })
  }

  async setup() {
    if (this.count >= Coins.length) this.count = 0;

    const { symbol } = Coins[this.count];

    console.log(await this.getOrderBook('LTC_BTC', 10))

    this.count += 1;
  }

  iniciar() {
    this.repetir(5000, 
      () => Promise.all([
        this.setup()
      ])
    )
  }
}

new Hades().iniciar();
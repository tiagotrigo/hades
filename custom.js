'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.email = 'tiago.a.trigo@gmail.com',
    this.exchanges = [
      {
        Bleutrade,
        fee: 0.0025
      },
      {
        Exc,
        fee: 0.0025
      }
    ],
    this.coins = [
      { walk: 'BTC_USDT-LTC_BTC' },
      { walk: 'BTC_USDT-ETH_BTC' },
      { walk: 'USDT_BTC-ETH_USDT' },
      { walk: 'USDT_BTC-LTC_USDT' },
      { walk: 'USDT_LTC-BTC_USDT' },
      { walk: 'USDT_ETH-BTC_USDT' }
    ]
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

  sum(entry, book, type) {
    let i = 0;
    let sum = 0;
    let orders = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), type === 'buy' ? book.sell : book.buy);
    let ordersSum = R.map((item) => {
      i++;
      sum = sum + item;
      return {
        id: i - 1,
        rate: type === 'buy' ? book.sell[i - 1].Rate : book.buy[i - 1].Rate,
        quantity: item,
        sum: this.formatNumber(sum, 8)
      }
    }, orders);

    return R.filter((n) => n.sum >= entry, ordersSum);
  }

  explode(arr) {
    return arr.split('-')
  }

  setup() {
    if (this.count >= this.coins.length) this.count = 0;

    let walk = this.explode(this.coins[this.count].walk);

      console.log(walk.length)

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
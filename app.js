'use stricts';

const R = require('ramda');
const sprintf = require('sprintf-js').sprintf;
const Coins = require('./coins.js');
const Novadax = require('./novadax.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.fee = 0.9980,
    this.entry = 0.0012
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

  marketBTC(symbol, dividend, market) {
    Novadax.getOrderBook(`${dividend}_${market}`).then((data) => {
      let buy_1 = data.data.data.sell[0][0];
      
      // Primeira compra
      let qnt_1 = this.entry * 0.9980;
      let qnt_1_fee = qnt_1 / buy_1;

      Novadax.getOrderBook(`${dividend}_ETH`).then((data) => {
        let buy_2 = data.data.data.buy[0][0];
        let qnt_2_fee = (this.formatNumber(qnt_1_fee, 2) * buy_2) * (1 - 0.002);

        Novadax.getOrderBook(`ETH_BTC`).then((data) => {
          // Retorno ao BTC
          let sell = data.data.data.buy[0][0];
          // Lucro
          let profit = this.formatNumber((qnt_2_fee * sell) * (1 - 0.002), 8);

          if (profit > this.entry) {
            console.log('Lucro')
          } else {
            console.log(symbol, profit)
          }
        });
      });
    });
  }

  marketUSDT(symbol, dividend, market) {
    Novadax.getOrderBook(`${dividend}_${market}`).then((data) => {
      let buy_1 = data.data.data.sell[0][0];
      
      // Primeira compra
      let qnt_1 = this.entry * 0.9980;
      let qnt_1_fee = qnt_1 / buy_1;

      Novadax.getOrderBook(`${dividend}_USDT`).then((data) => {
        let buy_2 = data.data.data.buy[0][0];
        let qnt_2_fee = (this.formatNumber(qnt_1_fee, 2) * buy_2) * (1 - 0.002);

        Novadax.getOrderBook(`BTC_USDT`).then((data) => {
          // Retorno ao BTC
          let buy_3 = data.data.data.sell[0][0];
          // Lucro
          let q = qnt_2_fee * 0.9980
          let profit = q / buy_3

          if (profit > this.entry) {
            console.log('Lucro')
          } else {
            console.log(symbol, profit)
          }
        });
      });
    });
  }

  setup() {
    if (this.count >= Coins.length) this.count = 0;

    let { symbol, dividend, market } = Coins[this.count];

    this.marketUSDT(symbol, dividend, market)

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
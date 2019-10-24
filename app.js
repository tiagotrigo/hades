'use stricts';

const R = require('ramda');
const sprintf = require('sprintf-js').sprintf;
const Coins = require('./coins.js');
const Novadax = require('./novadax.js');
const Exc = require('./exc.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.fee_nvx = 0.9980,
    this.fee_exc = 0.9975,
    this.entry = 0.0015,
    this.withdraw_exc = 0.00050000,
    this.withdraw_nvx = 0.00200000
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

  market(symbol, dividend) {
    // BTC
    Exc.getBalance('BTC').then((data) => {      
      const saldoExcBTC = this.entry + this.withdraw_exc;
      // BTC - ETH
      Novadax.getOrderBook(`${dividend}_BTC`).then((data) => {
        const qntAskETH = (saldoExcBTC - this.withdraw_exc) * 0.9980;
        const qntAskFeeETH = qntAskETH / data.data.data.sell[0][0];

        // ? - ETH
        Novadax.getOrderBook(`${dividend}_ETH`).then((data) => {
          const qnt = this.formatNumber(qntAskFeeETH, 8) * 0.9980;
          const qntFee = qnt * data.data.data.sell[0][0];

          // ETH - BTC
          Exc.getOrderBook('ETH_BTC', 'ALL', 3).then((book) => {
            const qntBid = (qntFee * book.data.result.buy[0].Rate) * (1 - 0.0025);
            const qntBidFee = this.formatNumber(qntBid, 8) + 0.00050000;

            const profit = ((qntBidFee - saldoExcBTC) / saldoExcBTC) * 100;

            if (qntBidFee > saldoExcBTC) {
              console.log('Lucro', qntBidFee)
            } else {
              console.log(`[${dividend}]:`, this.formatNumber(qntBidFee, 8), '('+this.formatNumber(profit, 2)+'%)')
            }
          });
        });
      });
    });
  }

  setup() {
    if (this.count >= Coins.length) this.count = 0;

    let { symbol, dividend, market } = Coins[this.count];

    this.market(symbol, dividend)

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
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

  marketBTC(symbol, dividend, market) {
    // BTC - ETH
    Novadax.getOrderBook('ETH_BTC').then((data) => {
      let buy_1 = data.data.data.sell[0][0];
      
      let qnt_1 = this.entry * 0.9980;
      let qnt_1_fee = qnt_1 / buy_1;

      // ETH - MOEDA
      Novadax.getOrderBook(`${dividend}_ETH`).then((data) => {
        let buy_2 = data.data.data.sell[0][0];
        
        let qnt_2 = qnt_1_fee * 0.9980;
        let qnt_2_fee = qnt_2 / buy_2;

        // MOEDA - BTC
        Novadax.getOrderBook(`${dividend}_BTC`).then((data) => {
          
          let sell = data.data.data.buy[0][0];
          
          let profit = this.formatNumber((qnt_2_fee * sell) * (1 - 0.002), 8);

          if (profit > this.entry) {
            console.log('Lucro')
          } else {
            console.log(`[${symbol}]:`, profit);
          }
        });
      });
    });
  }

  marketUSDTtoBTC(symbol, dividend, market) {
    // BTC - USDT
    Novadax.getOrderBook('BTC_USDT').then((data) => {
      let buy_1 = data.data.data.sell[0][0];
      
      let qnt_1 = this.entry * 0.9980;
      let qnt_1_fee = qnt_1 * buy_1;

      // USDT - MOEDA
      Novadax.getOrderBook(`${dividend}_USDT`).then((data) => {
        let buy_2 = data.data.data.sell[0][0];
        
        let qnt_2 = qnt_1_fee * 0.9980;
        let qnt_2_fee = qnt_2 / buy_2;

        // MOEDA - BTC
        Novadax.getOrderBook(`${dividend}_BTC`).then((data) => {
          let sell = data.data.data.buy[0][0];
          
          let profit = this.formatNumber((qnt_2_fee * sell) * (1 - 0.002), 8);

          if (profit > this.entry) {
            console.log('Lucro')
          } else {
            console.log(`[${symbol}]:`, profit);
          }
        });
      });
    });
  }

  marketUSDTtoETH(symbol, dividend, market) {
    // BTC - USDT
    Novadax.getOrderBook('BTC_USDT').then((data) => {
      let buy_1 = data.data.data.sell[0][0];
      
      let qnt_1 = this.entry * 0.9980;
      let qnt_1_fee = qnt_1 * buy_1;

      // USDT - MOEDA
      Novadax.getOrderBook(`ETH_USDT`).then((data) => {
        let buy_2 = data.data.data.sell[0][0];
        
        let qnt_2 = qnt_1_fee * 0.9980;
        let qnt_2_fee = qnt_2 / buy_2;

        // MOEDA - ETH
        Novadax.getOrderBook(`${dividend}_ETH`).then((data) => {
          let buy_3 = data.data.data.sell[0][0];
          
          let qnt_3 = qnt_2_fee * 0.9980;
          let qnt_3_fee = qnt_3 / buy_3;
          
          Novadax.getOrderBook(`${dividend}_BTC`).then((data) => {
            let sell = data.data.data.buy[0][0];
            let profit = this.formatNumber((qnt_3_fee * sell) * (1 - 0.002), 8);

            if (profit > this.entry) {
              console.log('Lucro')
            } else {
              console.log(`[${symbol}]:`, profit);
            }
          });
        });
      });
    });
  }

  marketTESTE(symbol, dividend) {
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

    this.marketTESTE(symbol, dividend)

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
'use stricts';

const R = require('ramda');
const await = require('await');
const colors = require('colors/safe');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const sprintf = require("sprintf-js").sprintf;

class Hades {
  
  constructor() {
    this.brl = 25,
    this.rateBl = 0.0025,
    this.rateBt = 0.0040,
    this.usdt = 0.0,
    this.qnt_BRL = 0.0,
    this.qnt_BTC = 0.0,
    this.profit = 0.0,
    this.balance = 0.0
  }

  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  repeat(ms, func) {
    return new Promise((resolve) => (
      setInterval(func, ms), 
      this.wait(ms).then(resolve)
    ));
  }

  async main() {
    // Balance
    const BT_BRL = await Bitrecife.getBalance('BRL');
    const BL_USDT = await Bitrecife.getBalance('USDT');
    
    // Ticker
    const BL_BTC_USDT = await Bleutrade.getTicker('BTC_USDT');
    const BT_BTC_BRL = await Bitrecife.getTicker('BTC_BRL');

    // Book
    const BT_BOOK_USDT_BRL = await Bitrecife.getOrderBook('USDT_BRL', 'ALL', 5);

    // Buy  
    // Quantity BRL to USDT
    if (BT_BRL.data.result[0].Balance > this.brl) {
      this.brl++
      this.usdt = (BT_BRL.data.result[0].Balance / BT_BOOK_USDT_BRL.data.result.sell[0].Rate) * (1 - this.rateBt);

      // Ask
      // Quantity USDT to BTC(BL)
      this.qnt_BTC = (this.usdt / BL_BTC_USDT.data.result[0].Ask) * (1 - this.rateBl);

      // Bid
      // Quantity BTC to BRL(BT)
      this.qnt_BRL = (this.qnt_BTC * BT_BTC_BRL.data.result[0].Bid) * (1 - this.rateBt);

      // Profit to arbitration
      this.profit = ((this.qnt_BRL - BT_BRL.data.result[0].Balance) * 100) / this.qnt_BRL;  
      //
    } else if (BL_USDT.data.result[0].Balance > 0) {

    } else {}
      if (Math.sign(this.profit) === 1 && this.profit >= 0.01) {
        console.log('BRL:', colors.green(BT_BRL.data.result[0].Balance), 'PROFIT:', colors.yellow(this.profit));
      } else {
        console.log('BRL:', colors.green(BT_BRL.data.result[0].Balance), 'PROFIT:', colors.yellow(this.profit));
      }  
    }

  }

  async run() {
    this.repeat(
      5000, 
      () => Promise.all([
        this.main()
      ])
    );
  }
}

new Hades().run();
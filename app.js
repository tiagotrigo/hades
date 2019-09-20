'use stricts';

const R = require('ramda');
const await = require('await');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const sprintf = require("sprintf-js").sprintf;

class Hades {
  
  constructor() {
    this.rateBl = 0.0025,
    this.rateBt = 0.0040,
    this.usdt = 0,
    this.qnt_BRL = 0,
    this.qnt_BTC = 0
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

  qnt(amount, price) {
    return amount * price;
  }

  percent(price1, price2) {
    return ((price1 - price2) / price1) * 100;
  }

  async main() {
    // Balance
    const BT_USDT = await Bitrecife.getBalance('USDT');
    const BT_BRL = await Bitrecife.getBalance('BRL');
    const BL_BTC = await Bitrecife.getBalance('BTC');
    
    // Ticker
    const BL_BTC_USDT = await Bleutrade.getTicker('BTC_USDT');
    const BT_USDT_BRL = await Bitrecife.getTicker('USDT_BRL');
    const BT_BTC_BRL = await Bitrecife.getTicker('BTC_BRL');

    // Book
    const BL_BOOK_BTC_USDT = await Bleutrade.getOrderBook('BTC_USDT', 'ALL', 5);
    const BT_BOOK_USDT_BRL = await Bitrecife.getOrderBook('USDT_BRL', 'ALL', 5);
    const BT_BOOK_BTC_BRL = await Bitrecife.getOrderBook('BTC_BRL', 'ALL', 5);
      
    // Quantity BRL to USDT
    this.usdt = (BT_BRL.data.result[0].Balance / BT_BOOK_USDT_BRL.data.result.sell[0].Rate) * (1 - this.rateBt);
    
    // Ask
    // Quantity USDT to BTC(BL)
    this.qnt_BTC = (this.usdt / BL_BTC_USDT.data.result[0].Ask) * (1 - this.rateBl);

    // Bid
    // Quantity BTC to BRL(BT)
    this.qnt_BRL = (this.qnt_BTC * BT_BTC_BRL.data.result[0].Bid) * (1 - this.rateBt);

    // Profit to arbitration
    const profit = this.qnt_BRL - 25 
    
    if (profit > 1) {
      console.log('Arbitragem');
    } else {
      console.log(profit);
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
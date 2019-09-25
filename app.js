'use stricts';

const R = require('ramda');
const await = require('await');
const colors = require('colors/safe');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const sprintf = require("sprintf-js").sprintf;

class Hades {
  
  constructor() {
    this.entry = 25.00,
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
    const BT_USDT = await Bitrecife.getBalance('USDT');
    const BT_BTC = await Bitrecife.getBalance('BTC');
    
    const BL_BTC = await Bleutrade.getBalance('BTC');
    const BL_USDT = await Bleutrade.getBalance('USDT');
    
    // Ticker
    const BL_BTC_USDT = await Bleutrade.getTicker('BTC_USDT');
    const BT_BTC_BRL = await Bitrecife.getTicker('BTC_BRL');

    // Book
    const BT_BOOK_USDT_BRL = await Bitrecife.getOrderBook('USDT_BRL', 'ALL', 5);

    // Buy  
     // Quantity BRL to USDT
     if (parseInt(BT_BRL.data.result[0].Balance) > 0) {
       // Calcule BRL to USDT
       this.usdt = (this.entry / BT_BOOK_USDT_BRL.data.result.sell[0].Rate) * (1 - this.rateBt); 
       // Buy USDT
       await Bitrecife.setBuyLimit('USDT_BRL', BT_BOOK_USDT_BRL.data.result.sell[0].Rate, this.usdt, false);
       // Feedback
       console.log(`Trocando BRL por ${this.usdt} USDT`);
       //
     } else if (parseInt(BT_USDT.data.result[0].Balance) > 0) {
       // Direct Transfer Bitrecife to Bleutrade
       await Bitrecife.setDirectTransfer('USDT', BT_USDT.data.result[0].Balance, 1, 'tiago.a.trigo@gmail.com');
       // Feedback
       console.log(`Transferindo USDT para Bleutrade`);
     } else if (parseInt(BL_USDT.data.result[0].Balance) > 0) {
       // Ask
       // Quantity USDT to BTC(BL)
       this.qnt_BTC = (BL_USDT.data.result[0].Balance / BL_BTC_USDT.data.result[0].Ask) * (1 - this.rateBl);
       this.qnt_BTC_fee = parseFloat(sprintf('%.8f', this.qnt_BTC)) + 0.00000001;
       // Sell BTC
       await Bleutrade.setBuyLimit('BTC_USDT', BL_BTC_USDT.data.result[0].Ask, this.qnt_BTC_fee, false);
       //
       console.log('Trocando USDT por BTC');
     } else if (BL_BTC.data.result[0].Balance > 0.00001) {
       // Quantity to BRL
       this.qnt_BRL = (BL_BTC.data.result[0].Balance * BT_BTC_BRL.data.result[0].Bid) * (1 - this.rateBt);
       // Profit to arbitration
       this.profit = ((this.qnt_BRL - this.entry) * 100) / this.qnt_BRL;

       if (Math.sign(this.profit) === 1 && this.profit >= 0.01) {
           // Transfer BTC to Bitrecife
           await Bleutrade.setDirectTransfer('BTC', BL_BTC.data.result[0].Balance, 3, 'tiago.a.trigo@gmail.com');
           // Buy BTC to BRL
           await Bitrecife.setBuyLimit('BTC_BRL', BT_BTC_BRL.data.result[0].Bid, BT_BTC.data.result[0].Balance * (1 - this.rateBt), false);
           //
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
'use stricts';

const R = require('ramda');
const Telegram = require('../telegram.js');
const Exc = require('../exc.js');
const Bitrecife = require('../bitrecife.js');
const Bleutrade = require('../bleutrade.js');

class Hades {
  
  constructor() {
    this.min = 0.0002,
    this.email = 'tiago.a.trigo@gmail.com'
  }

  async updateRate(exc, market, quantity, type) {
    let sum = 0;
    let price = 0;
    // Verificando o livro de ofertas
    let book = await exc.getOrderBook(market, 'ALL', 3);
    // Verificando a ação 
    let orders = (type === 'buy') ? book.sell : book.buy;

    for (let [i, order] of orders.entries()) {
      sum = sum + order.Quantity;
      if (quantity <= sum) {
        price = order.Rate;
        break;
      }
    }
    return price;
  }

  mask(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  // Buy
  calcBuy(amount, rate, fee) {
    const calc = (amount * fee) / rate;
    return calc;
  }

  // Sell
  calcSell(amount, rate, fee) {
    const calc = (amount * rate) * (1 - fee);
    return calc;
  }

  // BTC_BRL_NBC_BTC
  async run() {
    do {
      try {
        // Bitrecife
        // Vendendo BTC por BRL
        let ex1BookSell = await Bitrecife.getOrderBook('BTC_BRL', 'ALL', 3);
        let ex1CalcSellQnt = this.calcSell(this.min, ex1BookSell.buy[0].Rate, 0.0024);
        let ex1CalcSellSum = await this.updateRate(Bitrecife, 'BTC_BRL', this.min, 'sell');
        // Comprando BRL por NBC
        let ex2BookBuy = await Bitrecife.getOrderBook('NBC_BRL', 'ALL', 3);
        let ex2CalcBuyQnt = this.calcBuy(ex1CalcSellQnt, ex2BookBuy.sell[0].Rate, 0.9976);
        let ex2CalcBuySum = await this.updateRate(Bitrecife, 'NBC_BRL', ex2CalcBuyQnt, 'buy');
        // Bleutrade
        // Vendendo NBC por BTC
        let ex3BookSell = await Bleutrade.getOrderBook('NBC_BTC', 'ALL', 3);
        let ex3CalcSellQnt = this.calcSell(ex2CalcBuyQnt, ex3BookSell.buy[0].Rate, 0.0015);
        let ex3CalcSellSum = await this.updateRate(Bleutrade, 'NBC_BTC', ex3CalcSellQnt, 'sell');

        if (this.mask(ex3CalcSellQnt, 8) > this.min) {
          // Enviando BTC para Bitrecife
          await Bleutrade.setDirectTransfer('BTC', this.min, 3, this.email);
          console.log('Enviando BTC para Bitrecife');
          // Troca de BTC por BRL
          await Bitrecife.setSellLimit('BTC_BRL', ex1CalcSellSum, this.min);
          console.log('Troca de BTC por BRL');
          // Troca de BRL por NBC
          await Bitrecife.setBuyLimit('NBC_BRL', ex2CalcBuySum, ex2CalcBuyQnt);
          console.log('Troca de BRL por NBC');

          let b1 = await Bitrecife.getBalance('NBC');

          await Bitrecife.setDirectTransfer('NBC', b1.data.result[0].Available, 1, this.email);
          console.log('Enviando NBC para Bleutrade');

          let b2 = await Bleutrade.getBalance('NBC');
          let b2Calc = await this.updateRate(Bleutrade, 'NBC_BTC', b2.data.result[0].Available, 'sell');

          await Bleutrade.setSellLimit('NBC_BTC', b2Calc, b2.data.result[0].Available);
          console.log('Troca de NBC por BTC');

          await Telegram.sendMessage(`[NBC]: ${ex3CalcSellQnt}`);
        } else {
          console.log('[NBC] =>', this.mask(ex3CalcSellQnt, 8));
        }
      } catch(e) {
        console.log('Ooops!');
      }
    } while (true)
  }
}

new Hades().run();
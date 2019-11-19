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

  // BTC_ETH_NBC_BTC
  async run() {
    do {
      try {
        // Bleutrade
        // Vendendo BTC por ETH
        let ex1BookBuy = await Bleutrade.getOrderBook('ETH_BTC', 'ALL', 3);
        let ex1CalcBuyQnt = this.calcBuy(this.min, ex1BookBuy.sell[0].Rate, 0.9985);
        let ex1CalcBuySum = await this.updateRate(Bleutrade, 'ETH_BTC', ex1CalcBuyQnt, 'buy');
        // Comprando ETH por NBC
        let ex2BookBuy = await Bleutrade.getOrderBook('NBC_ETH', 'ALL', 3);
        let ex2CalcBuyQnt = this.calcBuy(ex1CalcBuyQnt, ex2BookBuy.sell[0].Rate, 0.9985);
        let ex2CalcBuySum = await this.updateRate(Bleutrade, 'NBC_ETH', ex2CalcBuyQnt, 'buy');
        // Bleutrade
        // Vendendo NBC por BTC
        let ex3BookSell = await Bleutrade.getOrderBook('NBC_BTC', 'ALL', 3);
        let ex3CalcSellQnt = this.calcSell(ex2CalcBuyQnt, ex3BookSell.buy[0].Rate, 0.0015);
        let ex3CalcSellSum = await this.updateRate(Bleutrade, 'NBC_BTC', ex3CalcSellQnt, 'sell');

        if (this.mask(ex3CalcSellQnt, 8) > this.min) {
          //   // Troca de BTC por ETH
          await Bleutrade.setBuyLimit('ETH_BTC', ex1CalcBuySum, ex1CalcBuyQnt);
          console.log('Troca de BTC por ETH');
          // Troca de ETH por NBC
          await Bleutrade.setBuyLimit('NBC_ETH', ex2CalcBuySum, ex2CalcBuyQnt);
          console.log('Troca de ETH por NBC');
          // Troca de NBC por BTC
          let b1 = await Bleutrade.getBalance('NBC');
          let b1Calc = await this.updateRate(Bleutrade, 'NBC_BTC', b1.data.result[0].Available, 'sell');

          await Bleutrade.setSellLimit('NBC_BTC', b1Calc, b1.data.result[0].Available);
          console.log('Troca de ETH por NBC');          

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
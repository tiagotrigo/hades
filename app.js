'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Coins = require('./coins.js');
const Bleutrade = require('./bleutrade.js');
const Telegram = require('./telegram.js');

class Hades {
  
  constructor() {
    this.min = 0.0002,
    this.mail = 'tiago.a.trigo@gmail.com'
  }

  async updateRate(exchange, market, quantity, type) {
    let sum = 0;
    let price = 0;
    // Verificando o livro de ofertas
    let book = await exchange.getOrderBook(market, 'ALL', 3);
    // Verificando a ação 
    let orders = type === 'buy' ? book.sell : book.buy;

    for (let [i, order] of orders.entries()) {
      sum = sum + order.Quantity
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
    const tax = amount * fee;
    const qnt = tax / rate;

    return this.mask(qnt, 8);
  }

  // Sell
  calcSell(amount, rate, fee) {
    const tax = (amount * rate) * (1 - fee);
    return this.mask(tax, 8);
  }

  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async run() {
    do {
      for (let coin of Coins) {
        const {
          symbol,
          divisor,
          dividend,
          entry
        } = coin;

        try {
          // Exccripto
          let exc = await Exc.getOrderBook(symbol, 'SELL', 3);
          let excCalcQnt = this.calcBuy(entry, exc.sell[0].Rate, 0.9975);
          let excCalcSum = await this.updateRate(Exc, symbol, excCalcQnt, 'buy');
          // Bleutrade
          let bleu = await Bleutrade.getOrderBook(symbol, 'BUY', 3);
          let bleuCalcQnt = this.calcSell(excCalcQnt, bleu.buy[0].Rate, 0.0015);
          // Lucro
          if (bleuCalcQnt > (divisor === 'USDT' ? entry : 0.00020009)) {
            await Exc.setBuyLimit(symbol, excCalcSum, excCalcQnt);
            console.log(`Troca de ${divisor} por ${dividend}`);
                              
            await Exc.setDirectTransfer(dividend, excCalcQnt, 1, 'tiago.a.trigo@gmail.com');
            console.log(`Enviando ${dividend} para Bleutrade`);

            let balance_dividend = await Bleutrade.getBalance(dividend);
            let bleuCalcSum = await this.updateRate(Bleutrade, symbol, balance_dividend.data.result[0].Available, 'sell');
            
            await Bleutrade.setSellLimit(symbol, bleuCalcSum, balance_dividend.data.result[0].Available);
            console.log(`Troca de ${dividend} por ${divisor}`);

            let balance_divisor = await Bleutrade.getBalance(divisor);
            
            await Bleutrade.setDirectTransfer(divisor, balance_divisor.data.result[0].Available, 2, 'tiago.a.trigo@gmail.com');
            console.log(`Enviando ${divisor} para Exccripto`); 

            await Telegram.sendMessage(`[${symbol}]: ${bleuCalcQnt}`);
          } else {
            console.log(`[Exccripto - ${symbol}]:`, bleuCalcQnt);
          }
        } catch(e) {
          console.log('Ooops!');
        }
      }
    } while (true)
  }
}

new Hades().run();
'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Coins = require('./coins.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const Telegram = require('./telegram');

class Hades {
  
  constructor() {
    this.min = 0.0002,
    this.mail = 'tiago.a.trigo@gmail.com'
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

  mask(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  calcSum(amount, book, type) {
    let i = 0;
    let sum = 0;
    let orders = R.map((n) => this.mask(n.Quantity * n.Rate, 8), type === 'buy' ? book.sell : book.buy);
    let ordersSum = R.map((item) => {
      i++;
      sum = sum + item;
      return {
        id: i - 1,
        rate: type === 'buy' ? book.sell[i - 1].Rate : book.buy[i - 1].Rate,
        quantity: item
      }
    }, orders);

    return R.filter((n) => n.quantity >= amount, ordersSum);
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

  async run() {
    do {
      try {
        for (let coin of Coins) {
          const {
            symbol,
            divisor,
            dividend
          } = coin;

          try {
            // Exccripto
            let exc = await Exc.getOrderBook(symbol, 'ALL', 5);
            let excCalcSum = this.calcSum(this.min, exc, 'buy');
            let excCalcQnt = this.calcBuy(this.min, exc.sell[0].Rate, 0.9975);
            let excOrderOpen = await Exc.getOpenOrders(symbol);
            // Bleutrade
            let bleu = await Bleutrade.getOrderBook(symbol, 'ALL', 5);
            let bleuCalcSum = this.calcSum(excCalcQnt, bleu, 'sell');
            let bleuCalcQnt = this.calcSell(excCalcQnt, bleu.buy[0].Rate, 0.0015);
            let bleuOrderOpen = await Bleutrade.getOpenOrders(symbol);
            // Lucro
            if (bleuCalcQnt > this.min) {
              if (
                bleuOrderOpen.data.result === null && 
                excOrderOpen.data.result === null
              ) {
                console.log(' ');

                try {
                  await Exc.setBuyLimit(symbol, excCalcSum[0].rate, excCalcQnt);
                  console.log(`Troca de ${divisor} por ${dividend}`);
                                    
                  await Exc.setDirectTransfer(dividend, excCalcQnt, 1, 'tiago.a.trigo@gmail.com');
                  console.log(`Enviando ${dividend} para Bleutrade`);
                  
                  await Bleutrade.setSellLimit(symbol, bleuCalcSum[0].rate, excCalcQnt);
                  console.log(`Troca de ${dividend} por ${divisor}`);
                  
                  await Bleutrade.setDirectTransfer(divisor, bleuCalcQnt, 2, 'tiago.a.trigo@gmail.com');
                  console.log(`Enviando ${divisor} para Exccripto`); 

                  await Telegram.sendMessage(`[${symbol}]: ${bleuCalcQnt}`);
                } catch(e) {
                  console.log('>> Ooops!');
                }

                console.log(' ');
              } else {
                console.log(`[Exccripto - ${symbol}]: Ordem aberta`);
              }        
            } else {
              console.log(`[Exccripto - ${symbol}]:`, bleuCalcQnt);
            }
          } catch(e) {
            console.log('Ooops!');
          }
        }
      } catch(e) {
        console.log('Ooops!');
      }
    } while (true)
  }
}

new Hades().run();
'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const coins = require('./coins.js');
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

  async updateRate(exchange, coin, side, quantity) {
    // Preço
    let price = 0;
    // Verificando o livro de ofertas
    let book = await exchange.getOrderBook(coin.market, side === 'buy' ? 'SELL' : 'BUY', 5);
    // Verificando a ação 
    let order = walk.action === 'buy' ? book.sell : book.buy;

    if (quantity > order[0].Quantity) {
      price = order[1].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity)) {
      price = order[2].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity)) {
      price = order[3].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity + order[3].Quantity)) {
      price = order[4].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity + order[3].Quantity + order[4].Quantity)) {
      price = order[5].Rate;
    } else {
      price = order[0].Rate;
    }

    return price;
  }

  // Buy
  calcBuy(amount, rate) {
    const qnt = amount / rate;

    return this.mask(qnt, 8);
  }

  // Sell
  calcSell(amount, rate, fee) {
    const qnt = (amount * rate);
    return this.mask(qnt, 8);
  }

  async run() {
    do {
      try {
        for (let coin of coins) {
          const {
            market,
            divisor,
            dividend
          } = coin;

          let exc = await Exc.getOrderBook(market, 'SELL', 3);
          let rateExc = ((exc.sell[0].Rate * 100000000) - 1) / 100000000;
          let qntExc = this.calcBuy(0.0002, rateExc);
          // Bleu
          let bleu = await Bleutrade.getOrderBook(market, 'BUY', 3);
          let rateBleu = ((bleu.buy[0].Rate * 100000000) - 1) / 100000000
          let qntBleu = this.calcSell(qntExc, rateBleu);

          if (qntBleu > 0.0002) {
            await Exc.setBuyAmi(market, rateExc, qntExc);
            console.log(`Troca de ${divisor} por ${dividend}`);

            process.exit()
            // let order = await Exc.getOpenOrders(market);

            // if (order.data.result === null) {
            //   await Exc.setDirectTransfer(dividend, qntExc, 1, 'tiago.a.trigo@gmail.com');
            //   console.log(`Enviando ${dividend} para Bleutrade`);

            //   await Bleutrade.setSellAmi(market, rateBleu, qntExc);
            //   console.log(`Troca de ${dividend} por ${divisor}`);

            //   await Bleutrade.setDirectTransfer(divisor, qntBleu, 2, 'tiago.a.trigo@gmail.com');
            //   console.log(`Enviando ${divisor} para Exccripto`);
            // } else {
            //   console.log('AMI de venda aberta');
            // }
          } else {
            console.log(`[${market}]`, qntBleu);
          }
        }
      } catch(e) {
        console.log('>> Ooops!');
      }
    } while (true)
  }
}

new Hades().run();
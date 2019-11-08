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

          // let exc = await Exc.getOrderBook(market, 'SELL', 3);
          
          // let rateExc = ((exc.sell[0].Rate * 100000000) - 1) / 100000000;
          // let amirateExc = ((exc.sell[0].Rate * 100000000) + 3) / 100000000;

          // let qntExc = this.calcBuy(0.0002, rateExc);

          // Exc (Compra)
          let exc   = await Exc.getOrderBook(market, 'ALL', 3);
          let rateE = ((exc.buy[0].Rate * 100000000) + 1) / 100000000;
          let amiE  = ((exc.sell[0].Rate * 100000000) + 1) / 100000000;
          let qntE  = this.calcBuy(0.0002, amiE);

          // Bleu (Venda)
          // let bleu = await Bleutrade.getOrderBook(market, 'ALL', 1);
          // let rateB = ((bleu.sell[0].Rate * 100000000) - 1) / 100000000;
          // let amiB = ((bleu.buy[0].Rate * 100000000) + 1) / 100000000;
          // let qntB = this.calcSell(0.0004, amiB);

          // console.log(rateE, amiE, qntE)
          await Exc.setBuyAmi(market, rateE, amiE, qntE);
          process.exit()
          // console.log(`Troca de ${divisor} por ${dividend}`);
        }
      } catch(e) {
        console.log(e);
      }
    } while (true)
  }
}

new Hades().run();
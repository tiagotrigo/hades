'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const coins = require('./coins.js');
const Telegram = require('./telegram');

class Hades {
  
  constructor() {
    this.min = 150,
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
    let book = await exchange.getOrderBook(coin.market, side === 'buy' ? 'SELL' : 'BUY', 6);
    // Verificando a ação 
    let order = walk.action === 'buy' ? book.sell : book.buy;

    if (quantity > order[0].Quantity) {
      price = order[1].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity)) {
      price = order[3].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity)) {
      price = order[4].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity + order[3].Quantity)) {
      price = order[5].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity + order[3].Quantity + order[4].Quantity)) {
      price = order[6].Rate;
    } else {
      price = order[0].Rate;
    }

    return price;
  }

  // Buy
  calcBuy(amount, rate) {
    const qnt = amount / rate;

    return qnt;
  }

  // Sell
  calcSell(amount, rate, fee) {
    const qnt = (amount * rate);

    return qnt;
  }

  async exchangeCompra(exchange, entry, market) {
    let ex   = await exchange.getOrderBook(market, 'ALL', 3);
    let rate = ex.buy[0].Rate + 1;
    let ami  = ex.sell[0].Rate + 1;
    let qnt  = this.calcBuy(entry, ami);

    return {
      rate,
      ami,
      qnt
    }
  }

  async exchangeVenda(exchange, entry, market) {
    let ex   = await exchange.getOrderBook(market, 'ALL', 3);
    let rate = ex.sell[0].Rate - 1
    let ami  = ex.buy[0].Rate + 1;
    let qnt  = this.calcSell(entry, ami);

    return {
      rate,
      ami,
      qnt
    }
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

          let compra = await this.exchangeCompra(Bitrecife, this.min, market);
          let venda  = await this.exchangeVenda(Bitrecife, compra.qnt, market);

          if (venda.qnt > this.min) {
            console.log(market, venda.qnt, 'ok')
            console.log(' ');
          } else {
            console.log(market, venda.qnt)
          }
        }
      } catch(e) {
        console.log(e);
      }
    } while (true)
  }
}

new Hades().run();
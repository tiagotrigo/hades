'use stricts';

const R = require('ramda');
const Bleutrade = require('./bleutrade');
const Telegram = require('./telegram');

class Hades {
  
  constructor() {
    this.min = 0.02,
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

  // Buy
  calcBuy(amount, rate, fee) {   
    const qnt = (amount * fee) / rate;

    return this.mask(qnt, 8);
  }

  // Sell
  calcSell(amount, rate, fee) {
    const qnt = (amount * rate) * (1 - fee);

    return this.mask(qnt, 8);
  }

  async calcUpdateRate(exchange, market, quantity, type) {
    let sum = 0;
    let price = 0;

    // Livro de ofertas
    let book = await exchange.getOrderBook(market, 'ALL', 3);
    // Verificando a ação 
    let orders = type === 'buy' ? book.sell : book.buy;

    for (let order of orders) {
      sum = sum + order.Quantity;
      if (quantity <= sum) {
        price = order.Rate;
        break;
      }
    }

    return price;
  }

  async run() {
    do {
      try {
        let orderA = await Bleutrade.getOrderBook('NBC_BTC', 'ALL', 3);
        let qntA = this.calcBuy(0.0002, orderA.sell[0].Rate, 0.9985);
        let sumA = await this.calcUpdateRate(Bleutrade, 'NBC_BTC', qntA, 'buy');

        let orderB = await Bleutrade.getOrderBook('NBC_USDT', 'ALL', 3);
        let qntB = this.calcSell(qntA, orderB.buy[0].Rate, 0.0015);

        let orderC = await Bleutrade.getOrderBook('BTC_USDT', 'ALL', 3);
        let qntC = this.calcBuy(qntB, orderC.sell[0].Rate, 0.9985);
        let sumC = await this.calcUpdateRate(Bleutrade, 'BTC_USDT', qntC, 'buy');

        if (this.mask(qntC, 8) > 0.0002) {
          await Bleutrade.setBuyLimit('NBC_BTC', sumA, qntA);
          console.log('Trocando BTC por NBC');

          let walletA = await Bleutrade.getBalance('NBC');
          let updateA = await this.calcUpdateRate(Bleutrade, 'NBC_USDT', walletA.data.result[0].Available, 'sell');

          await Bleutrade.setSellLimit('NBC_USDT', updateA, walletA.data.result[0].Available);
          console.log('Trocando NBC por USDT');

          let walletB = await Bleutrade.getBalance('USDT');
          let calcB = this.calcBuy(walletB.data.result[0].Available, orderC.sell[0].Rate, 0.9985);
          let updateB = await this.calcUpdateRate(Bleutrade, 'BTC_USDT', calcB, 'buy');

          await Bleutrade.setBuyLimit('BTC_USDT', updateB, calcB);
          console.log('Trocando USDT por BTC');

          await Telegram.sendMessage(`[BTC_NBC_USDT_BTC]: ${this.mask(qntC, 8)}`);
          console.log('Notificando @tiagotrigo');

          await this.wait(1000)          
        } else {
          console.log(this.mask(qntC, 8));
        }
      } catch(e) {
        console.log(e);
      }
    } while (true)
  }
}

new Hades().run();
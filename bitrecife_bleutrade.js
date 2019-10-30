'use stricts';

const R = require('ramda');
const await = require('await');
const Arbitration = require('./arbitration');

class Hades {
  
  constructor() {
    this.count = 0,
    this.email = 'tiago.a.trigo@gmail.com'
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

  formatNumber(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  calcQntSum(entry, book, type) {
    let i = 0;
    let sum = 0;
    let orders = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), type === 'buy' ? book.sell : book.buy);
    let ordersSum = R.map((item) => {
      i++;
      sum = sum + item;
      return {
        id: i - 1,
        rate: type === 'buy' ? book.sell[i - 1].Rate : book.buy[i - 1].Rate,
        quantity: item,
        sum: this.formatNumber(sum, 8)
      }
    }, orders);

    return R.filter((n) => n.sum >= entry, ordersSum);
  }

  calcQntBuy(entry, rate, fee) {
    let f = entry * fee;
    let profit = this.formatNumber(f, 8) / rate;

    return this.formatNumber(profit, 8);
  }

  calcQntSell(entry, rate, fee) {
    return this.formatNumber((entry * rate) * (1 - fee), 8);
  }

  calcDistributingValue(exchange, book, walk, index) {
    let qnt = 0.0;
    let order = [];

    if (index === 0) {
      if (walk.action === 'sell') {
        order = this.calcQntSum(exchange.entry, book, 'sell');
        qnt = this.calcQntSell(exchange.entry, order[0].rate, walk.fee);
      } else {
        order = this.calcQntSum(exchange.entry, book, 'buy');
        qnt = this.calcQntBuy(exchange.entry, order[0].rate, walk.fee);
      }
    } else if (index === 1) {
      if (walk.action === 'sell') {
        order = this.calcQntSum(exchange.walks[0].quantity, book, 'sell');
        qnt = this.calcQntSell(exchange.walks[0].quantity, order[0].rate, walk.fee);
      } else {
        order = this.calcQntSum(exchange.walks[0].quantity, book, 'buy');
        qnt = this.calcQntBuy(exchange.walks[0].quantity, order[0].rate, walk.fee);
      }
    } else if (index === 2) {
      if (walk.action === 'sell') {
        order = this.calcQntSum(exchange.walks[1].quantity, book, 'sell');
        qnt = this.calcQntSell(exchange.walks[1].quantity, order[0].rate, walk.fee);
      } else {
        order = this.calcQntSum(exchange.walks[1].quantity, book, 'buy');
        qnt = this.calcQntBuy(exchange.walks[1].quantity, order[0].rate, walk.fee);
      }
    }

    if (order && qnt) {
      return {
        price: order[0].rate,
        quantity: qnt
      }
    } else {
      console.log('Erro na distribuição de quantidade e preço');
      process.exit();
    }
  }

  async main() {
    for (let [x, exchange] of Arbitration.entries()) {
      for (let [y, walk] of exchange.walks.entries()) {
        let book = await walk.exchange.getOrderBook(walk.market);
        if (book) {
          let resp = this.calcDistributingValue(exchange, book, walk, y);
          // Atualizando preço e quantidade
          walk.price = resp.price;
          walk.quantity = resp.quantity;
        } else {
          console.log('Erro para carregar o livro de oferta(s)');
          process.exit();
        }
      }
      if (exchange.walks[exchange.walks.length - 1].quantity > exchange.entry) {
        console.log(`[${exchange.name}]:`, exchange.walks[exchange.walks.length - 1].quantity, 'OK');
      } else {
        console.log(`[${exchange.name}]:`, exchange.walks[exchange.walks.length - 1].quantity);
      }
    }
  }

  run() {
    this.repeat(5000, 
      () => Promise.all([
        this.main()
      ])
    )
  }
}

new Hades().run();
'use stricts';

const R = require('ramda');
const await = require('await');
const Arb = require('./arbitration');

class Hades {
  
  constructor() {
    this.i = 0,
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
        order = book.buy[0].Rate;
        qnt = this.calcQntSell(exchange.entry, order, walk.fee);
      } else {
        order = book.sell[0].Rate;
        qnt = this.calcQntBuy(exchange.entry, order, walk.fee);
      }
    } else if (index === 1) {
      if (walk.action === 'sell') {
        order = book.buy[0].Rate;
        qnt = this.calcQntSell(exchange.walks[0].quantity, order, walk.fee);
      } else {
        order = book.sell[0].Rate;
        qnt = this.calcQntBuy(exchange.walks[0].quantity, order, walk.fee);
      }
    } else if (index === 2) {
      if (walk.action === 'sell') {
        order = book.buy[0].Rate;
        qnt = this.calcQntSell(exchange.walks[1].quantity, order, walk.fee);
      } else {
        order = book.sell[0].Rate;
        qnt = this.calcQntBuy(exchange.walks[1].quantity, order, walk.fee);
      }
    } else if (index === 3) {
      if (walk.action === 'sell') {
        order = book.buy[0].Rate;
        qnt = this.calcQntSell(exchange.walks[2].quantity, order, walk.fee);
      } else {
        order = book.sell[0].Rate;
        qnt = this.calcQntBuy(exchange.walks[2].quantity, order, walk.fee);
      }
    }

    if (order && qnt) {
      return {
        price: order,
        quantity: qnt
      }
    } else {
      console.log('Erro na distribuição de quantidade e preço');
      process.exit();
    }
  }

  async main() {
    if (this.i >= Arb.length) {
      this.i = 0;
    }

    for (let [y, walk] of Arb[this.i].walks.entries()) {
      let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 3);
      if (book) {
        let resp = this.calcDistributingValue(Arb[this.i], book, walk, y);
        // Atualizando o preço
        walk.price = resp.price;
        // Atualizando a quantidade
        walk.quantity = resp.quantity;
      } else {
        console.log('Erro para carregar o livro de oferta(s)');
        process.exit();
      }
    }

    const {
      name,
      entry,
      walks,
      quantity
    } = Arb[this.i];   

    if (walks[walks.length - 1].quantity > entry) {
      //
      console.log('>>', walks[walks.length - 1].market, walks[walks.length - 1].quantity, 'OK')
      for (let [z, walk] of walks.entries()) {
        // Compra ou venda
        if (walk.action === 'sell') {
          let sell = await walk.exchange.setSellLimit(walk.market, walk.price, walk.quantity, false);
          if (sell) {
            console.log(`Troca de ${dividend} por ${divisor}`);
            // Transferência direta
            if (walk.go != 0) {
              let transfer = await walk.exchange.setDirectTransfer(walk.divisor, walk.quantity, walk.go, this.email);
              if (transfer) {
                console.log(`Enviando ${walk.divisor} para ${walk.go}`);
              } else {
                console.log(`Erro ao tentar enviar para exchange ${walk.go}`);
                process.exit();
              }
            }
          } else {
            console.log(`Erro ao realizar uma venda na moeda ${walk.market}`);
            process.exit();
          }
        } else {
          let buy = await walk.exchange.setBuyLimit(walk.market, walk.price, walk.quantity, false);
          if (buy) {
            console.log(`Troca de ${divisor} por ${dividend}`);
            // Transferência direta
            if (walk.go != 0) {
              let transfer = await walk.exchange.setDirectTransfer(walk.dividend, walk.quantity, walk.go, this.email);
              if (transfer) {
                console.log(`Enviando ${walk.dividend} para ${walk.go}`);
              } else {
                console.log(`Erro ao tentar enviar para exchange ${walk.go}`);
                process.exit();
              }
            }
          } else {
            console.log(`Erro ao realizar uma compra na moeda ${walk.market}`);
            process.exit();
          }
        }
      }
    } else {
      console.log(`[${name}]:`, walks[walks.length - 1].quantity);
    }

    this.i += 1;
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
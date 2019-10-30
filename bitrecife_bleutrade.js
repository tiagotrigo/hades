'use stricts';

const R = require('ramda');
const await = require('await');
const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
// const Arbitration = require('./arbitration');

class Hades {
  
  constructor() {
    this.count = 0,
    this.email = 'tiago.a.trigo@gmail.com'
  }

  atraso(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  repetir(ms, func) {
    return new Promise((resolve) => (
      setInterval(func, ms), 
      this.atraso(ms).then(resolve)
    ));
  }

  formatNumber(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  t() {
    Bleutrade.getOrderBook('BTC_USDT', 'ALL', 15).then((data) => {
      const ordersSellBleutrade = this.sum(this.entry, data, 'sell');
      const qntSellBleutrade = this.formatNumber((this.entry * ordersSellBleutrade[0].rate) * (1 - 0.0025), 8);
      // Venda
      Bitrecife.getOrderBook('USDT_BRL', 'ALL', 15).then((data) => {
        const ordersSellBitrecife = this.sum(qntSellBleutrade, data, 'sell');
        const qntSellBitrecife = this.formatNumber((qntSellBleutrade * ordersSellBitrecife[0].rate) * (1 - 0.0024), 8);
        // Compra
        Bitrecife.getOrderBook('BTC_BRL', 'ALL', 15).then((data) => {
          const ordersBuyBitrecife = this.sum(qntSellBitrecife, data, 'buy');

          const qntBidFee = qntSellBitrecife * 0.9976;
          const qntBidProfit = this.formatNumber(qntBidFee, 8) / ordersBuyBitrecife[0].rate;
          const qntBuyBitrecife = this.formatNumber(qntBidProfit, 8);
          
          if (qntBuyBitrecife > this.entry) {
            Bleutrade.getOpenOrders('BTC_USDT').then((data) => {
              if (data.data.result === null) {
                // Venda
                Bleutrade.setSellLimit('BTC_USDT', ordersSellBleutrade[0].rate, qntSellBleutrade, false).then((data) => {
                  console.log('Troca de BTC por USDT');
                  setTimeout(() => {
                    // Transferir
                    Bleutrade.setDirectTransfer('USDT', qntSellBleutrade, 3, this.email).then((data) => {
                      console.log('Enviando USDT para Bitrecife');
                      // Venda
                      Bitrecife.setSellLimit('USDT_BRL', ordersSellBitrecife[0].Rate, qntSellBitrecife, false).then((data) => {
                        console.log('Troca de USDT por BRL');
                        // Compra
                        Bitrecife.setBuyLimit('BTC_BRL', ordersBuyBitrecife[0].rate, qntBuyBitrecife, false).then((data) => {
                          console.log('Troca de BRL por BTC');  
                          //Transferir Bitrecife para Bleutrade
                          Bitrecife.setDirectTransfer('BTC', qntBuyBitrecife, 1, this.email).then((data) => {
                            console.log('Enviando BTC para Bleutrade');
                            process.exit();
                          });
                        });  
                      });
                    });
                  }, 400);
                })
              } else {
                console.log('Moeda BTC_USDT está com ordem aberta');
                console.log(' ');
              }
            });
          } else {
            console.log('[BTC_USDT]:', this.formatNumber(qntBuyBitrecife, 8))
          }
        });
      });
    });
  }

  qntSum(entry, book, type) {
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

  qntBuy(entry, rate, fee) {
    let f = entry * fee;
    let profit = this.formatNumber(f, 8) / rate;

    return this.formatNumber(profit, 8);
  }

  qntSell(entry, rate, fee) {
    return this.formatNumber((entry * rate) * (1 - fee), 8);
  }

  calcDistributingValue(exchange, book, walk, index) {
    let qnt = 0.0;
    let order = [];

    if (index === 0) {
      if (walk.action === 'sell') {
        order = this.qntSum(exchange.entry, book, 'sell');
        qnt = this.qntSell(exchange.entry, order[0].rate, walk.fee);
      } else {
        order = this.qntSum(exchange.entry, book, 'buy');
        qnt = this.qntBuy(exchange.entry, order[0].rate, walk.fee);
      }
    } else if (index === 1) {
      if (walk.action === 'sell') {
        order = this.qntSum(exchange.walks[0].quantity, book, 'sell');
        qnt = this.qntSell(exchange.walks[0].quantity, order[0].rate, walk.fee);
      } else {
        order = this.qntSum(exchange.walks[0].quantity, book, 'buy');
        qnt = this.qntBuy(exchange.walks[0].quantity, order[0].rate, walk.fee);
      }
    } else if (index === 2) {
      if (walk.action === 'sell') {
        order = this.qntSum(exchange.walks[1].quantity, book, 'sell');
        qnt = this.qntSell(exchange.walks[1].quantity, order[0].rate, walk.fee);
      } else {
        order = this.qntSum(exchange.walks[1].quantity, book, 'buy');
        qnt = this.qntBuy(exchange.walks[1].quantity, order[0].rate, walk.fee);
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

  async setup() {
    let Arb = [
      {
        id: 1,
        name: 'BTC_USDT_BRL_BTC',
        entry: 0.0002,
        walks: [
          {
            id: 1,
            exchange: Bleutrade,
            fee: 0.0015,
            price: 0,
            quantity: 0,
            action: 'sell',
            market: 'BTC_USDT',
            dividend: 'BTC',
            divisor: 'USDT'
          },
          {
            id: 2,
            exchange: Bitrecife,
            fee: 0.0024,
            price: 0,
            quantity: 0,
            action: 'sell',
            market: 'USDT_BRL',
            dividend: 'USDT',
            divisor: 'BRL'
          },
          {
            id: 3,
            exchange: Bitrecife,        
            fee: 0.9976,
            price: 0,
            quantity: 0,
            action: 'buy',
            market: 'BTC_BRL',
            dividend: 'BTC',
            divisor: 'BRL'
          }
        ]
      }
    ];

    for (let [x, exchange] of Arb.entries()) {
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

  iniciar() {
    this.repetir(5000, 
      () => Promise.all([
        this.setup()
      ])
    )
  }
}

new Hades().iniciar();
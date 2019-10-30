'use stricts';

const R = require('ramda');
const Arbitration = require('./arbitration');

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

  setup() {
    
    let i = 0;
    let qnt_1, qnt_2, qnt_3 = 0;
    let orders_1, orders_2, orders_3 = [];

    Arbitration.map((exchange, x) => {      
      // Atualizando o objeto com os preços
      exchange.walks.map((walk, y) => {
        return Promise.all([
          walk.exchange.getOrderBook(walk.market)
        ]).then((book) => {
          if (book) {
            if (y === 0) {
              if (walk.action === 'sell') {
                orders_1 = this.qntSum(exchange.entry, book[0], 'sell');
                qnt_1 = this.qntSell(exchange.entry, orders_1[0].rate, walk.fee);
              } else {
                orders_1 = this.qntSum(exchange.entry, book[0], 'buy');
                qnt_1 = this.qntBuy(exchange.entry, orders_1[0].rate, walk.fee);
              }
              // Update
              walk.price = orders_1[0].rate;
              walk.quantity = qnt_1;
            } else if (y === 1) {
              if (walk.action === 'sell') {
                orders_2 = this.qntSum(exchange.walks[0].quantity, book[0], 'sell');
                qnt_2 = this.qntSell(exchange.walks[0].quantity, orders_2[0].rate, walk.fee);
              } else {
                orders_2 = this.qntSum(exchange.walks[0].quantity, book[0], 'buy');
                qnt_2 = this.qntBuy(exchange.walks[0].quantity, orders_2[0].rate, walk.fee);
              }
              // Update
              walk.price = orders_2[0].rate;
              walk.quantity = qnt_2;
            } else if (y === 2) {
              if (walk.action === 'sell') {
                orders_3 = this.qntSum(exchange.walks[1].quantity, book[0], 'sell');
                qnt_3 = this.qntSell(exchange.walks[1].quantity, orders_3[0].rate, walk.fee);
              } else {
                orders_3 = this.qntSum(exchange.walks[1].quantity, book[0], 'buy');
                qnt_3 = this.qntBuy(exchange.walks[1].quantity, orders_3[0].rate, walk.fee);
              }
              // Update
              walk.price = orders_3[0].rate;
              walk.quantity = qnt_3;
            }
          }
        })
      });
      // 
      if (exchange.walks[exchange.walks.length - 1].quantity > exchange.entry) {
        console.log(`[${exchange.name}]:`, exchange.walks[exchange.walks.length - 1].quantity, 'OK');
      } else if (exchange.walks[exchange.walks.length - 1].quantity > 0) {
        console.log(`[${exchange.name}]:`, exchange.walks[exchange.walks.length - 1].quantity);
      }
    });

    this.count += 1;
  }

  iniciar() {
    this.repetir(3000, 
      () => Promise.all([
        this.setup()
      ])
    )
  }
}

new Hades().iniciar();
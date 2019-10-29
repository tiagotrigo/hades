'use stricts';

const R = require('ramda');
const Arbitration = require('./arbitration.js');

class Hades {
  
  constructor() {
    this.i = 0,
    this.email = 'tiago.a.trigo@gmail.com',
    this.orders = [],
    this.calc_1 = 0,
    this.calc_2 = 0,
    this.calc_3 = 0,
    this.qnt_1 = 0,
    this.qnt_2 = 0,
    this.qnt_3 = 0
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

    do {
      const {
        id,
        entry
      } = Arbitration[i];

      Arbitration[i].walks.map((item, index) => {
        if (index === 0) {
          // Calculando a quantidade de moedas
          item.exchange.getOrderBook(item.market).then((book) => {
            if (item.action === 'sell') {
              orders_1 = this.qntSum(entry, book, 'sell');
              qnt_1 = this.qntSell(entry, orders_1[0].rate, item.fee);
              item = R.assoc('price', orders_1[0].rate, item);
              item = R.assoc('quantity', qnt_1, item);
            } else {
              orders_1 = this.qntSum(entry, book, 'sell');  
              qnt_1 = this.qntBuy(entry, orders_1[0].rate, item.fee);
              item = R.assoc('price', orders_1[0].rate, item);
              item = R.assoc('quantity', qnt_1, item);
            }
            console.log(item)
          })
        } else if (index === 1) {
          item.exchange.getOrderBook(item.market).then((book) => {
            if (item.action === 'sell') {
              orders_2 = this.qntSum(qnt_1, book, 'sell');
              qnt_2 = this.qntSell(qnt_1, orders_2[0].rate, item.fee);
              item = R.assoc('price', orders_2[0].rate, item);
              item = R.assoc('quantity', qnt_2, item);
            } else {
              orders_2 = this.qntSum(qnt_1, book, 'sell');  
              qnt_2 = this.qntBuy(qnt_1, orders_2[0].rate, item.fee);
              item = R.assoc('price', orders_2[0].rate, item);
              item = R.assoc('quantity', qnt_2, item);
            }
            console.log(item)
          })
        } else if (index === 2) {
          item.exchange.getOrderBook(item.market).then((book) => {
            if (item.action === 'sell') {
              orders_3 = this.qntSum(qnt_2, book, 'sell');
              qnt_3 = this.qntSell(qnt_2, orders_3[0].rate, item.fee);
              item = R.assoc('price', orders_3[0].rate, item);
              item = R.assoc('quantity', qnt_2, item);
            } else {
              orders_3 = this.qntSum(qnt_1, book, 'sell');  
              qnt_3 = this.qntBuy(qnt_1, orders_3[0].rate, item.fee);
              item = R.assoc('price', orders_3[0].rate, item);
              item = R.assoc('quantity', qnt_2, item);
            }
          })
        }
        console.log(item)
      });
      
      i++;
    } while ((i - 1) === Arbitration.length)
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
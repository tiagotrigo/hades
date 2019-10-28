'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

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

  sum(entry, book, type) {
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

  setup() {   
    // Salvando o saldo
    this.entry = 0.0002;
    // Venda
    Bleutrade.getOrderBook('BTC_USDT', 'ALL', 15).then((book) => {
      const ordersSellBleutrade = this.sum(this.entry, book, 'sell');
      const qntSellBleutrade = this.formatNumber((this.entry * ordersSellBleutrade[0].rate) * (1 - 0.0015), 8);
      // Venda
      Bitrecife.getOrderBook('USDT_BRL', 'ALL', 15).then((book) => {
        const ordersSellBitrecife = this.sum(qntSellBleutrade, book, 'sell');
        const qntSellBitrecife = this.formatNumber((qntSellBleutrade * ordersSellBitrecife[0].rate) * (1 - 0.0024), 8); 
        // Compra
        Bitrecife.getOrderBook('BTC_BRL', 'ALL', 15).then((book) => {
          const ordersBuyBitrecife = this.sum(qntSellBitrecife, book, 'buy');
          
          const qntBidFee = qntSellBitrecife * 0.9985;
          const qntBidProfit = this.formatNumber(qntBidFee, 8) / ordersBuyBitrecife[0].rate;
          const qntBuyBitrecife = this.formatNumber(qntBidProfit, 8); 

          if (qntBuyBitrecife > this.entry) {
            // Validando se é possível executar as ordens
            if (
              ordersSellBleutrade[0].quantity >= qntSellBleutrade && 
              ordersSellBitrecife[0].quantity >= qntSellBitrecife && 
              ordersBuyBitrecife[0].quantity >= qntBuyBitrecife
            ) {
              Bleutrade.getOpenOrders('BTC_USDT').then((data) => {
                if (data.data.result === null) {
                  // Venda
                  Bleutrade.setSellLimit('BTC_USDT', ordersSellBleutrade[0].rate, qntSellBleutrade, false).then((data) => {
                    console.log('Troca de BTC por USDT');
                    setTimeout(() => {
                      //Transferir Bleutrade para Bitrecife
                      Bleutrade.setDirectTransfer('USDT', qntSellBleutrade, 3, this.email).then((data) => {
                        console.log('Enviando USDT para Bitrecife');
                        // Venda
                        Bitrecife.setSellLimit('USDT_BRL', ordersSellBitrecife[0].rate, qntSellBitrecife, false).then((data) => {
                          console.log('Troca de USDT por BRL');
                          // Compra
                          Bitrecife.setBuyLimit('BTC_BRL', ordersBuyBitrecife[0].rate, qntBuyBitrecife, false).then((data) => {
                            console.log('Troca de BRL por BTC');  
                            //Transferir Bitrecife para Bleutrade
                            Bitrecife.setDirectTransfer('BTC', qntBuyBitrecife, 1, this.email).then((data) => {
                              console.log('Enviando BTC para Bleutrade');
                              process.exit()
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
              //
              console.log(' ');
            } else {
              console.log(' ');
              console.log('Exchange: Bleutrade / Bitrecife');
              console.log('Status: Ordem inferior ao meu saldo');
              console.log('Moeda: BTC_USDT');
              console.log('Ganho:', qntBuyBitrecife);
              console.log('Quantidade:', qntSellBitrecife);
              console.log('Livro Bleutrade:', this.formatNumber((qntSellBleutrade[0].quantity * qntSellBleutrade[0].rate), 8));
              console.log('Livro Bitrecife:', this.formatNumber((ordersBuyBitrecife[0].quantity * ordersBuyBitrecife[0].rate), 8));
              console.log(' ');
            }
          } else {
            console.log('[BTC_USDT]:', this.formatNumber(qntBuyBitrecife, 8))
          }
        });
      });
    });
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
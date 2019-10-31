'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Coins = require('./coins.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.entry = 0.00020000,
    this.min = 0.0002,
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

  // Bleutrade
  exchangeA(symbol, dividend, divisor) {
    // Saldo em bitcoins na Exccripto
    Exc.getBalance('BTC').then((data) => {
      // Salvando o saldo em bitcoins
      this.entry = data.data.result[0].Balance;
      // Oferta(s) na Bleutrade
      Bleutrade.getOrderBook(symbol, 'ALL', 15).then((bookBleutrade) => {      
        const ordersBleu = this.sum(this.min, bookBleutrade, 'buy');
        const qntBleuFee = this.min * 0.9985;
        const qntBleuAsk = this.formatNumber(qntBleuFee, 8) / bookBleutrade.sell[0].Rate;
        const qntBleu = this.formatNumber(qntBleuAsk, 8);
        // Oferta(s) na Exccripto
        Exc.getOrderBook(symbol, 'ALL', 15).then((bookExccripto) => {
          const ordersExc = this.sum(qntBleu, bookExccripto, 'sell');
          // Calculando venda
          const qntExcBid = this.formatNumber((qntBleu * bookExccripto.buy[0].Rate) * (1 - 0.0025), 8);
          // Validando se existe lucro 
          if (qntExcBid > this.min) {
            Bleutrade.getOpenOrders(symbol).then((data) => {
              if (data.data.result === null) {
                Bleutrade.setBuyLimit(symbol, ordersBleu[0].rate, qntBleu, false).then((data) => {
                  console.log(`Troca de BTC por ${dividend}`);
                  setTimeout(() => {
                    // Verificando a quantidade da moeda comprada
                    Bleutrade.getBalance(dividend).then((data) => {
                      const amountBleutrade = data.data.result[0].Balance;
                      // Transferir Bleutrade para Exccripto
                      Bleutrade.setDirectTransfer(dividend, amountBleutrade, 2, this.email).then((data) => {
                        console.log(`Enviando ${dividend} para Exccripto`);
                        // Verificando a quantidade da moeda para vender
                        Exc.getBalance(dividend).then((data) => {
                          const amountExccripto = data.data.result[0].Balance;
                          // Vender na Exccripto  
                          Exc.setSellLimit(symbol, ordersExc[0].rate, amountExccripto, false).then((data) => {
                            console.log(`Trocar de ${dividend} por BTC`);
                            setTimeout(() => {
                              Exc.getBalance('BTC').then((data) => {
                                Exc.setDirectTransfer('BTC', data.data.result[0].Balance, 1, this.email).then((data) => {
                                  console.log(`Enviando BTC para Bleutrade`);
                                });
                              });
                            }, 400);
                          });
                        });
                      });
                    });
                  }, 400);
                })
              } else {
                console.log(`Moeda ${symbol} está com ordem aberta`);
                console.log(' ');
              }
            });
          } else {
            console.log('Bleutrade - ['+ symbol +']:', qntExcBid);
          }
        });
      });
    });
  }

  // Exccripto
  exchangeB(symbol, dividend, divisor) {
    // Saldo
    Exc.getBalance('BTC').then((data) => {
      // Salvando o saldo
      this.entry = data.data.result[0].Balance;
      // Oferta(s)
      Exc.getOrderBook(symbol, 'ALL', 15).then((bookExccripto) => {
        const ordersExc = this.sum(this.min, bookExccripto, 'buy');
        const qntExcFee = this.min * 0.9975;
        const qntExcAsk = this.formatNumber(qntExcFee, 8) / bookExccripto.sell[0].Rate;
        const qntExc = this.formatNumber(qntExcAsk, 8);
        // Oferta(s)
        Bleutrade.getOrderBook(symbol, 'ALL', 15).then((bookBleutrade) => {
          const ordersBleu = this.sum(qntExc, bookBleutrade, 'sell');
          // Calculando venda
          const qntBleuBid = this.formatNumber((qntExc * bookBleutrade.buy[0].Rate) * (1 - 0.0015), 8);
          // Validando se existe lucro
          if (qntBleuBid > this.min) {
            Exc.getOpenOrders(symbol).then((data) => {
              if (data.data.result === null) {
                Bleutrade.setDirectTransfer('BTC', this.min, 2, this.email).then((data) => {
                  console.log('Enviando BTC para Exccripto')
                  // Comprar na Exccripto
                  Exc.setBuyLimit(symbol, ordersExc[0].rate, qntExc, false).then((data) => {
                    console.log(`Troca de BTC por ${dividend}`);
                    // Transferir Exccripto para Bleutrade
                    Exc.setDirectTransfer(dividend, qntExc, 1, this.email).then((data) => {
                      console.log(`Enviando ${dividend} para Bleutrade`);
                      // Vender moeda
                      Bleutrade.setSellLimit(symbol, ordersBleu[0].rate, qntExc, false).then((data) => {
                        console.log(`Trocar de ${dividend} por BTC`);
                        // Transferir Bleutrade para Exccripto                     
                        setTimeout(() => {
                          Bleutrade.getBalance('BTC').then((data) => {
                            Bleutrade.setDirectTransfer('BTC', data.data.result[0].Balance, 2, this.email).then((data) => {
                              console.log(`Enviando BTC para Exccripto`);
                              console.log(' ');
                              process.exit();
                            });
                          })
                        }, 400);
                      });
                    });
                  });
                });
              } else {
                console.log(`Moeda ${symbol} está com ordem aberta`);
                console.log(' ');
              }
            });
          } else {
            console.log('[Exccripto - '+ symbol +']:', qntBleuBid);
          }
        });
      });
    });
  }

  setup() {
    if (this.count >= Coins.length) this.count = 0;

    const { 
      symbol,
      divisor,
      dividend
    } = Coins[this.count];

    // Oferta(s) na Exccripto
    Exc.getOrderBook(symbol, 'ALL', 3).then((data) => {
      let book_exccripto = data.sell[0].Rate;
      // Oferta(s) na Bleutrade
      Bleutrade.getOrderBook(symbol, 'ALL', 3).then((data) => {
        let book_bleutrade = data.sell[0].Rate;
        // Verifica qual a menor compra, para possivel virada de exchange
        if (book_exccripto > book_bleutrade) {
          this.exchangeA(symbol, dividend, divisor);
        } else {
          this.exchangeB(symbol, dividend, divisor);
        }
      });
    });

    this.count += 1;
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
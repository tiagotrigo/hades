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
    this.min = 0.000125,
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

  // Bleutrade
  exchangeA(symbol, dividend, divisor) {
    // Saldo em bitcoins na Exccripto
    Exc.getBalance('BTC').then((data) => {
      // Salvando o saldo em bitcoins
      this.entry = data.data.result[0].Balance;
      // Oferta(s) na Bleutrade
      Bleutrade.getOrderBook(symbol, 'ALL', 15).then((bookBleutrade) => {
        const qntBleuFee = this.min * 0.9985;
        const qntBleuAsk = this.formatNumber(qntBleuFee, 8) / bookBleutrade.sell[0].Rate;
        const qntBleu = this.formatNumber(qntBleuAsk, 8);
        // Oferta(s) na Exccripto
        Exc.getOrderBook(symbol, 'ALL', 15).then((bookExccripto) => {
          // Calculando venda
          const qntExcBid = this.formatNumber((qntBleu * bookExccripto.buy[0].Rate) * (1 - 0.0025), 8);
          // Validando se existe lucro 
          if (qntExcBid > this.min) {
            // Validando se é possível executar as ordens
            if (bookBleutrade.sell[0].Quantity >= qntBleu && bookExccripto.buy[0].Quantity >= qntExcBid) {
              Exc.getOpenOrders(symbol).then((data) => {
                if (data.data.result === null) {
                  //Transferir Exccripto para Bleutrade
                  Exc.setDirectTransfer('BTC', this.min, 1, this.email).then((data) => {
                    console.log('Enviando BTC para Bleutrade');
                    // Comprar na Bleutrade
                    Bleutrade.setBuyLimit(symbol, bookBleutrade.sell[0].Rate, qntBleu, false).then((data) => {
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
                              Exc.setSellLimit(symbol, bookExccripto.buy[0].Rate, amountExccripto, false).then((data) => {
                                console.log(`Trocar de ${dividend} por BTC`);  
                                process.exit();                              
                              });
                            });
                          });
                        });
                      }, 400);
                    })
                  });
                } else {
                  console.log(`Moeda ${symbol} está com ordem aberta`);
                  console.log(' ');
                }
              });
              //
              console.log(' ');
            } else {
              console.log(' ');
              console.log('Exchange: Bleutrade / Exccripto');
              console.log('Status: Ordem inferior ao meu saldo');
              console.log('Moeda:', symbol)
              console.log('Ganho:', qntExcBid);
              console.log('Quantidade:', qntBleu);
              console.log('Livro Exc:', this.formatNumber((bookExccripto.buy[0].Quantity * bookExccripto.buy[0].Rate), 8));
              console.log('Livro Bleutrade:', this.formatNumber((bookBleutrade.sell[0].Quantity * bookBleutrade.sell[0].Rate), 8));
              console.log(' ');
            }
          } else {
            console.log('['+ symbol +']:', qntExcBid);
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
        const qntExcFee = this.min * 0.9975;
        const qntExcAsk = this.formatNumber(qntExcFee, 8) / bookExccripto.sell[0].Rate;
        const qntExc = this.formatNumber(qntExcAsk, 8);
        // Oferta(s)
        Bleutrade.getOrderBook(symbol, 'ALL', 15).then((bookBleutrade) => {
          // Calculando venda
          const qntBleuBid = this.formatNumber((qntExc * bookBleutrade.buy[0].Rate) * (1 - 0.0015), 8);
          // Validando se existe lucro
          if (qntBleuBid > this.min) {
            // Validando se é possível executar as ordens
            if (bookExccripto.sell[0].Quantity >= qntExc && bookBleutrade.buy[0].Quantity >= qntBleuBid) {
              console.log(' ');
              // Verificando se existe alguma ordem aberta
              Bleutrade.getOpenOrders(symbol).then((data) => {
                if (data.data.result === null) {
                  // Comprar na Exccripto
                  Exc.setBuyLimit(symbol, bookExccripto.sell[0].Rate, qntExc, false).then((data) => {
                    console.log(`Troca de BTC por ${dividend}`);
                    // Transferir Exccripto para Bleutrade
                    Exc.setDirectTransfer(dividend, qntExc, 1, this.email).then((data) => {
                      console.log(`Enviando ${dividend} para Bleutrade`);
                      // Vender moeda
                      Bleutrade.setSellLimit(symbol, bookBleutrade.buy[0].Rate, qntExc, false).then((data) => {
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
                } else {
                  console.log(`Moeda ${symbol} está com ordem aberta`);
                  console.log(' ');
                }
              });
            } else {
              console.log(' ');
              console.log('Exchange: Exccripto / Bleutrade');
              console.log('Status: Ordem inferior ao meu saldo');
              console.log('Moeda:', symbol)
              console.log('Ganho:', qntBleuBid);
              console.log('Quantidade:', qntExc);
              console.log('Livro Bleutrade:', this.formatNumber((bookBleutrade.sell[0].Quantity * bookBleutrade.sell[0].Rate), 8));
              console.log('Livro Exc:', this.formatNumber((bookExccripto.buy[0].Quantity * bookExccripto.buy[0].Rate), 8));
              console.log(' ');
            }
          } else {
            console.log('['+ symbol +']:', qntBleuBid);
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
    this.repetir(10000, 
      () => Promise.all([
        this.setup()
      ])
    )
  }
}

new Hades().iniciar();
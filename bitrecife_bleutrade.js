'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.sum = 0,
    this.entry = 15.00,
    this.min = 15.00,
    this.email = 'tiago.a.trigo@gmail.com',
    this.coins = [
      {
        symbol: 'BTC_USDT', 
        dividend: 'BTC',
        market: 'USDT'
      },
      // {
      //   symbol: 'ETH_USDT', 
      //   dividend: 'ETH',
      //   market: 'USDT'
      // },
      // {
      //   symbol: 'LTC_USDT', 
      //   dividend: 'LTC',
      //   market: 'USDT'     
      // }
    ]
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

  // Exccripto
  exchangeA(symbol, dividend) {
    // Salvando o saldo
    this.entry = 5;
    // Venda
    Exc.getOrderBook(symbol, 'ALL', 15).then((bookExccripto) => {  
      let ordersSum = 0;
      let ordersSumExccripto = R.map((item) => {
        if (ordersSum >= this.entry) {
          return item
        } else {
          ordersSum = ordersSum + (item.Quantity * item.Rate);
        }
        return null
      }, bookExccripto.sell);

      const ordersExccripto = R.reject((n) => n === null, ordersSumExccripto);
      // const qntFee = this.entry * 0.9975;
      // const qntAsk = this.formatNumber(qntFee, 8) / ordersSumExccripto[0].Rate;
      // const qnt = this.formatNumber(qntAsk, 8);
      console.log(ordersExccripto)
      // // Compra
      // Bleutrade.getOrderBook(symbol, 'ALL', 15).then((bookBleutrade) => {
      //   let ordersBleutrade = R.map((item, index) => {
      //     if ((item.Quantity * item.Rate) >= this.entry) {
      //       return item
      //     }
      //     return null
      //   }, bookBleutrade.buy);

      //   const ordersSumBleutrade = R.reject((n) => n === null, ordersBleutrade);
      //   const qntBid = this.formatNumber((qnt * ordersSumBleutrade[0].Rate) * (1 - 0.0025), 8);

      //   // Venda
      //   if (qntBid > this.entry) {
      //     console.log(' ')
      //     console.log(`[Exccripto - ${symbol}]:`, this.formatNumber(qntBid, 8), 'OK')
      //     console.log(' ')
      //     // if (ordersSumBleutrade[0].Quantity >= qnt && ordersSumExccripto[0].Quantity >= qntBid) {
      //     //   Exc.getOpenOrders(symbol).then((data) => {
      //     //     if (data.data.result === null) {
      //     //       //Transferir Exccripto para Bleutrade
      //     //       Exc.setDirectTransfer(dividend, this.entry, 1, this.email).then((data) => {
      //     //         console.log('Enviando USDT para Bleutrade');
      //     //         // Comprar na Bleutrade
      //     //         Bleutrade.setBuyLimit(symbol, ordersSumBleutrade[0].Rate, qnt, false).then((data) => {
      //     //           console.log(`Troca de USDT por ${dividend}`);
      //     //           setTimeout(() => {
      //     //             // Transferindo
      //     //             Bleutrade.setDirectTransfer(dividend, qnt, 2, this.email).then((data) => {
      //     //               console.log(`Enviando ${dividend} para Exccripto`);                      
      //     //               // Vender na Exccripto  
      //     //               Exc.setSellLimit(symbol, ordersSumExccripto[0].Rate, qntBid, false).then((data) => {
      //     //                 console.log(`Trocar de ${dividend} por USDT`);                          
      //     //               });
      //     //             });
      //     //           }, 400);
      //     //         })
      //     //       });
      //     //     } else {
      //     //       console.log(`Moeda ${symbol} está com ordem aberta`);
      //     //       console.log(' ');
      //     //     }
      //     //   });
      //     //   //
      //     //   console.log(' ');
      //     // } else {
      //     //   console.log(' ');
      //     //   console.log('Exchange: Bleutrade / Exccripto');
      //     //   console.log('Status: Ordem inferior ao meu saldo');
      //     //   console.log('Moeda:', symbol)
      //     //   console.log('Ganho:', qntBid);
      //     //   console.log('Quantidade:', qnt);
      //     //   console.log('Livro Exc:', this.formatNumber((ordersSumExccripto[0].Quantity * ordersSumExccripto[0].Rate), 8));
      //     //   console.log('Livro Bleutrade:', this.formatNumber((ordersSumBleutrade[0].Quantity * ordersSumBleutrade[0].Rate), 8));
      //     //   console.log(' ');
      //     // }
      //   } else {
      //     console.log(`[Exccripto - ${symbol}]:`, this.formatNumber(qntBid, 2))
      //   }
      // });
    });
  }

  // Bleutrade
  exchangeB(symbol, dividend) {
    // Salvando o saldo
    this.entry = 5;
    // Compra
    Bleutrade.getOrderBook(symbol, 'ALL', 15).then((bookBleutrade) => {
      let ordersBleutrade = R.map((item, index) => {
        if ((item.Quantity * item.Rate) >= this.entry) {
          return item
        }
        return null
      }, bookBleutrade.sell);

      const ordersSumBleutrade = R.reject((n) => n === null, ordersBleutrade);
      const qntFee = this.entry * 0.9975;
      const qntAsk = this.formatNumber(qntFee, 8) / ordersSumBleutrade[0].Rate;
      const qnt = this.formatNumber(qntAsk, 8);

      // Venda
      Exc.getOrderBook(symbol, 'ALL', 15).then((bookExccripto) => {
        let ordersExccripto = R.map((item, index) => {
          if ((item.Quantity * item.Rate) >= this.entry) {
            return item
          }
          return null
        }, bookExccripto.buy);

        const ordersSumExccripto = R.reject((n) => n === null, ordersExccripto);
        const qntBid = this.formatNumber((qnt * ordersSumExccripto[0].Rate) * (1 - 0.0025), 8);

        // Validando se existe lucro 
        if (qntBid > this.entry) {
          // Validando se é possível executar as ordens
          console.log(`[Bleutrade - ${symbol}]:`, this.formatNumber(qntBid, 8), 'OK');
          // if (ordersSumBleutrade[0].Quantity >= qnt && ordersSumExccripto[0].Quantity >= qntBid) {
          //   Exc.getOpenOrders(symbol).then((data) => {
          //     if (data.data.result === null) {
          //       //Transferir Exccripto para Bleutrade
          //       Exc.setDirectTransfer(dividend, this.entry, 1, this.email).then((data) => {
          //         console.log('Enviando USDT para Bleutrade');
          //         // Comprar na Bleutrade
          //         Bleutrade.setBuyLimit(symbol, ordersSumBleutrade[0].Rate, qnt, false).then((data) => {
          //           console.log(`Troca de USDT por ${dividend}`);
          //           setTimeout(() => {
          //             // Transferindo
          //             Bleutrade.setDirectTransfer(dividend, qnt, 2, this.email).then((data) => {
          //               console.log(`Enviando ${dividend} para Exccripto`);                      
          //               // Vender na Exccripto  
          //               Exc.setSellLimit(symbol, ordersSumExccripto[0].Rate, qntBid, false).then((data) => {
          //                 console.log(`Trocar de ${dividend} por USDT`);                          
          //               });
          //             });
          //           }, 400);
          //         })
          //       });
          //     } else {
          //       console.log(`Moeda ${symbol} está com ordem aberta`);
          //       console.log(' ');
          //     }
          //   });
          //   //
          //   console.log(' ');
          // } else {
          //   console.log(' ');
          //   console.log('Exchange: Bleutrade / Exccripto');
          //   console.log('Status: Ordem inferior ao meu saldo');
          //   console.log('Moeda:', symbol)
          //   console.log('Ganho:', qntBid);
          //   console.log('Quantidade:', qnt);
          //   console.log('Livro Exc:', this.formatNumber((ordersSumExccripto[0].Quantity * ordersSumExccripto[0].Rate), 8));
          //   console.log('Livro Bleutrade:', this.formatNumber((ordersSumBleutrade[0].Quantity * ordersSumBleutrade[0].Rate), 8));
          //   console.log(' ');
          // }
        } else {
          console.log(`[Bleutrade - ${symbol}]:`, this.formatNumber(qntBid, 2))
        }
      });
    });
  }

  // Bleutrade
  exchangeC() {
    // Saldo
    Bitrecife.getBalance('BRL').then((data) => {
      // Salvando o saldo
      this.entry = 50.00;
      // Compra
      Bitrecife.getOrderBook('USDT_BRL', 'ALL', 3).then((bookBitrecife) => {
        const qntFee = this.entry * 0.9960;
        const qntAsk = this.formatNumber(qntFee, 8) / bookBitrecife.sell[0].Rate;
        const qnt = this.formatNumber(qntAsk, 8);
        // Compra
        Exc.getOrderBook('BTC_USDT', 'ALL', 3).then((bookExc) => {
          const qntFeeBTC = qnt * 0.9975;
          const qntAskBTC = this.formatNumber(qntFeeBTC, 8) / bookExc.sell[0].Rate;
          const qntBTC = this.formatNumber(qntAskBTC, 8);
          // Venda
          Bitrecife.getOrderBook('BTC_BRL', 'ALL', 3).then((bookBitrecife) => {            
            const qntBid = this.formatNumber((qntBTC * bookBitrecife.buy[0].Rate) * (1 - 0.004), 8);

            if (qntBid > this.formatNumber(this.entry, 2)) {
              console.log('[BTC_BRL]:', this.formatNumber(qntBid, 8), 'OK')
              // Validando se é possível executar as ordens
              // if (bookBitrecife.sell[0].Quantity >= this.entry && bookBleutrade.sell[0].Quantity >= qnt && bookBitrecife.buy[0].Quantity >= qntBTC) {
              //   Bitrecife.getOpenOrders('USDT_BRL').then((data) => {
              //     if (data.data.result === null) {
              //       // Comprar
              //       Bitrecife.setBuyLimit('USDT_BRL', bookBitrecife.sell[0].Rate, qnt, false).then((data) => {
              //         console.log(`Troca de BRL por USDT`);
              //         // Transferir Bitrecife para Bleutrade
              //         Bitrecife.setDirectTransfer('USDT', qnt, 1, this.email).then((data) => {
              //           console.log(`Enviando USDT para Bleutrade`);
              //           // Comprar
              //           Bleutrade.setBuyLimit('BTC_USDT', bookBleutrade.buy[0].Rate, qntBTC, false).then((data) => {
              //             console.log(`Troca de USDT por BTC`);
              //             // Transferir Bleutrade para Bitrecife
              //             setTimeout(() => {
              //               Bleutrade.setDirectTransfer('BTC', qntBTC, 3, this.email).then((data) => {
              //                 console.log(`Enviando BTC para Bitrecife`);
              //                 // Venda
              //                 Bitrecife.setSellLimit('BTC_BRL', bookBitrecife.buy[0].Rate, qntBTC, false).then((data) => {
              //                   console.log(`Trocar de BTC por BRL`);                                
              //                 });
              //               });
              //             }, 400);
              //           });
              //         });
              //       })
              //     } else {
              //       console.log(`Moeda USDT_BRL está com ordem aberta`);
              //       console.log(' ');
              //     }
              //   });
              // } else {
              //   console.log(' ');
              //   console.log('Exchange: Bitrecife / Bleutrade');
              //   console.log('Status: Ordem inferior ao meu saldo');
              //   console.log('Moeda:', symbol)
              //   console.log('Ganho:', qntBid);
              //   console.log('Quantidade:', qntBTC);
              //   console.log('Livro Bitrecife:', this.formatNumber((bookBitrecife.buy[0].Quantity * bookBitrecife.buy[0].Rate), 8));
              //   console.log('Livro Bleutrade:', this.formatNumber((bookBleutrade.sell[0].Quantity * bookBleutrade.sell[0].Rate), 8));
              //   console.log(' ');
              // }
            } else {
              console.log('[BTC_BRL]:', this.formatNumber(qntBid, 2))
            }
          });
        });
      });
    });
  }

  setup() {
    if (this.count >= this.coins.length) this.count = 0;

    const { 
      symbol,
      market,
      dividend
    } = this.coins[this.count];
    
    // Oferta(s) na Exccripto
    Exc.getOrderBook(symbol, 'ALL', 3).then((data) => {
      let book_exccripto = data.sell[0].Rate;
      // Oferta(s) na Bleutrade
      Bleutrade.getOrderBook(symbol, 'ALL', 3).then((data) => {
        let book_bleutrade = data.sell[0].Rate;
        // Verifica qual a menor compra, para possivel virada de exchange
        if (book_exccripto > book_bleutrade) {
          this.exchangeA(symbol, dividend);
        } else {
          this.exchangeA(symbol, dividend);
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
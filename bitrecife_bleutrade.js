'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.email = 'tiago.a.trigo@gmail.com',
    this.coins = [
      {
        symbol: 'BTC_USDT', 
        dividend: 'BTC',
        market: 'USDT'
      },
      {
        symbol: 'ETH_USDT', 
        dividend: 'ETH',
        market: 'USDT'
      },
      {
        symbol: 'LTC_USDT', 
        dividend: 'LTC',
        market: 'USDT'     
      }
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
    this.entry = 10;
    // Compra
    Exc.getOrderBook(symbol, 'ALL', 15).then((bookExccripto) => {
      let i = 0;
      let sumExccripto = 0;
      let ordersMultExccripto = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), bookExccripto.sell);
      let ordersSumExccripto = R.map((item) => {
        i++;
        sumExccripto = sumExccripto + item;
        return {
          id: i - 1,
          rate: bookExccripto.sell[i - 1].Rate,
          quantity: item,
          sum: this.formatNumber(sumExccripto, 8)
        }
      }, ordersMultExccripto);

      const ordersExccripto = R.filter((n) => n.sum >= this.entry, ordersSumExccripto);
      const qntFee = this.entry * 0.9975;
      const qntAsk = this.formatNumber(qntFee, 8) / ordersExccripto[0].rate;
      // BTC, ETH e LTC
      const qnt = this.formatNumber(qntAsk, 8);
      // Venda
      Bleutrade.getOrderBook(symbol, 'ALL', 15).then((bookBleutrade) => {
        let c = 0;
        let sumBleutrade = 0;
        let ordersMultiBleutrade = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), bookBleutrade.buy);
        let ordersSumBleutrade = R.map((item) => {
          c++;
          sumBleutrade = sumBleutrade + item;
          return {
            id: c - 1,
            rate: bookBleutrade.buy[c - 1].Rate,
            quantity: item,
            sum: this.formatNumber(sumBleutrade, 8)
          }
        }, ordersMultiBleutrade);

        const ordersBleutrade = R.filter((n) => n.sum >= qnt, ordersSumBleutrade);
        // USDT
        const qntBid = this.formatNumber((qnt * ordersBleutrade[0].rate) * (1 - 0.0015), 8);

        // Venda
        if (qntBid > this.entry) {
          if (ordersBleutrade[0].quantity >= qnt && ordersExccripto[0].quantity >= qntBid) {
            Exc.getOpenOrders(symbol).then((data) => {
              if (data.data.result === null) {
                // Comprar
                Exc.setBuyLimit(symbol, ordersExccripto[0].rate, qnt, false).then((data) => {
                  console.log(`Troca de USDT por ${dividend}`);
                  //Transferir Exccripto para Bleutrade
                  Exc.setDirectTransfer(dividend, qnt, 1, this.email).then((data) => {
                    console.log(`Enviando ${dividend} para Bleutrade`);
                    setTimeout(() => {
                      // Vender na Bleutrade  
                      Bleutrade.setSellLimit(symbol, ordersBleutrade[0].rate, qntBid, false).then((data) => {
                        console.log(`Trocar de ${dividend} por USDT`); 
                        Exc.setDirectTransfer(dividend, qntBid, 2, this.email).then((data) => {
                          console.log(`Enviando ${dividend} para Exccripto`);
                          process.exit();
                        });                
                      });
                    }, 400);
                  });
                })
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
            console.log('Ganho:', qntBid);
            console.log('Quantidade:', qnt);
            console.log('Livro Exc:', this.formatNumber((ordersExccripto[0].quantity * ordersExccripto[0].rate), 8));
            console.log('Livro Bleutrade:', this.formatNumber((ordersBleutrade[0].quantity * ordersBleutrade[0].rate), 8));
            console.log(' ');
          }
        } else {
          console.log(`[Exccripto - ${symbol}]:`, this.formatNumber(qntBid, 2))
        }
      });
    });
  }

  // Bleutrade
  exchangeB(symbol, dividend) {
    // Salvando o saldo
    this.entry = 10;
    // Compra
    Bleutrade.getOrderBook(symbol, 'ALL', 15).then((bookBleutrade) => {
      let c = 0;
      let sumBleutrade = 0;
      let ordersMultiBleutrade = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), bookBleutrade.sell);
      let ordersSumBleutrade = R.map((item) => {
        c++;
        sumBleutrade = sumBleutrade + item;
        return {
          id: c - 1,
          rate: bookBleutrade.sell[c - 1].Rate,
          quantity: item,
          sum: this.formatNumber(sumBleutrade, 8)
        }
      }, ordersMultiBleutrade);

      const ordersBleutrade = R.filter((n) => n.sum >= this.entry, ordersSumBleutrade);
      const qntFee = this.entry * 0.9985;
      const qntAsk = this.formatNumber(qntFee, 8) / ordersBleutrade[0].rate;
      const qnt = this.formatNumber(qntAsk, 8);

      // Venda
      Exc.getOrderBook(symbol, 'ALL', 15).then((bookExccripto) => {
        let i = 0;
        let sumExccripto = 0;
        let ordersMultExccripto = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), bookExccripto.buy);
        let ordersSumExccripto = R.map((item) => {
          i++;
          sumExccripto = sumExccripto + item;
          return {
            id: i - 1,
            rate: bookExccripto.buy[i - 1].Rate,
            quantity: item,
            sum: this.formatNumber(sumExccripto, 8)
          }
        }, ordersMultExccripto);

        const ordersExccripto = R.filter((n) => n.sum >= qnt, ordersSumExccripto);
        const qntBid = this.formatNumber((qnt * ordersExccripto[0].rate) * (1 - 0.0025), 8);

        // Validando se existe lucro 
        if (qntBid > this.entry) {
          // Validando se é possível executar as ordens
          if (ordersBleutrade[0].quantity >= qnt && ordersExccripto[0].quantity >= qntBid) {
            Bleutrade.getOpenOrders(symbol).then((data) => {
              if (data.data.result === null) {
                // Comprar
                Bleutrade.setBuyLimit(symbol, ordersBleutrade[0].rate, qnt, false).then((data) => {
                  console.log(`Troca de USDT por ${dividend}`);
                  //Transferir Bleutrade para Exccripto
                  Bleutrade.setDirectTransfer(dividend, qnt, 2, this.email).then((data) => {
                    console.log(`Enviando ${dividend} para Exccripto`);
                    setTimeout(() => {
                      // Vender na Bleutrade  
                      Exc.setSellLimit(symbol, ordersExccripto[0].rate, qntBid, false).then((data) => {
                        console.log(`Trocar de ${dividend} por USDT`); 
                        process.exit();                
                      });
                    }, 400);
                  });
                })
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
            console.log('Ganho:', qntBid);
            console.log('Quantidade:', qnt);
            console.log('Livro Exc:', this.formatNumber((ordersSumExccripto[0].Quantity * ordersSumExccripto[0].Rate), 8));
            console.log('Livro Bleutrade:', this.formatNumber((ordersSumBleutrade[0].Quantity * ordersSumBleutrade[0].Rate), 8));
            console.log(' ');
          }
        } else {
          console.log(`[Bleutrade - ${symbol}]:`, this.formatNumber(qntBid, 2))
        }
      });
    });
  }

  exchangeC(symbol, dividend) {
    // Salvando o saldo
    this.entry = 0.0002;
    // Venda
    Bleutrade.getOrderBook('BTC_USDT', 'ALL', 15).then((bookBleutrade) => {
      let i = 0;
      let sumBleutrade = 0;
      let ordersMultiBleutrade = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), bookBleutrade.buy);
      let ordersSumBleutrade = R.map((item) => {
        i++;
        sumBleutrade = sumBleutrade + item;
        return {
          id: i - 1,
          rate: bookBleutrade.buy[i - 1].Rate,
          quantity: item,
          sum: this.formatNumber(sumBleutrade, 8)
        }
      }, ordersMultiBleutrade);

      const ordersBleutrade = R.filter((n) => n.sum >= this.entry, ordersSumBleutrade);
      const qntBid = this.formatNumber((this.entry * ordersBleutrade[0].rate) * (1 - 0.0015), 8); 
      // Venda
      Bitrecife.getOrderBook('USDT_BRL', 'ALL', 15).then((bookBitrecife) => {
        let c = 0;
        let sumBitrecife = 0;
        let ordersMultBitrecife = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), bookBitrecife.buy);
        let ordersSumBitrecife = R.map((item) => {
          c++;
          sumBitrecife = sumBitrecife + item;
          return {
            id: c - 1,
            rate: bookBitrecife.buy[c - 1].Rate,
            quantity: item,
            sum: this.formatNumber(sumBitrecife, 8)
          }
        }, ordersMultBitrecife);

        const ordersBitrecife = R.filter((n) => n.sum >= qntBid, ordersSumBitrecife);
        const qnt = this.formatNumber((qntBid * ordersBitrecife[0].rate) * (1 - 0.0024), 8); 
        // Compra
        Bitrecife.getOrderBook('BTC_BRL', 'ALL', 15).then((bookBitrecife) => {
          let z = 0;
          let sumBTCBitrecife = 0;
          let ordersMultBTCBitrecife = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), bookBitrecife.sell);
          let ordersSumBTCBitrecife = R.map((item) => {
            z++;
            sumBTCBitrecife = sumBTCBitrecife + item;
            return {
              id: z - 1,
              rate: bookBitrecife.sell[z - 1].Rate,
              quantity: item,
              sum: this.formatNumber(sumBTCBitrecife, 8)
            }
          }, ordersMultBTCBitrecife);

          const ordersBTCBitrecife = R.filter((n) => n.sum >= qnt, ordersSumBTCBitrecife);
          const qntFeeBTC = qnt * 0.9985;
          const qntAskBTC = this.formatNumber(qntFeeBTC, 8) / ordersBTCBitrecife[0].rate;
          const qntBTC = this.formatNumber(qntAskBTC, 8); 

          if (qntBTC > this.entry) {
            // Validando se é possível executar as ordens
            if (
              ordersBleutrade[0].quantity >= qntBid && 
              ordersBitrecife[0].quantity >= qnt && 
              ordersBTCBitrecife[0].quantity >= qntBTC
            ) {
              Bleutrade.getOpenOrders('BTC_USDT').then((data) => {
                if (data.data.result === null) {
                  // Venda
                  Bleutrade.setSellLimit('BTC_USDT', ordersBleutrade[0].rate, qntBid, false).then((data) => {
                    console.log(`Troca de BTC por USDT`);
                    setTimeout(() => {
                      //Transferir Bleutrade para Bitrecife
                      Bleutrade.setDirectTransfer('USDT', qntBid, 3, this.email).then((data) => {
                        console.log(`Enviando USDT para Bitrecife`);
                        // Venda
                        Bitrecife.setSellLimit('USDT_BRL', ordersBitrecife[0].rate, qnt, false).then((data) => {
                          console.log(`Troca de USDT por BRL`);
                          // Compra
                          Bitrecife.setBuyLimit('BTC_BRL', ordersBTCBitrecife[0].rate, qntBTC, false).then((data) => {
                            console.log(`Troca de BRL por BTC`);  
                            //Transferir Bitrecife para Bleutrade
                            Bitrecife.setDirectTransfer('BTC', qntBTC, 1, this.email).then((data) => {
                              console.log(`Enviando BTC para Bleutrade`);
                              process.exit()
                            });
                          });  
                        });
                      });
                    }, 400);
                  })
                } else {
                  console.log(`Moeda BTC_USDT está com ordem aberta`);
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
              console.log('Ganho:', qntBTC);
              console.log('Quantidade:', qnt);
              console.log('Livro Bleutrade:', this.formatNumber((ordersBleutrade[0].quantity * ordersBleutrade[0].rate), 8));
              console.log('Livro Bitrecife:', this.formatNumber((ordersBitrecife[0].quantity * ordersBitrecife[0].rate), 8));
              console.log(' ');
            }
          } else {
            console.log(`[Bleutrade - BTC_USDT]:`, this.formatNumber(qntBTC, 8))
          }
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
    // Exc.getOrderBook(symbol, 'ALL', 1).then((data) => {
    //   let book_exccripto = data.sell[0].Rate;
    //   // Oferta(s) na Bleutrade
    //   Bleutrade.getOrderBook(symbol, 'ALL', 1).then((data) => {
    //     let book_bleutrade = data.sell[0].Rate;
    //     // Verifica qual a menor compra, para possivel virada de exchange
    //     if (book_exccripto > book_bleutrade) {
    //       this.exchangeB(symbol, dividend);
    //     } else {
    //       this.exchangeA(symbol, dividend);
    //     }
    //   });
    // });
    this.exchangeC(symbol, dividend)

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
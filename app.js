'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Coins = require('./coins.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.fee_bl = 0.0025,
    this.fee_exc = 0.0025,
    this.entry = 0.00100000,
    this.min = 0.00020000,
    this.profit = null
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

  marketBTC(symbol, dividend) {
    // Saldo na Exc
    Exc.getBalance('BTC').then((data) => {
      this.entry = data.data.result[0].Balance;
      // Saldo na Bleu
      Bleutrade.getOrderBook(symbol, 'ALL', 3).then((bookBleu) => {
        this.gain = this.min;
        const qntAskBleu = this.gain * 0.9975;
        const qntAskFee = this.formatNumber(qntAskBleu, 8) / bookBleu.data.result.sell[0].Rate;
        const qntAskBleu_float = this.formatNumber(qntAskFee, 8);

        // Livro de ofertas exc
        Exc.getOrderBook(symbol, 'ALL', 3).then((bookExc) => {
          const qntBidUSDTExc = this.formatNumber((qntAskBleu_float * bookExc.data.result.buy[0].Rate) * (1 - 0.0025), 8);
          
          if (qntBidUSDTExc > this.gain) {
            if (bookBleu.data.result.sell[0].Quantity >= qntAskBleu_float && bookExc.data.result.buy[0].Quantity >= qntAskBleu_float) {
              //Transferir Exc para Bleu
              Exc.setDirectTransfer('BTC', this.gain, 1, 'tiago.a.trigo@gmail.com').then((data) => {
                console.log('Enviando BTC para Bleutrade');
                // Comprar na Bleu
                Bleutrade.setBuyLimit(symbol, bookBleu.data.result.sell[0].Rate, qntAskBleu_float, false).then((data) => {
                  console.log(`Troca de BTC por ${dividend}`);                    
                  
                  Bleutrade.getBalance(dividend).then((data) => {
                    const bleu = data.data.result[0].Balance;
                    // Transferir Bleu para Exc
                    Bleutrade.setDirectTransfer(dividend, bleu, 2, 'tiago.a.trigo@gmail.com').then((data) => {
                      console.log(`Enviando ${dividend} para Exccripto`);
                      // Vender na Exc
                      Exc.getBalance(dividend).then((data) => {
                        const exc = data.data.result[0].Balance;

                        Exc.setSellLimit(symbol, bookExc.data.result.buy[0].Rate, exc, false).then((data) => {
                          console.log(`Trocar de ${dividend} por BTC`);
                        });
                      });
                    });
                  });
                })
              });
              //
              console.log(' ');
            } else {
              console.log(' ');
              console.log('Status: A primeira ordem do livro está inferior ao meu saldo');
              console.log('Moeda:', symbol)
              console.log('Ganho:', qntBidUSDTExc);
              console.log('Livro Exc:', this.formatNumber((bookExc.data.result.buy[0].Quantity * bookExc.data.result.buy[0].Rate), 8));
              console.log('Livro Bleutrade:', this.formatNumber((bookBleu.data.result.sell[0].Quantity * bookBleu.data.result.sell[0].Rate), 8));
              console.log(' ');
            }
          } else {
            console.log('['+ symbol +']:', qntBidUSDTExc);
          }
        });
      });
    });
  }

  marketUSDT(symbol, dividend) {
    // Saldo na Exc
    Exc.getBalance('BTC').then((data) => {
      this.entry = data.data.result[0].Balance;
      
      // Vender BTC
      Bleutrade.getOrderBook('BTC_USDT', 'ALL', 3).then((data) => {
        this.gain = this.min;
        const qntBidBleu = this.formatNumber((this.gain * data.data.result.buy[0].Rate) * (1 - 0.0025), 8);
        
        // Comprar NBC, ETH e LTC
        Bleutrade.getOrderBook(symbol, 'ALL', 3).then((bookBleuUSDT) => {
          const qntAskBleu = qntBidBleu * 0.9975;
          const qntAskFee = this.formatNumber(qntAskBleu, 8) / bookBleuUSDT.data.result.sell[0].Rate;
          const qntAskBleu_float = this.formatNumber(qntAskFee, 8);

          // Vender NBC, ETH e LTC
          Bleutrade.getOrderBook(`${dividend}_BTC`, 'ALL', 3).then((bookBleuBTC) => {
            const qntBidBTC = this.formatNumber((qntAskBleu_float * bookBleuBTC.data.result.buy[0].Rate) * (1 - 0.0025), 8);
            
            if (qntBidBTC > this.gain) {
              console.log(' ');
              console.log('['+ symbol +']:', qntBidBTC);
              console.log('Ganho:', qntBidBTC);
              console.log(' ');
            } else {
              console.log('['+ symbol +']:', qntBidBTC);
            }
            
          });
        });
      });
    });
  }

  marketETH(symbol, dividend) {
    // Saldo na Exc
    Exc.getBalance('BTC').then((data) => {
      this.entry = data.data.result[0].Balance;
      
      // Comprar ETH
      Bleutrade.getOrderBook('ETH_BTC', 'ALL', 3).then((bookBleu) => {
        this.gain = this.min;
        const qntAskBleu = this.gain * 0.9975;
        const qntAskFee = this.formatNumber(qntAskBleu, 8) / bookBleu.data.result.sell[0].Rate;
        const qntAskBleu_float = this.formatNumber(qntAskFee, 8);
        
        // Comprar NBC, BCH e DASH
        Bleutrade.getOrderBook(symbol, 'ALL', 3).then((bookBleuETH) => {
          const qntAskETHBleu = qntAskBleu_float * 0.9975;
          const qntAskETHFee = this.formatNumber(qntAskETHBleu, 8) / bookBleuETH.data.result.sell[0].Rate;
          const qntAskETHBleu_float = this.formatNumber(qntAskETHFee, 8);
          
          // Vender NBC, BCH e DASH
          Bleutrade.getOrderBook(`${dividend}_BTC`, 'ALL', 3).then((bookBleuBTC) => {
            const qntBidBTC = this.formatNumber((qntAskETHBleu_float * bookBleuBTC.data.result.buy[0].Rate) * (1 - 0.0025), 8);
            
            if (qntBidBTC > this.gain) {
              if (bookBleu.data.result.sell[0].Quantity >= qntAskBleu_float) {
                //Transferir Exc para Bleu
                console.log(qntBidBTC)
                // Exc.setDirectTransfer('BTC', this.gain, 1, 'tiago.a.trigo@gmail.com').then((data) => {
                //   console.log('Enviando BTC para Bleutrade');
                //   // Comprar na Bleu
                //   Bleutrade.setBuyLimit('BTC_ETH', bookBleu.data.result.sell[0].Rate, qntAskBleu_float, false).then((data) => {
                //     console.log(`Troca de BTC por ${dividend}`);                    
                    
                //     Bleutrade.setBuyLimit(symbol, bookBleuETH.data.result.sell[0].Rate, qntAskETHBleu_float, false).then((data) => {
                //       console.log(`Troca de ETH por ${dividend}`);
                //       // Vender na Exc
                //       Bleutrade.getBalance(dividend).then((data) => {
                //         const balance_1 = data.data.result[0].Balance;

                //         Bleutrade.setSellLimit(symbol, bookBleuBTC.data.result.buy[0].Rate, balance_1, false).then((data) => {
                //           console.log(`Trocar de ${dividend} por BTC`);

                //           Bleutrade.getBalance('BTC').then((data) => {
                //             const balance_2 = data.data.result[0].Balance;
                            
                //             Bleutrade.setDirectTransfer('BTC', balance_2, 2, 'tiago.a.trigo@gmail.com').then((data) => {
                //               console.log('Enviando BTC para Exc');
                //             });
                //           });
                //         });
                //       });                      
                //     }); 
                //   })
                // });
                //
                console.log(' ');
              } else {
                console.log(' ');
                console.log('Status: A primeira ordem do livro está inferior ao meu saldo');
                console.log('Moeda:', symbol)
                console.log('Ganho:', qntBidBTC);
                console.log('Livro Bleutrade ETH:', this.formatNumber((bookBleuETH.data.result.buy[0].Quantity * bookBleuETH.data.result.buy[0].Rate), 8));
                console.log('Livro Bleutrade BTC:', this.formatNumber((bookBleuBTC.data.result.sell[0].Quantity * bookBleuBTC.data.result.sell[0].Rate), 8));
                console.log(' ');
              }
            } else {
              console.log('['+ symbol +']:', qntBidBTC);
            }
            
          });
        });
      });
    });
  }

  setup() {
    if (this.count >= Coins.length) this.count = 0;

    const { 
      symbol,
      dividend
    } = Coins[this.count];

    if (Coins[this.count].market === 'BTC') {
      this.marketBTC(symbol, dividend);
    } else if (Coins[this.count].market === 'USDT') {
      this.marketUSDT(symbol, dividend);
    } else if (Coins[this.count].market === 'ETH') {
      this.marketETH(symbol, dividend);
    }

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
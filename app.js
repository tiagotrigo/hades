'use stricts';

const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.entry = 20.00,
    this.fee_bl = 0.0025,
    this.fee_bt = 0.0040,
    this.balance = 0
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

  all() {
    Bitrecife.getBalance('BRL').then((real) => {
      const saldoBRLBitrecife = real.data.result[0].Balance;
      Bitrecife.getBalance('USDT').then((dolar) => {
        const saldoUSDTBitrecife = dolar.data.result[0].Balance;
        Bleutrade.getBalance('BTC').then((bitcoin) => {
          const saldoBTCBleutrade = bitcoin.data.result[0].Balance;
          Bitrecife.getBalance('BTC').then((bitcoin) => {
            const saldoBTCBitrecife = bitcoin.data.result[0].Balance;
            Bleutrade.getBalance('USDT').then((dolar) => {
              const saldoUSDTBleutrade = dolar.data.result[0].Balance;
              
              // BRL para USDT
              Bitrecife.getOrderBook('USDT_BRL', 'ALL', 10).then((bookUSDTBitrecife) => {
                const qntAskUSDTBitrecife = (48.47 * (1 - 0.004)) / bookUSDTBitrecife.data.result.sell[0].Rate;
                
                // USDT para BTC
                Bleutrade.getOrderBook('BTC_USDT', 'ALL', 10).then((bookBTCBleutrade) => {
                  const qntAskBTCBleutrade = (qntAskUSDTBitrecife / bookBTCBleutrade.data.result.sell[0].Rate) * (1 - 0.0025);
                  const qntAskBTCBleutrade_int = parseInt((qntAskBTCBleutrade * 100000000)) - 1;
                  const qntAskBTCBleutrade_float = qntAskBTCBleutrade_int / 100000000;

                  // BTC para BRL
                  Bitrecife.getOrderBook('BTC_BRL', 'ALL', 10).then((bookBRLBitrecife) => {
                    const qntBidBTCBitrecife = (qntAskBTCBleutrade_float * bookBRLBitrecife.data.result.buy[0].Rate) * (1 - 0.004);
                    const profit = ((qntBidBTCBitrecife - 48.47) / 48.47) * 100;
                    // Verificando a oportunidade
                    if (Math.sign(profit) === 1 && profit > 0.01) {
                      if (bookBTCBleutrade.data.result.sell[0].Quantity >= qntAskBTCBleutrade_float) {
                        // Comprando USDT
                        Bitrecife.setBuyLimit('USDT_BRL', bookUSDTBitrecife.data.result.sell[0].Rate, qntAskUSDTBitrecife, false).then((data) => {
                          console.log('Troca de BRL por USDT');
                          // Enviando USDT para Bleutrade
                          Bitrecife.setDirectTransfer('USDT', saldoUSDTBitrecife, 1, 'tiago.a.trigo@gmail.com').then((data) => {
                            console.log('Enviando USDT para Bleutrade');
                            // Comprando BTC
                            Bleutrade.setBuyLimit('BTC_USDT', bookBTCBleutrade.data.result.sell[0].Rate, qntAskBTCBleutrade_float, false).then((data) => {
                              console.log('Troca de USDT para BTC');
                              // Enviando BTC para Bitrecife
                              Bleutrade.setDirectTransfer('BTC', saldoBTCBleutrade, 3, 'tiago.a.trigo@gmail.com').then((data) => {
                                console.log('Enviando BTC para Bitrecife');
                                // Comprando BRL
                                Bitrecife.setSellLimit('BTC_BRL', bookBRLBitrecife.data.result.buy[0].Rate, saldoBTCBitrecife, false).then((data) => {
                                  console.log('Troca de BTC por BRL');
                                }).catch((er) => {
                                  console.log('Oops!');
                                });
                              }).catch((er) => {
                                console.log('Oops!');
                              });
                            }).catch((er) => {
                              console.log('Oops!');
                            });
                          }).catch((er) => {
                            console.log('Oops!');
                          });
                        }).catch((er) => {
                          console.log('Oops!');
                        });
                      } else {
                        console.log("Book inferior ao meu saldo");
                      }
                    } else {
                      console.log(profit + '%');
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  iniciar() {
    this.repetir(5000, 
      () => Promise.all([
        this.all()
      ])
    )
  }
}

new Hades().iniciar();
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

  toFix(num, precision) {
    const output = Math.pow(10, precision);
    return Math.floor((num * output)) / output;
  }

  primeiroCiclo() {
    Bitrecife.getBalance('BRL').then((data) => {
      let brl = data.data.result[0];
      
      if (parseInt(brl.Balance) >= 50) {
        Bitrecife.getOrderBook('USDT_BRL', 'ALL', 10).then((data) => {
          let book = data.data.result;
          let ask = book.sell[0].Rate;
          let qnt = (50 * (1 - 0.004)) / ask; // 50,00 - 0,20 = 49,80
          
          Bitrecife.setBuyLimit('USDT_BRL', ask, qnt, false).then((data) => {
            console.log('Troca de BRL por USDT');
            
            Bitrecife.getBalance('USDT').then((data) => {
              let usd = data.data.result[0]; 
              
              if (parseInt(usd.Balance) > 0) {
                Bitrecife.setDirectTransfer('USDT', usd.Balance, 1, 'tiago.a.trigo@gmail.com').then((data) => {
                  console.log('Enviando USDT para Bleutrade');
                }).catch((er) => {
                  console.log(er.message);
                });
              }
            }).catch((er) => {
              console.log(er.message);
            });
          }).catch((er) => {
            console.log(er.message);
          });
        }).catch((er) => {
          console.log(er.message);
        });
      } else {
        Bitrecife.getBalance('USDT').then((data) => {
          let usd = data.data.result[0];
          
          if (parseInt(usd.Balance) > 0) {
            Bitrecife.setDirectTransfer('USDT', usd.Balance, 1, 'tiago.a.trigo@gmail.com').then((data) => {
              console.log('Enviando USDT para Bleutrade');
            }).catch((er) => {
              console.log(er.message);
            });
          }
        }).catch((er) => {
          console.log(er.message)
        });
      }
    }).catch((er) => {
      console.log(er.message);
    });    
  }

  segundoCiclo() {
    Bleutrade.getBalance('USDT').then((data) => {
      let usd = data.data.result[0];

      if (parseInt(usd.Balance) > 0) {
        Bleutrade.getOrderBook('BTC_USDT', 'ALL', 10).then((book) => {                     
          let qnt_BTC = (usd.Balance / book.data.result.sell[0].Rate) * (1 - 0.0025);
          let qnt_BTC_int = parseInt((qnt_BTC * 100000000)) - 1;
          let qnt_BTC_float = qnt_BTC_int / 100000000;

          if ((book.data.result.sell[0].Quantity * book.data.result.sell[0].Rate) >= usd.Balance) {
            Bleutrade.getOpenOrders('BTC_USDT').then((data) => {
              let orders = data.data.result;

              if (orders && orders[0].Status === 'OPEN') {
                console.log('Ordem de compra aberta');
              } else {
                Bleutrade.setBuyLimit('BTC_USDT', book.data.result.sell[0].Rate, qnt_BTC_float, false).then((data) => {
                  console.log('Troca de USDT para BTC');
                }).catch((er) => {
                  console.log(er.message);
                });
              }
            }).catch((er) => {
              console.log(er.message);
            });
          } else {
            console.log('A primeira ordem é menor que o saldo');
          }
        }).catch((er) => {
          console.log(er.message)
        });
      }
    }).catch((er) => {
      console.log(er.message);
    });
  }

  terceiroCiclo() {
    Bleutrade.getBalance('BTC').then((data) => {
      // Saldo em bitcoin da Bleutrade
      let saldoBitcoinBleutrade = data.data.result[0];
      // Enviar para Bitrecife
      if (parseFloat(saldoBitcoinBleutrade.Balance) > 0.0005) {
         Bleutrade.setDirectTransfer('BTC', saldoBitcoinBleutrade.Balance, 3, 'tiago.a.trigo@gmail.com').then((data) => {
          console.log('Enviando BTC para Bitrecife');
        }).catch((er) => {
          console.log(er.message);
        });
      } else {        
        Bitrecife.getBalance('BTC').then((data) => {
          let saldoBitcoinBitrecife = data.data.result[0];
          
          Bitrecife.getOrderBook('BTC_BRL', 'ALL', 10).then((data) => {
            let bookBitcoinBitrecife = data.data.result;
            let qntRealBitrecife = (saldoBitcoinBitrecife.Balance * bookBitcoinBitrecife.buy[0].Rate) * (1 - 0.004);
            // Verifica se a ordem é maior ou igual ao meu saldo
            if (bookBitcoinBitrecife.buy[0].Quantity >= saldoBitcoinBitrecife.Balance && this.toFix(qntRealBitrecife, 2) > 50) {
              Bitrecife.setSellLimit('BTC_BRL', bookBitcoinBitrecife.buy[0].Rate, saldoBitcoinBitrecife.Balance, false).then((data) => {
                console.log('Troca de BTC por BRL');
              }).catch((er) => {
                console.log(er.message);
              });
            } else {
              console.log(this.toFix(qntRealBitrecife - 50, 2));
            }
          });
        }).catch((er) => {
          console.log(er.message);
        });
      }
    }).catch((er) => {
      console.log(er.message)
    });
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
              Bitrecife.getOrderBook('USDT_BRL', 'ALL', 10).then((book) => {
                const qntAskUSDTBitrecife = (50 * (1 - 0.004)) / book.data.result.sell[0].Rate;
                
                // USDT para BTC
                Bleutrade.getOrderBook('BTC_USDT', 'ALL', 10).then((book) => {
                  const qntAskBTCBleutrade = (qntAskUSDTBitrecife / book.data.result.sell[0].Rate) * (1 - 0.0025);
                  const qntAskBTCBleutrade_int = parseInt((qntAskBTCBleutrade * 100000000)) - 1;
                  const qntAskBTCBleutrade_float = qntAskBTCBleutrade_int / 100000000;

                  // BTC para BRL
                  Bitrecife.getOrderBook('BTC_BRL', 'ALL', 10).then((book) => {
                    const qntBidBTCBitrecife = (qntAskBTCBleutrade_float * book.data.result.buy[0].Rate) * (1 - 0.004);
                    const profit = ((qntBidBTCBitrecife - 50) / 50) * 100;
                    // Verificando a oportunidade
                    if (Math.sign(profit) === 1 && this.toFix(profit, 2) > 0.01) {
                      console.log('Lucro', profit);
                    } else {
                      console.log(this.toFix(profit, 2)+'%')
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
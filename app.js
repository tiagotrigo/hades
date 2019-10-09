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
          
          if (parseFloat(saldoBitcoinBitrecife.Balance) > 0.0005) {
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
                console.log('R$', this.toFix(qntRealBitrecife - 50, 2));
              }
            });
          } else {
            console.log('Sem saldo em Bitcoin na Bitrecife')
          }
        }).catch((er) => {
          console.log(er.message);
        });
      }
    }).catch((er) => {
      console.log(er.message)
    });
  }

  iniciar() {
    this.repetir(5000, 
      () => Promise.all([
        this.primeiroCiclo(),
        this.segundoCiclo(),
        this.terceiroCiclo()
      ])
    )
  }
}

new Hades().iniciar();
'use stricts';

const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.entry = 20.00,
    this.fee_bl = 0.0025,
    this.fee_bt = 0.0040
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

  primeiroCiclo() {
    Bitrecife.getBalance('BRL').then((data) => {
      let brl = data.data.result[0];
      
      if (parseInt(brl.Balance) > 0) {
        Bitrecife.getOrderBook('USDT_BRL', 'ALL', 1).then((data) => {
          let book = data.data.result;
          let ask = book.sell[0].Rate;
          let qnt = (21.60 / ask) * (1 - 0.0040);
          
          Bitrecife.setBuyLimit('USDT_BRL', ask, qnt, false).then((data) => {
            console.log('Troca de BRL para USDT');
            
            Bitrecife.getBalance('USDT').then((data) => {
              let usd = data.data.result[0]; 
              
              if (parseInt(usd.Balance) > 0) {
                Bitrecife.setDirectTransfer('USDT', usd.Balance, 1, 'tiago.a.trigo@gmail.com').then((data) => {
                  console.log('Transferindo USDT para Bleutrade');
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
              console.log('Transferindo USDT para Bleutrade');
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
        Bleutrade.getTicker('BTC_USDT').then((data) => {
          let ticker = data.data.result[0];
          // Calculando a quantidade em Bitcoins
          let qnt_BTC = (usd.Balance / ticker.Ask) * (1 - 0.0025);
          let qnt_BTC_int = parseInt((qnt_BTC * 100000000)) - 1;
          let qnt_BTC_float = qnt_BTC_int / 100000000;

          Bleutrade.getOpenOrders('BTC_USDT').then((data) => {
            let orders = data.data.result;
            
            if (orders && orders.Status === 'OPEN') {
              console.log('Ordem de compra aberta');
            } else {
              Bleutrade.setBuyLimit('BTC_USDT', ticker.Ask, qnt_BTC_float, false).then((data) => {
                console.log('Troca de USDT para BTC');
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
      }
    }).catch((er) => {
      console.log(er.message);
    });
  }

  terceiroCiclo() {
    Bleutrade.getBalance('BTC').then((data) => {
      let bleuBTC = data.data.result[0];

      if (bleuBTC.Balance > 0.0005) {
        Bitrecife.getTicker('BTC_BRL').then((data) => {
          let ticker = data.data.result[0];
          let qnt = (bleuBTC.Balance * ticker.Bid) * (1 - 0.0040);
          let profit = ((qnt - 21.60) * 100) / qnt;

          if (Math.sign(profit) === 1 && profit >= 0.01) {
            Bleutrade.setDirectTransfer('BTC', bleuBTC.Balance, 3, 'tiago.a.trigo@gmail.com').then((data) => {
              console.log('Transferindo BTC para Bitrecife');
              
              Bitrecife.getBalance('BTC').then((data) => {
                let bitBTC = data.data.result[0];

                Bitrecife.setSellLimit('BTC_BRL', ticker.Bid, bitBTC.Balance, false).then((data) => {
                  console.log('Troca de BTC por BRL');
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
            console.log(profit);
          }
        }).catch((er) => {
          console.log(er.message);
        });
      } 
    }).catch((er) => {
      console.log(er.message);
    })
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
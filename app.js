'use stricts';

const R = require('ramda');
const await = require('await');
const colors = require('colors/safe');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const sprintf = require("sprintf-js").sprintf;

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

  async primeiroCiclo() {
    // BRL
    await Bitrecife.getBalance('BRL', async function(er, brl) {
      if (!er) {
        console.log('Error 1: getBalance');
        return;
      }
      if (parseInt(brl.Balance) > 5) {
        await Bitrecife.getOrderBook('USDT_BRL', 'ALL', 1, async function(er, book) {
          if (!er) {
            console.log('Error 1: getOrderBook');
            return;
          }
          // Compra de USDT ( ASK )
          const qnt_usd = (21.60 / book.sell[0].Rate) * (1 - 0.0040);
          // Ordem de compra ( ASK )
          await Bitrecife.setBuyLimit('USDT_BRL', book.sell[0].Rate, qnt_usd, false, async function(er, buy) {
            if (!er) {
              console.log('Error 1: setBuyLimit');
              return;
            }
            console.log('Troca de BRL para USDT');
            // USDT
            await Bitrecife.getBalance('USDT', async function(er, usd) {
              if (!er) {
                console.log('Error 1: getBalance');
                return;
              }
              if (parseInt(usd.Balance) > 5) {
                // Direct Transfer
                await Bitrecife.setDirectTransfer('USDT', usd.Balance, 1, 'tiago.a.trigo@gmail.com', async function(er, direct) {
                  if (!er) {
                    console.log('Error 1: setDirectTransfer');
                    return;
                  }
                  console.log('Transferindo USDT para Bleutrade');
                })
              }
            });
          });
        });
      }
    });    
  }

  async segundoCiclo() {
    await Bleutrade.getBalance('USDT', async function(er, usd) {
      if (!er) {
        console.log('Error 2: getBalance');
        return;
      }
      // USDT
      if (parseInt(usd.Balance) > 5) {
        await Bleutrade.getTicker('BTC_USDT', async function(er, ticker) {
          if (!er) {
            console.log('Error 2: getTicker');
            return;
          }
          // Calculando fee
          const qnt_BTC = (usd.Balance / ticker.Ask) * (1 - 0.0025);
          const qnt_BTC_int = parseInt((qnt_BTC * 100000000)) - 1;
          const qnt_BTC_float = qnt_BTC_int / 100000000;
          // Compra de BTC ( Ask )
          await Bleutrade.getOpenOrders('BTC_USDT', async function(er, orders) {
            if (!er) {
              console.log('Erro 2: getOpenOrders');
              return;
            }
            if (orders.Status === 'OPEN') {
              console.log('Cancelando ordem');
              await Bleutrade.setOrderCancel(orders.OrderID, async function(er, cancel) {
                if (!er) {
                  console.log('Erro 2: setOrderCancel');
                  return;
                }
                await Bleutrade.setBuyLimit('BTC_USDT', ticker.Ask, qnt_BTC_float, false, async function(er, buy) {
                  if (!er) {
                    console.log('Error 2: setBuyLimit');
                    return
                  }
                  console.log('Reativando troca de USDT para BTC');
                });
              })
            } else {
              await Bleutrade.setBuyLimit('BTC_USDT', ticker.Ask, qnt_BTC_float, false, async function(er, buy) {
                if (!er) {
                  console.log('Error 2: setBuyLimit');
                  return
                }
                console.log('Troca de USDT para BTC');
              });
            }
          });
        });
      }
    });
  }

  async terceiroCiclo() {
    await Bleutrade.getBalance('BTC', async function(er, bleuBTC) {
      if (!er) {
        console.log('Error 3: getBalance');
        return;
      }
      if (bleuBTC.Balance > 0.0005) {
        await Bitrecife.getTicker('BTC_BRL', async function(er, ticker) {
          if (!er) {
            console.log('Error 3: getTicker')
            return;
          }
          // Calculo do fee
          const qnt_BRL = (bleuBTC.Balance * ticker.Bid) * (1 - 0.0040);
          // Lucro
          const profit = ((qnt_BRL - 21.60) * 100) / qnt_BRL;
          // Procurando oportunidade
          if (Math.sign(profit) === 1 && profit >= 0.01) {
            await Bleutrade.setDirectTransfer('BTC', bleuBTC.Balance, 3, 'tiago.a.trigo@gmail.com', async function(er, direct) {
              if (!er) {
                console.log('Error 3: setDirectTransfer');
                return;
              }
              console.log('Transferindo BTC para Bitrecife');
              await Bitrecife.getBalance('BTC', async function(er, bitBTC) {
                if (!er) {
                  console.log('Error 3: getBalance');
                  return;
                }
                await Bitrecife.setSellLimit('BTC_BRL', ticker.Bid, bitBTC.Balance, false, async function(er, sell) {
                  if (!er) {
                    console.log('Error: setSellLimit');
                    return;
                  }
                  console.log('Troca de BTC por BRL');
                });
              });
            });
          } else {
            console.log(profit);
          }
        });
      } 
    });
  }

  async iniciar() {
    this.repetir(5000, () => Promise.all([
      this.primeiroCiclo(),
      this.segundoCiclo(),
      this.terceiroCiclo()
    ]))
  }
}

new Hades().iniciar();
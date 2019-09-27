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
        console.log('Error 1: getBalance', brl);
        return;
      }
      if (parseInt(brl.Balance) > 0) {
        await Bitrecife.getOrderBook('USDT_BRL', 'ALL', 1, async function(er, book) {
          if (!er) {
            console.log('Error 1: getOrderBook');
            return;
          }
          // Compra de USDT ( ASK )
          const qnt_usd = (brl.Balance / book.sell[0].Rate) * (1 - 0.0040);
          // Ordem de compra ( ASK )
          await Bitrecife.setBuyLimit('USDT_BRL', book.sell[0].Rate, qnt_usd, false, async function(er, buy) {
            if (!er) {
              console.log('Error 1: setBuyLimit');
              return;
            }
            console.log(' ');
            console.log('Troca de BRL para USDT');
            // USDT
            await Bitrecife.getBalance('USDT', async function(er, usd) {
              if (!er) {
                console.log('Error 1: getBalance');
                return;
              }
              if (parseInt(usd.Balance) > 0) {
                // Direct Transfer
                await Bitrecife.setDirectTransfer('USDT', usd.Balance, 1, 'tiago.a.trigo@gmail.com', async function(er, direct) {
                  if (!er) {
                    console.log('Error 1: setDirectTransfer');
                    return;
                  }
                  console.log('Transferindo USDT para Bleutrade');
                  console.log(' ');
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
      if (parseInt(usd.Balance) > 0) {
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
          await Bleutrade.setBuyLimit('BTC_USDT', ticker.Ask, qnt_BTC_float, false, async function(er, buy) {
            if (!er) {
              console.log('Error 2: setBuyLimit');
              return
            }
            console.log(' ');
            console.log('Troca de USDT para BTC');
          });
        });
      }
    });
  }

  async terceiroCiclo() {
    await Bleutrade.getBalance('BTC', async function(er, btc) {
      if (!er) {
        console.log('Error 3: getBalance');
        return;
      }
      if (btc.Balance > 0.0006) {
        await Bitrecife.getTicker('BTC_BRL', async function(er, ticker) {
          if (!er) {
            console.log('Error 3: getTicker')
            return;
          }
          // Calculo do fee
          const qnt_BRL = (btc.Balance * ticker.Bid) * (1 - 0.0040);
          // Lucro
          const profit = ((qnt_BRL - 21.95) * 100) / qnt_BRL;
          // Procurando oportunidade
          if (Math.sign(profit) === 1 && profit >= 0.01) {
            console.log('arbitragem', profit);
          } else {
            console.log(profit);
          }
        });
      } 
    });
  }

  async iniciar() {
    await this.primeiroCiclo();
    await this.segundoCiclo();
    await this.terceiroCiclo();
  }
}

new Hades().iniciar();
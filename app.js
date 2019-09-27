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
        console.log('Error: getBalance');
        return;
      }
      if (brl.Balance > 1) {
        await Bitrecife.getOrderBook('USDT_BRL', 'ALL', 1, async function(er, book) {
          if (!er) {
            console.log('Error: getOrderBook');
            return;
          }
          // Compra de USDT ( ASK )
          const qnt_usd = (brl.Balance / book.sell[0].Rate) * (1 - 0.0040);
          // Ordem de compra ( ASK )
          await Bitrecife.setBuyLimit('USDT_BRL', book.sell[0].Rate, qnt_usd, false, async function(er, buy) {
            if (!er) {
              console.log('Error: setBuyLimit');
              return;
            }
            console.log(' ');
            console.log('Troca de BRL para USDT');
            // USDT
            await Bitrecife.getBalance('USDT', async function(er, usd) {
              if (!er) {
                console.log('Error: getBalance');
                return;
              }
              if (usd.Balance > 1) {
                // Direct Transfer
                await Bitrecife.setDirectTransfer('USDT', usd.Balance, 1, 'tiago.a.trigo@gmail.com', async function(er, direct) {
                  if (!er) {
                    console.log('Error: setDirectTransfer');
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
        console.log('Error: getBalance');
        return;
      }
      // USDT
      if (usd.Balance > 1) {
        await Bleutrade.getTicker('BTC_USDT', async function(er, ticker) {
          if (!er) {
            console.log('Error: getTicker');
            return;
          }
          // Calculando fee
          const qnt_BTC = (usd.Balance / ticker.Ask) * (1 - 0.0025);
          const qnt_BTC_int = parseInt((qnt_BTC * 100000000)) - 1;
          const qnt_BTC_float = qnt_BTC_int / 100000000;
          // Compra de BTC ( Ask )
          await Bleutrade.setBuyLimit('BTC_USDT', ticker.Ask, qnt_BTC_float, false, async function(er, buy) {
            if (!er) {
              console.log('Error: setBuyLimit');
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
    
  }

  async iniciar() {
    await this.primeiroCiclo();
    await this.segundoCiclo();
  }
}

new Hades().iniciar();
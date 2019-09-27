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
      if (brl.Balance > 5) {
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
              if (usd.Balance > qnt_usd) {
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
    
  }

  async iniciar() {
    await this.primeiroCiclo()
  }
}

new Hades().iniciar();
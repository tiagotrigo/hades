'use stricts';

const R = require('ramda');
const await = require('await');
const Telegram = require('./telegram');
const Bleutrade = require('./bleutrade');
const Arbitrations = require('./arbitration');

class Hades {
  
  constructor() {
    this.mail = 'tiago.a.trigo@gmail.com'
  }

  mask(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  calcQntBuy(entry, price, fee) {
    const quantity = (entry * fee) / price;
    return this.mask(quantity, 8); 
  }

  calcQntSell(entry, price, fee) {
    const quantity = (entry * price) * (1 - fee);
    return this.mask(quantity, 8);
  }

  async calcQntOutput(arbitration) {    
    for (const [i, walk] of arbitration.walks.entries()) {
      // Livro de ofertas
      const book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 3);
      
      if (i === 0) {
        if (walk.action === 'sell') {
          walk.price = book.buy[0].Rate;
          walk.quantity = this.calcQntSell(arbitration.entry, walk.price, walk.fee);          
          walk.opportunity = walk.quantity > book.buy[0].Quantity;
        } else {
          walk.price = book.sell[0].Rate;
          walk.quantity = this.calcQntBuy(arbitration.entry, walk.price, walk.fee);
          walk.opportunity = walk.quantity > book.sell[0].Quantity;
        }
      } else if (i === (arbitration.walks.length - 1)) {
        if (walk.action === 'sell') {
          walk.price = book.buy[0].Rate;
          walk.quantity = arbitration.walks[i - 1].quantity;
          walk.book = walk.quantity > book.buy[0].Quantity;
        } else {
          walk.price = book.sell[0].Rate;
          walk.quantity = arbitration.walks[i - 1].quantity;
          walk.opportunity = walk.quantity > book.sell[0].Quantity;
        }                
      } else {
        if (walk.action === 'sell') {
          walk.price = book.buy[0].Rate;
          walk.quantity = this.calcQntSell(arbitration.walks[i - 1].quantity, walk.price, walk.fee);
          walk.opportunity = walk.quantity > book.buy[0].Quantity;
        } else {
          walk.price = book.sell[0].Rate;
          walk.quantity = this.calcQntBuy(arbitration.walks[i - 1].quantity, walk.price, walk.fee);
          walk.opportunity = walk.quantity > book.sell[0].Quantity;
        }
      }
    }
  }

  calcProfitOutput(arbitration) {
    const { 
      walks 
    } = arbitration;

    let output = 0;

    if (walks[walks.length - 1].action === 'sell') {
      output = this.calcQntSell(walks[walks.length - 1].quantity, walks[walks.length - 1].price, walks[walks.length - 1].fee);
    } else {
      output = this.calcQntBuy(walks[walks.length - 1].quantity, walks[walks.length - 1].price, walks[walks.length - 1].fee);
    }

    return this.mask(output, 8);
  }

  async rebalancingBalance(walk, entry) {
    await Bleutrade.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
    console.log(`Enviando ${walk.receive.asset}(${entry}) da Bleutrade para ${walk.exchangeto}`);
  }

  async opportunityTakerBuy(walk, entry) {
    let quote = walk.quote === 'BTC' || walk.quote === 'USDT';
    // Comprar
    await walk.exchange.setBuyLimit(walk.symbol, walk.price, quote ? entry : walk.quantity);
    console.log(`Troca de ${walk.base} por ${walk.quote}(${walk.quantity})`);
    // É preciso transferir ?
    if (walk.transfer) {
      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
    }
  }

  async opportunityTakerSell(walk, entry) {
    let quote = walk.quote === 'BTC' || walk.quote === 'USDT';
    // Vender
    await walk.exchange.setSellLimit(walk.symbol, walk.price, quote ? entry : walk.quantity);
    console.log(`Troca de ${walk.quote}(${walk.quantity}) por ${walk.base}`);                   
    // É preciso transferir ?
    if (walk.transfer) {
      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
    }
  }

  async run() {
    do {
      try {
        for (const [i, arbitration] of Arbitrations.entries()) {
          const { walks } = arbitration;
          // Calculando a quantidade
          await this.calcQntOutput(arbitration);
          // Verificando se a lucro
          const profit = this.calcProfitOutput(arbitration);

          if (profit > arbitration.entry) {
            const watch = R.filter((n) => n.opportunity === false, walks);
            if (watch.length > 0) {
              console.log('Ordem inferior');
            } else {   
              for (const walk of walks) {
                // Se for Bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    // Vender
                    await this.opportunityTakerSell(walk, arbitration.entry);
                  } else if (walk.action === 'buy') {
                    // Comprar
                    await this.opportunityTakerBuy(walk, arbitration.entry);                    
                  }
                } else {
                  // Se for diferente de Bleutrade
                  if (walk.receive === null) {
                    if (walk.action === 'sell') {
                      // Vender
                      await this.opportunityTakerSell(walk, arbitration.entry);
                    } else if (walk.action === 'buy') {
                      // Comprar
                      await this.opportunityTakerBuy(walk, arbitration.entry);                    
                    }
                  } else {
                    // Enviando BTC ou USDT para outras exchanges
                    await this.rebalancingBalance(walk, arbitration.entry);

                    if (walk.action === 'sell') {
                      // Vender
                      await this.opportunityTakerSell(walk, arbitration.entry);
                    } else if (walk.action === 'buy') {
                      // Comprar
                      await this.opportunityTakerBuy(walk, arbitration.entry);                    
                    }
                  }
                }
              } 
            }
          } else {
            console.log(profit);
          }
        }  
        // process.exit();      
      } catch(e) {
        console.log(e.message)
      }
    } while (true);
  }
}

new Hades().run();
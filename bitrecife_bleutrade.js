'use stricts';

const R = require('ramda');
const await = require('await');
const Arb = require('./arbitration');
const Telegram = require('./telegram');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.sum = null,
    this.mail = 'tiago.a.trigo@gmail.com'
  }

  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  repeat(ms, func) {
    return new Promise((resolve) => (
      setInterval(func, ms), 
      this.wait(ms).then(resolve)
    ));
  }

  mask(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  calcQntBuy(amount, rate, fee) {
    let tax = amount * fee;
    let profit = this.mask(tax, 8) / rate;   

    return this.mask(profit, 8);    
  }

  calcQntSell(amount, rate, fee) {
    let tax = (amount * rate) * (1 - fee);
    return this.mask(tax, 8);
  } 

  calcDistributingValue(exchange, book, walk, index) {
    let qnt = 0.0;
    let order = null;

    if (index === 0) {
      if (walk.action === 'sell') {
        order = book.buy[0].Rate;
        qnt = this.calcQntSell(exchange.entry, order, walk.fee);
      } else {
        order = book.sell[0].Rate;
        qnt = this.calcQntBuy(exchange.entry, order, walk.fee);
      }
    } else if (index === 1) {
      if (walk.action === 'sell') {
        order = book.buy[0].Rate;
        qnt = this.calcQntSell(exchange.walks[0].quantity, order, walk.fee);
      } else {
        order = book.sell[0].Rate;
        qnt = this.calcQntBuy(exchange.walks[0].quantity, order, walk.fee);
      }
    } else if (index === 2) {
      if (walk.action === 'sell') {
        order = book.buy[0].Rate;
        qnt = this.calcQntSell(exchange.walks[1].quantity, order, walk.fee);
      } else {
        order = book.sell[0].Rate;
        qnt = this.calcQntBuy(exchange.walks[1].quantity, order, walk.fee);
      }
    } else if (index === 3) {
      if (walk.action === 'sell') {
        order = book.buy[0].Rate;
        qnt = this.calcQntSell(exchange.walks[2].quantity, order, walk.fee);
      } else {
        order = book.sell[0].Rate;
        qnt = this.calcQntBuy(exchange.walks[2].quantity, order, walk.fee);
      }
    }

    if (order && qnt) {
      return {
        price: order,
        quantity: qnt        
      }
    } else {
      console.log('Erro de quantidade e preço');
    }
  }

  async run() {
    do {
      for (let [x, arb] of Arb.entries()) {
        for (let [y, walk] of arb.walks.entries()) {
          try {
            let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 6);
            let resp = this.calcDistributingValue(arb, book, walk, y);
            //
            walk.price = resp.price;
            walk.quantity = resp.quantity;
            walk.sum = R.filter((n) => n.Quantity > resp.quantity, walk.action === 'buy' ? book.sell : book.buy)
          } catch(e) {
            console.log(e);
          }
        }
        //
        const {
          id,
          name,
          entry,
          walks
        } = arb;

        if (walks[walks.length - 1].quantity > entry) {          
          try {
            // Rotinas
            for (let [z, walk] of walks.entries()) {
              // Verificando o livro de ofertas
              let book = await walk.exchange.getOrderBook(walk.market, walk.action === 'buy' ? 'SELL' : 'BUY', 6);
              // Verificando a ação 
              let order = walk.action === 'buy' ? book.sell : book.buy;
              
              if (order[0].Quantity > walk.quantity) {
                walk.sum = [{
                  Rate: order[1].Rate,
                  Quantity: order[1].Quantity
                }]
              } else if (order[1].Quantity > walk.quantity) {
                walk.sum = [{
                  Rate: order[2].Rate,
                  Quantity: order[2].Quantity
                }]
              } else if (order[2].Quantity > walk.quantity) {
                walk.sum = [{
                  Rate: order[3].Rate,
                  Quantity: order[3].Quantity
                }]
              }
              //Verificando o primeiro passo
              if (z === 0) {
                // 1 - Se for Bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.sum[0].Rate, walk.quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  } else {
                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.sum[0].Rate, walk.quantity);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  // Se o primeiro passo não for Bleutrade
                  if (walk.receive != null) {
                    // Tire BTC ou USDT da Bleutrade para a próxima exchange
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                    await this.wait(1000);

                    if (walk.action === 'sell') {
                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].Rate, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].Rate, walk.quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);                     
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    if (walk.action === 'sell') {
                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].Rate, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].Rate, walk.quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }         
                }
              } else {
                // Verificando o restante dos passos
                // 1 - Se for Bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.sum[0].Rate, arb.walks[z - 1].quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  } else {
                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.sum[0].Rate, arb.walks[z - 1].quantity);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  // Se o primeiro passo não for Bleutrade
                  // Ele precisa receber BTC ou USDT ? Se sim, enviar
                  if (walk.receive != null) {
                    // Tire BTC ou USDT da Bleutrade para a próxima exchange
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                    await this.wait(1000);

                    if (walk.action === 'sell') {
                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].Rate, arb.walks[z - 1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].Rate, arb.walks[z - 1].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    // 2 - Comprar ou vender
                    if (walk.action === 'sell') {
                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].Rate, arb.walks[z - 1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].Rate, arb.walks[z - 1].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }            
                }
              }
              // Enviando todo o saldo para a Bleutrade
              if (walk.exchangeto != 1) {
                let wallet = await walk.exchange.getBalances();
                let balance = R.filter((n) => n.Balance >= 0.00001 && (n.Asset === walk.divisor), wallet.data.result);
                
                if (balance.length > 0) {
                  await walk.exchange.setDirectTransfer(balance[0].Asset, balance[0].Balance, 1, 'tiago.a.trigo@gmail.com')
                  this.wait(1000);
                }
              }              
              // Telegram
              if (z === (walks.length - 1)) {
                await Telegram.sendMessage(`[${name}]: ${walks[walks.length - 1].quantity}`);
                console.log('Notificando por telegram');
              }              
            }
            // process.exit();
          } catch(e) {
            console.log(e);
          }
        } else {
          console.log(`[${name}]:`, walks[walks.length - 1].quantity);
        }
      }
    } while (true);
  }
}

new Hades().run();
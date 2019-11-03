'use stricts';

const R = require('ramda');
const await = require('await');
const Arb = require('./arbitration');
const Telegram = require('./telegram');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
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
            let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 5);
            let resp = this.calcDistributingValue(arb, book, walk, y);
            // Atualizando o preço
            walk.price = resp.price;
            walk.quantity = resp.quantity;
            // Soma do book
            for (let item of walk.action === 'buy' ? book.sell : book.buy) {
              if ((item.Quantity * item.Rate) >= arb.entry) {
                walk.sum = R.append({
                  rate: item.Rate,
                  quantity: item.Quantity,
                  sum: item.Quantity * item.Rate
                }, walk.sum);  
              }
            }            
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
              let openOrder = await walk.exchange.getOpenOrders(walk.market);
              if (openOrder.data.result === null) {
                // Verificando o primeiro passo
                if (z === 0) {
                  // 1 - Se for Bleutrade
                  if (walk.exchangeto === 1) {
                    // 2 - Comprar ou vender
                    if (walk.action === 'sell') {
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      await this.wait(1000);
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                        await this.wait(1000);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, walk.quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      await this.wait(1000);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                        await this.wait(1000);
                      }
                    }
                  } else {
                    // Se o primeiro passo não for Bleutrade
                    if (walk.receive != null) {
                      // Tire BTC ou USDT da Bleutrade para a próxima exchange
                      await Bleutrade.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
                      console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                      await this.wait(1000);
                      // 2 - Comprar ou vender
                      if (walk.action === 'sell') {
                        await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, walk.quantity);
                        console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                        await this.wait(1000);
                        // 3 - Transferir caso precise
                        if (walk.transfer) {
                          await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                          console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                          await this.wait(1000);
                        }
                      } else {
                        // 2 - Comprar ou vender
                        await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, walk.quantity);
                        console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                        await this.wait(1000);
                        // 3 - Transferir caso precise
                        if (walk.transfer) {
                          await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                          console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                          await this.wait(1000);
                        }
                      }
                    } else {
                      // 2 - Comprar ou vender
                      if (walk.action === 'sell') {
                        await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, walk.quantity);
                        console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                        await this.wait(1000);
                        // 3 - Transferir caso precise
                        if (walk.transfer) {
                          await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                          console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                          await this.wait(1000);
                        }
                      } else {
                        // 2 - Comprar ou vender
                        await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, walk.quantity);
                        console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                        await this.wait(1000);
                        // 3 - Transferir caso precise
                        if (walk.transfer) {
                          await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                          console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                          await this.wait(1000);
                        }
                      }
                    }         
                  }
                } else {
                  // Verificando o restante dos passos
                  // 1 - Se for Bleutrade
                  if (walk.exchangeto === 1) {
                    // 2 - Comprar ou vender
                    if (walk.action === 'sell') {
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      await this.wait(1000);
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                        await this.wait(1000);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      await this.wait(1000);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                        await this.wait(1000);
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
                      // 2 - Comprar ou vender
                      if (walk.action === 'sell') {
                        await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                        console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                        await this.wait(1000);
                        // 3 - Transferir caso precise
                        if (walk.transfer) {
                          await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                          console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                          await this.wait(1000);
                        }
                      } else {
                        // 2 - Comprar ou vender
                        await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                        console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                        await this.wait(1000);
                        // 3 - Transferir caso precise
                        if (walk.transfer) {
                          await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                          console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                          await this.wait(1000);
                        }
                      }
                    } else {
                      // 2 - Comprar ou vender
                      if (walk.action === 'sell') {
                        await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                        console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                        await this.wait(1000);
                        // 3 - Transferir caso precise
                        if (walk.transfer) {
                          await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                          console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                          await this.wait(1000);
                        }
                      } else {
                        // 2 - Comprar ou vender
                        await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                        console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                        await this.wait(1000);
                        // 3 - Transferir caso precise
                        if (walk.transfer) {
                          await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                          console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                          await this.wait(1000);
                        }
                      }
                    }            
                  }
                }
              } else {
                console.log(`[${name}]:`, 'Ordem aberta');
              }
            }
            //process.exit();
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
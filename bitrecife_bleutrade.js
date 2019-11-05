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
    let collection, sum = [];

    do {
      for (let [x, arb] of Arb.entries()) {
        for (let [y, walk] of arb.walks.entries()) {
          try {
            let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 6);
            let resp = this.calcDistributingValue(arb, book, walk, y);
            //
            walk.price = resp.price;
            walk.quantity = resp.quantity; 

            for (let item of walk.action === 'buy' ? book.sell : book.buy) {
              walk.sum = R.append({
                rate: item.Rate,
                quantity: item.Quantity,
                sum: item.Rate * item.Quantity
              }, walk.sum);
            }

            walk.sum = R.filter((n) => n.sum > arb.entry, walk.sum);
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
              // Ordem aberta
              let open = await walk.exchange.getOpenOrders(walk.market);
              // Verificando se existe ordem
              if (open.data.result != null) {
                // if (open.data.result[0].Type === 'SELL') {
                //   await walk.exchange.setOrderCancel(open.data.result[0].OrderId);
                //   console.log(`Cancelando a ordem e enviando para exchange ${walk.exchangeto}`);

                //   await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, walk.quantity);
                //   console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);  
                // }
                console.log(' ');
                console.log(`[${name}]:`);
                console.log(open.data.result);
                console.log(' ');
                break;
              }
              // Verificando o primeiro passo
              if (z === 0) {
                // 1 - Se for Bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, walk.quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  } else {
                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, walk.quantity);
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
                    if (walk.action === 'sell') {
                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, walk.quantity);
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
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, walk.quantity);
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
                    await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  } else {
                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
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
                    if (walk.action === 'sell') {
                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
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
                      await walk.exchange.setSellLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.sum[0].rate, arb.walks[z - 1].quantity);
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
              // Telegram
              if (z === (walks.length - 1)) {
                await Telegram.sendMessage(`[${name}]: ${walks[walks.length - 1].quantity}`);
                console.log('Notificando por telegram');
              }

              console.log(walk.sum[0])
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
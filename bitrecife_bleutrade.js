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
    let qnt = 0;
    let order = 0;

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

  async updateRate(walk, quantity) {
    // Verificando o livro de ofertas
    let book = await walk.exchange.getOrderBook(walk.market, walk.action === 'buy' ? 'SELL' : 'BUY', 15);
    // Verificando a ação 
    let order = walk.action === 'buy' ? book.sell : book.buy;

    if (order[0].Quantity > quantity) {
      walk.price = order[1].Rate;
    } else if (order[1].Quantity > quantity) {
      walk.price = order[2].Rate;
    } else if (order[2].Quantity > quantity) {
      walk.price = order[3].Rate;
    } else if (order[3].Quantity > quantity) {
      walk.price = order[4].Rate;
    } else if (order[4].Quantity > quantity) {
      walk.price = order[4].Rate;
    } else if (order[5].Quantity > quantity) {
      walk.price = order[6].Rate;
    } else if (order[6].Quantity > quantity) {
      walk.price = order[7].Rate;
    } else if (order[7].Quantity > quantity) {
      walk.price = order[8].Rate;
    } else if (order[8].Quantity > quantity) {
      walk.price = order[9].Rate;
    } else if (order[9].Quantity > quantity) {
      walk.price = order[10].Rate;
    } else if (order[10].Quantity > quantity) {
      walk.price = order[11].Rate;
    } else if (order[11].Quantity > quantity) {
      walk.price = order[12].Rate;
    } else if (order[12].Quantity > quantity) {
      walk.price = order[13].Rate;
    } else if (order[13].Quantity > quantity) {
      walk.price = order[14].Rate;
    } else if (order[14].Quantity > quantity) {
      walk.price = order[15].Rate;
    }

    return walk.price;
  }

  async run() {
    do {
      for (let [x, arb] of Arb.entries()) {
        for (let [y, walk] of arb.walks.entries()) {
          try {
            let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 15);
            let resp = this.calcDistributingValue(arb, book, walk, y);
            //
            walk.price = resp.price;
            walk.quantity = resp.quantity;
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

        let wallet, amount = [];

        if (walks[walks.length - 1].quantity < entry) {          
          try {
            // Rotinas
            for (let [z, walk] of walks.entries()) {
              // Verificando o primeiro passo
              if (z === 0) {
                // Se for bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    walk.price = await this.updateRate(walk, walk.quantity);

                    console.log(walk.market, walk.price, walk.quantity)
                    // 2 - Comprar ou vender
                    //await walk.exchange.setSellLimit(walk.market, walk.price, walk.quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  } else {
                    walk.price = await this.updateRate(walk, walk.quantity);

                    console.log(walk.market, walk.price, walk.quantity)
                    // 2 - Comprar ou vender
                    //await walk.exchange.setBuyLimit(walk.market, walk.price, walk.quantity);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  // Se o primeiro passo não for Bleutrade
                  // E precise receber USDT ou BTC
                  if (walk.receive != null) {
                    if (walk.action === 'sell') {
                      //await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.005, walk.receive.exchangeto, walk.receive.mail);
                      console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                      
                      walk.price = await this.updateRate(walk, walk.quantity);

                      console.log(walk.market, walk.price, walk.quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setSellLimit(walk.market, walk.price, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        ////await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      //await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.005, walk.receive.exchangeto, walk.receive.mail);
                      console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                      
                      walk.price = await this.updateRate(walk, walk.quantity);

                      console.log(walk.market, walk.price, walk.quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setBuyLimit(walk.market, walk.price, walk.quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);                     
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walk.quantity);

                      console.log(walk.market, walk.price, walk.quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setSellLimit(walk.market, walk.price, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      walk.price = await this.updateRate(walk, walk.quantity);

                      console.log(walk.market, walk.price, walk.quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setBuyLimit(walk.market, walk.price, walk.quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }         
                }
              } else if (z === 1) {
                // Verificando o restante dos passos
                // 1 - Se for Bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    walk.price = await this.updateRate(walk, walks[0].quantity);

                    console.log(walk.market, walk.price, walks[0].quantity)
                    // 2 - Comprar ou vender
                    //await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                    
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  } else {
                    walk.price = await this.updateRate(walk, walks[0].quantity);

                    console.log(walk.market, walk.price, walks[0].quantity)
                    // 2 - Comprar ou vender
                    //await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  // Se o primeiro passo não for Bleutrade
                  // Ele precisa receber BTC ou USDT ? Se sim, enviar
                  if (walk.receive != null) {
                    if (walk.action === 'sell') {
                      //await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.005, walk.receive.exchangeto, walk.receive.mail);
                      console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                      
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      console.log(walk.market, walk.price, walks[0].quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      //await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.005, walk.receive.exchangeto, walk.receive.mail);
                      console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                      
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      console.log(walk.market, walk.price, walks[0].quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    // 2 - Comprar ou vender
                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      console.log(walk.market, walk.price, walks[0].quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      console.log(walk.market, walk.price, walks[0].quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }            
                }
              } else if (z === 2) {
                // Verificando o restante dos passos
                // 1 - Se for Bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    walk.price = await this.updateRate(walk, walks[1].quantity);

                    console.log(walk.market, walk.price, walks[1].quantity)
                    // 2 - Comprar ou vender
                    //await walk.exchange.setSellLimit(walk.market, walk.price, walks[1].quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                    
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  } else {
                    walk.price = await this.updateRate(walk, walks[1].quantity);

                    console.log(walk.market, walk.price, walks[1].quantity)
                    // 2 - Comprar ou vender
                    //await walk.exchange.setBuyLimit(walk.market, walk.price, walks[1].quantity);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  // Se o primeiro passo não for Bleutrade
                  // Ele precisa receber BTC ou USDT ? Se sim, enviar
                  if (walk.receive != null) {
                    if (walk.action === 'sell') {
                      //await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.005, walk.receive.exchangeto, walk.receive.mail);
                      console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                      
                      walk.price = await this.updateRate(walk, walks[1].quantity);

                      console.log(walk.market, walk.price, walks[1].quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setSellLimit(walk.market, walk.price, walks[1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      //await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.005, walk.receive.exchangeto, walk.receive.mail);
                      console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
                      
                      walk.price = await this.updateRate(walk, walks[1].quantity);

                      console.log(walk.market, walk.price, walks[1].quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setBuyLimit(walk.market, walk.price, walks[1].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    // 2 - Comprar ou vender
                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walks[1].quantity);

                      console.log(walk.market, walk.price, walks[1].quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setSellLimit(walk.market, walk.price, walks[1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    } else {
                      walk.price = await this.updateRate(walk, walks[1].quantity);

                      console.log(walk.market, walk.price, walks[1].quantity)
                      // 2 - Comprar ou vender
                      //await walk.exchange.setBuyLimit(walk.market, walk.price, walks[1].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        //await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }            
                }
              }
              // Telegram
              // if (z === (walks.length - 1)) {
              //   await Telegram.sendMessage(`[${name}]: ${walks[walks.length - 1].quantity}`);
              //   console.log('Notificando tiago.a.trigo@gmail.com por telegram');
              // } 
            }
            process.exit()
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
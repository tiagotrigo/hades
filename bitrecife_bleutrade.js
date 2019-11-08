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
    let calc = this.mask(tax, 8) / rate;   

    return this.mask(((calc * 100000000) - 1) / 100000000, 8);    
  }

  calcQntSell(amount, rate, fee) {
    let calc = (amount * rate) * (1 - fee);
    return this.mask(((calc * 100000000) - 1) / 100000000, 8);
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
    let book = await walk.exchange.getOrderBook(walk.market, walk.action === 'buy' ? 'SELL' : 'BUY', 5);
    // Verificando a ação 
    let order = walk.action === 'buy' ? book.sell : book.buy;

    if (quantity > order[0].Quantity) {
      walk.price = order[1].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity)) {
      walk.price = order[2].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity)) {
      walk.price = order[3].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity + order[3].Quantity)) {
      walk.price = order[4].Rate;
    } else if (quantity > (order[0].Quantity + order[1].Quantity + order[2].Quantity + order[3].Quantity + order[4].Quantity)) {
      walk.price = order[5].Rate;
    } else {
      walk.price = order[0].Rate;
    }

    return walk.price;
  }

  async run() {
    do {
      for (let [x, arb] of Arb.entries()) {
        for (let [y, walk] of arb.walks.entries()) {
          try {
            let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 5);
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

        if (walks[walks.length - 1].quantity > entry) {          
          try {
            // Rotinas
            for (let [z, walk] of walks.entries()) {
              // Verificando o primeiro passo
              if (z === 0) {
                // Se for bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    walk.price = await this.updateRate(walk, walk.quantity);

                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.price, walk.quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }

                  if (walk.action === 'buy') {
                    walk.price = await this.updateRate(walk, walk.quantity);

                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.price, walk.quantity);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  if (walk.receive === null) {
                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walk.quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      walk.price = await this.updateRate(walk, walk.quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, walk.quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);

                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walk.quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      walk.price = await this.updateRate(walk, walk.quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, walk.quantity);
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

              if (z === 1) {
                // Se for bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    walk.price = await this.updateRate(walk, walks[0].quantity);

                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }

                  if (walk.action === 'buy') {
                    walk.price = await this.updateRate(walk, walks[0].quantity);

                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  if (walk.receive === null) {
                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Balance, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Balance, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);

                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Balance, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);
                        
                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Balance, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }
                }
              }
              
              // Telegram
              if (z === (walks.length - 1)) {
                await Telegram.sendMessage(`[${name}]: ${walks[walks.length - 1].quantity}`);
                console.log('Notificando @tiagotrigo');
              } 
            }
            process.exit();
          } catch(e) {
            console.log(e);
          }
        } else {
          if (walks[walks.length - 1].exchangeto === 1) {
            console.log(`[Bleutrade][${name}]:`, walks[walks.length - 1].quantity);  
          } else if (walks[walks.length - 1].exchangeto === 2) {
            console.log(`[Exccripto][${name}]:`, walks[walks.length - 1].quantity);  
          } else {
            console.log(`[Bitrecife][${name}]:`, walks[walks.length - 1].quantity);  
          }          
        }
      }
    } while (true);
  }
}

new Hades().run();
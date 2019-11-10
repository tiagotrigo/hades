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
    let calc = tax / rate;  

    return calc;    
  }

  calcQntSell(amount, rate, fee) {
    let calc = (amount * rate) * (1 - fee);
    return calc;
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
    let sum = 0;
    // Verificando o livro de ofertas
    let book = await walk.exchange.getOrderBook(walk.market, walk.action === 'buy' ? 'SELL' : 'BUY', 15);
    // Verificando a ação 
    let orders = walk.action === 'buy' ? book.sell : book.buy;

    for (let [i, order] of orders.entries()) {
      sum = sum + order.Quantity
      if (quantity <= sum) {
        walk.price = order.Rate;
        break;
      }
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

        let wallet = [];

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
                      wallet = await walk.exchange.getBalance(walk.transfer.asset);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                      wallet = await walk.exchange.getBalance(walk.transfer.asset);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.1, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);


                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walk.quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, walk.quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                      wallet = await walk.exchange.getBalance(walk.transfer.asset);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                      wallet = await walk.exchange.getBalance(walk.transfer.asset);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.1, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);

                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walks[0].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
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
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }
                }
              }  

              if (z === 2) {
                // Se for bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    walk.price = await this.updateRate(walk, walks[1].quantity);

                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.price, walks[1].quantity);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      wallet = await walk.exchange.getBalance(walk.transfer.asset);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[1].Available, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }

                  if (walk.action === 'buy') {
                    walk.price = await this.updateRate(walk, walks[1].quantity);

                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.price, walks[1].quantity);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      wallet = await walk.exchange.getBalance(walk.transfer.asset);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[1].Available, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  if (walk.receive === null) {
                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walks[1].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, walks[1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[1].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      walk.price = await this.updateRate(walk, walks[1].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, walks[1].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[1].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.1, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);

                    if (walk.action === 'sell') {
                      walk.price = await this.updateRate(walk, walks[1].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, walks[1].quantity);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[1].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      walk.price = await this.updateRate(walk, walks[1].quantity);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, walks[1].quantity);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {   
                        wallet = await walk.exchange.getBalance(walk.transfer.asset);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[1].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }
                }
              }

              // Verificando se ficou saldo de alguma moeda na EXC
              if (walk.exchangeto === 2) {
                wallet = await walk.exchange.getBalances();

                for (let balance of wallet.data.result) {
                  if (balance.Available >= 0.0001 && (balance.Asset === 'USDT' || balance.Asset === 'BTC')) {
                    await walk.exchange.setDirectTransfer(balance.Asset, balance.Available, 1, 'tiago.a.trigo@gmail.com');
                    console.log(`Reenviando o restinho de ${balance.Asset} para Bleutrade`); 
                  }
                }
              }

              // Verificando se ficou saldo de alguma moeda na Bitrecife
              if (walk.exchangeto === 3) {
                wallet = await walk.exchange.getBalances();

                for (let balance of wallet.data.result) {
                  if (balance.Available >= 0.0001 && (balance.Asset === 'USDT' || balance.Asset === 'BTC')) {
                    await walk.exchange.setDirectTransfer(balance.Asset, balance.Available, 1, 'tiago.a.trigo@gmail.com');
                    console.log(`Reenviando o restinho de ${balance.Asset} para Bleutrade`); 
                  }
                }
              }           
              // Telegram
              if (z === (walks.length - 1)) {
                await Telegram.sendMessage(`[${name}]: ${walks[walks.length - 1].quantity}`);
                console.log('Notificando @tiagotrigo');
              } 
            }
            // process.exit();
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
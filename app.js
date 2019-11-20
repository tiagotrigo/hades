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
    let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 5);
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
            let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 5);
            let resp = this.calcDistributingValue(arb, book, walk, y);
            //
            walk.book = {
              rate: walk.action === 'buy' ? book.sell[0].Rate : book.buy[0].Rate,
              quantity: walk.action === 'buy' ? book.sell[0].Quantity : book.buy[0].Quantity
            }
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
        let buy = [];
        let sell = [];

        if (this.mask(walks[walks.length - 1].quantity, 8) > this.mask(entry, 8) && walks[0].book.quantity > walks[0].quantity && walks[walks.length - 2].book.quantity > walks[walks.length - 2].quantity) {          
          try {
            // Rotinas
            for (let [z, walk] of walks.entries()) {
              // Verificando o primeiro passo
              if (z === 0) {
                // Se for bleutrade
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    sell = (walk.dividend === 'BTC' || walk.dividend === 'USDT' || walk.dividend === 'BRL') ? entry : this.calcQntSell(entry, walk.price, walk.fee);
                    //walk.price = await this.updateRate(walk, sell);

                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.price, sell);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      wallet = await walk.exchange.getBalance(walk.divisor);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }

                  if (walk.action === 'buy') {
                    buy = (walk.dividend === 'BTC' || walk.dividend === 'USDT' || walk.dividend === 'BRL') ? entry : this.calcQntBuy(entry, walk.price, walk.fee);
                    //walk.price = await this.updateRate(walk, buy);

                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.price, buy);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      wallet = await walk.exchange.getBalance(walk.dividend);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  if (walk.receive === null) {
                    if (walk.action === 'sell') {
                      sell = (walk.dividend === 'BTC' || walk.dividend === 'USDT' || walk.dividend === 'BRL') ? entry : this.calcQntSell(entry, walk.price, walk.fee);
                      //walk.price = await this.updateRate(walk, sell);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, sell);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      buy = (walk.dividend === 'BTC' || walk.dividend === 'USDT' || walk.dividend === 'BRL') ? entry : this.calcQntBuy(entry, walk.price, walk.fee);
                      //walk.price = await this.updateRate(walk, buy);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, buy);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.dividend);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.1, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);

                    if (walk.action === 'sell') {
                      sell = (walk.dividend === 'BTC' || walk.dividend === 'USDT' || walk.dividend === 'BRL') ? entry : this.calcQntSell(entry, walk.price, walk.fee);
                      //walk.price = await this.updateRate(walk, sell);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, sell);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      buy = (walk.dividend === 'BTC' || walk.dividend === 'USDT' || walk.dividend === 'BRL') ? entry : this.calcQntBuy(entry, walk.price, walk.fee);
                      //walk.price = await this.updateRate(walk, buy);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, buy);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.dividend);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }
                }
              } else if (z === (walks.length - 1)) {
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    wallet = await walk.exchange.getBalance(walk.dividend);
                    //walk.price = await this.updateRate(walk, wallet.data.result[0].Available);

                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.price, wallet.data.result[0].Available);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      wallet = await walk.exchange.getBalance(walk.divisor);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }

                  if (walk.action === 'buy') {
                    wallet = await walk.exchange.getBalance(walk.divisor);
                    //walk.price = await this.updateRate(walk, wallet.data.result[0].Available);

                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.price, wallet.data.result[0].Available);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      wallet = await walk.exchange.getBalance(walk.dividend);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  if (walk.receive === null) {
                    if (walk.action === 'sell') {
                      wallet = await walk.exchange.getBalance(walk.dividend);
                      //walk.price = await this.updateRate(walk, wallet.data.result[0].Available);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, wallet.data.result[0].Available);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      wallet = await walk.exchange.getBalance(walk.divisor);
                      //walk.price = await this.updateRate(walk, wallet.data.result[0].Available);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, wallet.data.result[0].Available);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.dividend);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.1, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);

                    if (walk.action === 'sell') {
                      wallet = await walk.exchange.getBalance(walk.dividend);
                      //walk.price = await this.updateRate(walk, wallet.data.result[0].Available);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, wallet.data.result[0].Available);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      wallet = await walk.exchange.getBalance(walk.divisor);
                      //walk.price = await this.updateRate(walk, wallet.data.result[0].Available);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, wallet.data.result[0].Available);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {  
                        wallet = await walk.exchange.getBalance(walk.dividend);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }
                }
              } else {
                if (walk.exchangeto === 1) {
                  if (walk.action === 'sell') {
                    wallet = await walk.exchange.getBalance(walk.dividend);
                    sell = this.calcQntSell(wallet.data.result[0].Available, walk.price, walk.fee);
                    //walk.price = await this.updateRate(walk, sell);

                    // 2 - Comprar ou vender
                    await walk.exchange.setSellLimit(walk.market, walk.price, sell);
                    console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                    
                    // 3 - Transfer caso precise
                    if (walk.transfer) {
                      wallet = await walk.exchange.getBalance(walk.divisor);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }

                  if (walk.action === 'buy') {
                    wallet = await walk.exchange.getBalance(walk.divisor);
                    buy = this.calcQntBuy(wallet.data.result[0].Available, walk.price, walk.fee);
                    //walk.price = await this.updateRate(walk, buy);

                    // 2 - Comprar ou vender
                    await walk.exchange.setBuyLimit(walk.market, walk.price, buy);
                    console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                    
                    // 3 - Transferir caso precise
                    if (walk.transfer) {
                      wallet = await walk.exchange.getBalance(walk.dividend);

                      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                    }
                  }
                } else {
                  if (walk.receive === null) {
                    if (walk.action === 'sell') {
                      wallet = await walk.exchange.getBalance(walk.dividend);
                      sell = this.calcQntSell(wallet.data.result[0].Available, walk.price, walk.fee);
                      //walk.price = await this.updateRate(walk, sell);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, sell);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      wallet = await walk.exchange.getBalance(walk.divisor);
                      buy = this.calcQntBuy(wallet.data.result[0].Available, walk.price, walk.fee);
                      //walk.price = await this.updateRate(walk, buy);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, buy);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.dividend);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  } else {
                    await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.1, walk.receive.exchangeto, walk.receive.mail);
                    console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);

                    if (walk.action === 'sell') {
                      wallet = await walk.exchange.getBalance(walk.dividend);
                      sell = this.calcQntSell(wallet.data.result[0].Available, walk.price, walk.fee);
                      //walk.price = await this.updateRate(walk, sell);

                      // 2 - Comprar ou vender
                      await walk.exchange.setSellLimit(walk.market, walk.price, sell);
                      console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);                   
                      
                      // 3 - Transfer caso precise
                      if (walk.transfer) {
                        wallet = await walk.exchange.getBalance(walk.divisor);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }

                    if (walk.action === 'buy') {
                      wallet = await walk.exchange.getBalance(walk.divisor);
                      buy = this.calcQntBuy(wallet.data.result[0].Available, walk.price, walk.fee);
                      //walk.price = await this.updateRate(walk, buy);

                      // 2 - Comprar ou vender
                      await walk.exchange.setBuyLimit(walk.market, walk.price, buy);
                      console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
                      
                      // 3 - Transferir caso precise
                      if (walk.transfer) {  
                        wallet = await walk.exchange.getBalance(walk.dividend);

                        await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
                        console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
                      }
                    }
                  }
                }
              }
              // Telegram
              if (z === (walks.length - 1)) {
                await Telegram.sendMessage(`[${name}]: ${this.mask(walks[walks.length - 1].quantity, 8)}`);
                console.log('Notificando @tiagotrigo');
              } 
            }
            // process.exit();
          } catch(e) {
            console.log(e);
          }
        } else {
          if (walks[walks.length - 1].exchangeto === 1) {
            console.log(`[Bleutrade][${name}]:`, this.mask(walks[walks.length - 1].quantity, 8));  
          } else if (walks[walks.length - 1].exchangeto === 2) {
            console.log(`[Exccripto][${name}]:`, this.mask(walks[walks.length - 1].quantity, 8));  
          } else {
            console.log(`[Bitrecife][${name}]:`, this.mask(walks[walks.length - 1].quantity, 8));  
          }          
        }
      }
    } while (true);
  }
}

new Hades().run();
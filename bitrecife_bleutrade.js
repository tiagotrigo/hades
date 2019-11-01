'use stricts';

const R = require('ramda');
const Arb = require('./arbitration');
const await = require('await');
const Telegram = require('./telegram');

class Hades {
  
  constructor() {
    this.i = 0,
    this.email = 'tiago.a.trigo@gmail.com'
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

  formatNumber(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  calcQntSum(entry, book, type) {
    let i = 0;
    let sum = 0;
    let orders = R.map((n) => this.formatNumber(n.Quantity * n.Rate, 8), type === 'buy' ? book.sell : book.buy);
    let ordersSum = R.map((item) => {
      i++;
      sum = sum + item;
      return {
        id: i - 1,
        rate: type === 'buy' ? book.sell[i - 1].Rate : book.buy[i - 1].Rate,
        quantity: item,
        sum: this.formatNumber(sum, 8)
      }
    }, orders);

    return R.filter((n) => n.sum >= entry, ordersSum);
  }

  calcQntBuy(entry, rate, fee) {
    let f = entry * fee;
    let profit = this.formatNumber(f, 8) / rate;
    
    return this.formatNumber(profit, 8);    
  }

  calcQntSell(entry, rate, fee) {
    return this.formatNumber((entry * rate) * (1 - fee), 8);
  } 

  calcDistributingValue(exchange, book, walk, index) {
    let qnt = 0.0;
    let order = [];

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

  async main() {
    if (this.i >= Arb.length) {
      this.i = 0;
    }

    for (let [y, walk] of Arb[this.i].walks.entries()) {
      let book = await walk.exchange.getOrderBook(walk.market, 'ALL', 15);
      if (book) {
        let resp = this.calcDistributingValue(Arb[this.i], book, walk, y);
        // Atualizando o preço
        walk.price = resp.price;
        // Atualizando a quantidade
        walk.quantity = resp.quantity;
        // Somando o book
        walk.sum = this.calcQntSum(resp.quantity, book, walk.action);
      } else {
        console.log('Erro para carregar o livro de oferta(s)');
        process.exit();
      }
    }

    const {
      name,
      entry,
      walks,
      quantity
    } = Arb[this.i];   

    if (walks[walks.length - 1].quantity > entry) {
      for (let [z, walk] of walks.entries()) {
        if (z === 0) {
          // Se for Bleutrade, executar ação de compra e venda e depois a transferencia
          if (walk.exchangeto === 1) {
            if (walk.action === 'sell') {
              let side = await walk.exchange.setSellLimit(entry, walk.sum[0].rate, walk.quantity, false);
              if (side && walk.transfer) {
                let direct = await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.email);
                if (direct) {
                  console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);    
                }
              }
            } else {
              let side = await walk.exchange.setBuyLimit(entry, walk.sum[0].rate, walk.quantity, false);
              if (side && walk.transfer) {
                let direct = await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.email);
                if (direct) {
                  console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);    
                }
              }
            }
          } else {
            // Se for Exc ou Bitrecife
            if (walk.receive) {
              let receive = await walk.receive.exchange.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.email);
              // Tire BTC ou USDT da Bleutrade para a próxima exchange
              if (receive) {
                if (walk.action === 'sell') {
                  let side = await walk.exchange.setSellLimit(entry, walk.sum[0].rate, walk.quantity, false);
                  if (side && walk.transfer) {
                    let direct = await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.email);
                    if (direct) {
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);    
                    }
                  }
                } else {
                  let side = await walk.exchange.setBuyLimit(entry, walk.sum[0].rate, walk.quantity, false);
                  if (side && walk.transfer) {
                    let direct = await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.email);
                    if (direct) {
                      console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);    
                    }
                  }
                } 
              }              
            }          
          }
        } else {
          // Se for Bleutrade, executar ação de compra e venda, depois a transferencia se exitir
          if (walk.exchangeto === 1) {
            console.log(`Executando ação de ${walk.action}`);
            if (walk.transfer) {
              console.log(`Enviando para exchange ${walk.transfer.exchangeto}`);
            }
          } else {
            // Se for Exc ou Bitrecife
            if (walk.transfer) {
              // Execute ação de compra  e venda
              console.log(`Executando ação de ${walk.action}`);
              // Transferir para próxima exchange
              console.log(`Enviando para exchange ${walk.transfer.exchangeto}`);
            } else {
              //
              console.log(`Executando ação de ${walk.action}`);
            }            
          }
        }
      }
    } else {
      console.log(`[${name}]:`, walks[walks.length - 1].quantity);
    }

    this.i += 1;
  }

  run() {
    this.repeat(5000, 
      () => Promise.all([
        this.main()
      ])
    )
  }
}

new Hades().run();
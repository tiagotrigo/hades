'use stricts';

const R = require('ramda');
const await = require('await');
const Telegram = require('./telegram');
const Bitrecife = require('./bullgain');
const Arbitrations = require('./arbitration');

class Hades {
  
  constructor() {
    this.mail = 'tiago.a.trigo@gmail.com';
  }

  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  mask(num, precision) {
    let output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  calcQntBuy(entry, price, fee) {
    let tax = (1 - fee) * entry;
    let quantity = tax / price;

    return quantity;
  }

  calcQntSell(entry, price, fee) {
    let tax = entry * (1 - fee);
    let quantity = tax / price;

    return quantity;
  }

  calcBuyProfit(entry, price, fee) {
    let quantity = entry / price;
    return quantity;
  }

  calcSellProfit(entry, price, fee) {
    let quantity = entry * price;
    return quantity;
  }

  exchangeNameSelected(exchange) {
    let exchangeto = '';
    
    switch (exchange) {
      case 1:
        exchangeto = 'Bleutrade';
        break;
      case 2:
        exchangeto = 'Exccripto';
        break;
      case 3:
        exchangeto = 'Bitrecife';
        break;
      case 8:
        exchangeto = 'Bomesp';
        break;
      case 9:
        exchangeto = 'Bullgain';
        break;
      default:
        process.exit();
        break;
    }
    
    return exchangeto;
  }

  async rebalancingBalance(walk, entry) {
    let exchangeto = this.exchangeNameSelected(walk.receive.exchangeto);

    await Bitrecife.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
    console.log(`Enviando ${walk.receive.asset} (${entry}) da Bitrecife para ${exchangeto}`);
  }

  async calcQntOutput(arb) {
    for (let [i, walk] of arb.walks.entries()) {
      walk.total = 0;
      walk.quantity = 0;
      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 5);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;         
      // Buy - total
      // Sell - quantity
      if (i === 0) {
        this.calcule(walk, orders, arb.entry);
      } else if (i === 1) {
        this.calcule(walk, orders, arb.walks[i - 1].total);
      } else if (i === 2) {
        this.calcule(walk, orders, arb.walks[i - 1].total);
      }
    }
  }  

  calcule(walk, orders, value) {
    let valueBook = 0;
    if (walk.action === 'buy') {      
      for (let x = 0; x < orders.length; x++) {
        valueBook = orders[x].Quantity * orders[x].Rate;         
        if (valueBook < value) {
          value = value - valueBook;
          walk.price = orders[x].Rate;
          walk.quantity = walk.quantity + orders[x].Quantity;
        } else {
          walk.quantity = walk.quantity + (value / orders[x].Rate);
          walk.price = orders[x].Rate;
          walk.total = walk.quantity * walk.fee;
          break;
        }
      }
    } else {
      for (let y = 0; y < orders.length; y++) {
        if (orders[y].Quantity < value) {
          value = value - orders[y].Quantity;
          walk.quantity = walk.quantity + orders[y].Quantity;
          walk.price = orders[y].Rate;
          walk.total = walk.total + (orders[y].Quantity * orders[y].Rate) * walk.fee; 
        } else {
          walk.quantity = walk.quantity + value;
          walk.price = orders[y].Rate;
          walk.total = walk.total + (value * orders[y].Rate) * walk.fee;
          break;
        }
      }
    }
  }

  // Segundo passo
  async calcProfitOutput(arb) {        
    return arb.walks[arb.walks.length - 1].total; - arb.entry;
  }
  // Ação de compra
  async oppTakerBuy(walk, entry, index) {
    // Comprar
    await walk.exchange.setBuyLimit(walk.symbol, walk.price, this.mask(walk.total, 8));
    console.log(`Troca de ${walk.base} por ${walk.quote} (${walk.quantity})`);
    // É preciso transferir ?
    if (walk.transfer) {
      let wallet = await walk.exchange.getBalance(walk.transfer.asset);
      let exchangeto = this.exchangeNameSelected(walk.transfer.exchangeto);

      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
      console.log(`Enviando ${walk.transfer.asset} para exchange ${exchangeto}`);
    }
  }
  // Ação de venda
  async oppTakerSell(walk, entry, index) { 
    // Vender
    await walk.exchange.setSellLimit(walk.symbol, walk.price, this.mask(walk.quantity, 8));
    console.log(`Troca de ${walk.base} por ${walk.quote} (${walk.quantity})`);    
    // É preciso transferir ?
    if (walk.transfer) {
      let wallet = await walk.exchange.getBalance(walk.transfer.asset);
      let exchangeto = this.exchangeNameSelected(walk.transfer.exchangeto);

      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
      console.log(`Enviando ${walk.transfer.asset} para exchange ${exchangeto}`);
    }
  }
  // Controlador de ações
  async routine(walk, arb, index) {
    // Se iniciar com a Bitrecife
    if (index === 0 && walk.exchangeto === 3) {
      if (walk.action === 'sell') {
        // Vender
        await this.oppTakerSell(walk, arb.entry, index);
      } else if (walk.action === 'buy') {
        // Comprar
        await this.oppTakerBuy(walk, arb.entry, index);                    
      }  
    } else if (index === 0) {
      // Enviando BTC ou USDT para outras exchanges
      await this.rebalancingBalance(walk, arb.entry, index);

      if (walk.action === 'sell') {
        // Vender
        await this.oppTakerSell(walk, arb.entry, index);
      } else if (walk.action === 'buy') {
        // Comprar
        await this.oppTakerBuy(walk, arb.entry, index);                    
      } 
    } else {
      if (walk.action === 'sell') {
        // Vender
        await this.oppTakerSell(walk, arb.entry, index);
      } else if (walk.action === 'buy') {
        // Comprar
        await this.oppTakerBuy(walk, arb.entry, index);                    
      }
    }
  }

  async run() {
    do {
      try {
        for (let [i, arb] of Arbitrations.entries()) {
          const { walks } = arb;
          // Calculando a quantidade
          await this.calcQntOutput(arb);
          // Verificando se a lucro
          const profit = await this.calcProfitOutput(arb);

          if (profit > arb.entry) {
            /*for (let [y, walk] of walks.entries()) {
              // Iniciando rotinas
              await this.routine(walk, arb, y);
            }
            await Telegram.sendMessage(`[${arb.name}]: ${profit}`);
            console.log('Enviando notificação para @tiagotrigo'); */
            console.log(arb.name, profit)
            console.log(arb)    
          } else {
            console.log(arb.name, this.mask(profit, 8));
          }
          await this.wait(1000);          
        }  
      } catch(e) {
        console.log(e.message)
      }
    } while (true);
  }
}

new Hades().run();
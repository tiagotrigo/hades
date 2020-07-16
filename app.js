'use stricts';

const R = require('ramda');
const await = require('await');
const Telegram = require('./telegram');
const Bullgain = require('./bullgain');
const sprintf = require('sprintf-js').sprintf;
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
    let quantity = (entry * fee) / price;
    return quantity;
  }

  calcQntSell(entry, price, fee) {
    let quantity = (entry * price) * (1 - fee);
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

    await Bullgain.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
    console.log(`Enviando ${walk.receive.asset} (${entry}) da Bullgain para ${exchangeto}`);
  }

  // Primeiro passo
  async calcQntOutput(arb) {
    let sum = 0;
    let price = 0;

    for (let [i, walk] of arb.walks.entries()) {      
      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 3);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;

      price = i === 0 ? arb.entry : arb.walks[i - 1].quantity;

      for (let [s, order] of orders.entries()) {
        if (order.Rate >= 1) {
          sum = sum + (order.Quantity * order.Rate);
        } else {
          sum = sum + order.Quantity;
        }
        
        if (i > 0 && walk.quote === arb.walks[i - 1].quote) {
          walk.quantity = this.mask(arb.walks[i - 1].quantity, 8);
        } else {
          if (walk.action === 'sell') {
            walk.quantity = this.mask(this.calcQntSell(price, order.Rate, walk.fee), 8);
          } else {
            walk.quantity = this.mask(this.calcQntBuy(price, order.Rate, walk.fee), 8);
          }
        }

        if (walk.quantity <= sum) {          
          walk.price = order.Rate;
          break;
        }
      }
    }
  }  
  // Segundo passo
  async calcProfitOutput(arb) {
    const { walks } = arb;

    let output = 0;
    let sum = 0;
    let price = 0;

    for (let [i, walk] of arb.walks.entries()) {      
      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 3);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;

      price = i === 0 ? arb.entry : arb.walks[i - 1].quantity;

      for (let [s, order] of orders.entries()) {
        if (order.Rate >= 1) {
          sum = sum + (order.Quantity * order.Rate);
        } else {
          sum = sum + order.Quantity;
        }
        
        if (walk.action === 'sell') {
          output = this.mask(this.calcQntSell(price, order.Rate, walk.fee), 8);
        } else {
          output = this.mask(this.calcQntBuy(price, order.Rate, walk.fee), 8);
        }

        if (output > arb.entry && walks[walks.length - 1].quantity <= sum) {     
          walks[walks.length - 1].price = order.Rate;
          break;
        }
      }
    }

    return output;
  }
  // Ação de compra
  async oppTakerBuy(walk, entry) {
    // Comprar
    await walk.exchange.setBuyMarket(walk.symbol, walk.quantity);
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
  async oppTakerSell(walk, entry) { 
    // Vender
    await walk.exchange.setSellMarket(walk.symbol, walk.quantity);
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
    // Se iniciar com a Bullgain
    if (index === 0 && walk.exchangeto === 8) {
      if (walk.action === 'sell') {
        // Vender
        await this.oppTakerSell(walk, arb.entry);
      } else if (walk.action === 'buy') {
        // Comprar
        await this.oppTakerBuy(walk, arb.entry);                    
      }  
    } else if (index === 0) {
      // Enviando BTC ou USDT para outras exchanges
      await this.rebalancingBalance(walk, arb.entry);

      if (walk.action === 'sell') {
        // Vender
        await this.oppTakerSell(walk, arb.entry);
      } else if (walk.action === 'buy') {
        // Comprar
        await this.oppTakerBuy(walk, arb.entry);                    
      } 
    } else {
      if (walk.action === 'sell') {
        // Vender
        await this.oppTakerSell(walk, arb.entry);
      } else if (walk.action === 'buy') {
        // Comprar
        await this.oppTakerBuy(walk, arb.entry);                    
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
            for (let [y, walk] of walks.entries()) {
              // Iniciando rotinas
              await this.routine(walk, arb, y);
            }
            await Telegram.sendMessage(`[${arb.name}]: ${profit}`);
            console.log('Enviando notificação para @tiagotrigo');
            // console.log(arb)
            // process.exit()
          } else {
            console.log(arb.name, profit);
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
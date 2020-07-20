'use stricts';

const R = require('ramda');
const await = require('await');
const Telegram = require('./telegram');
const Bullgain = require('./bullgain');
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

    await Bullgain.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
    console.log(`Enviando ${walk.receive.asset} (${entry}) da Bullgain para ${exchangeto}`);
  }

  async calcQntOutput(arb) {
    let total = 0;
    let value = 0;
    let valueBook = 0;
    let quantity = 0;
    let price = 0;


    for (let [i, walk] of arb.walks.entries()) {

      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 5);
      // Verificando a mascara
      let markets = await walk.exchange.getMarkets();
      let decimal = markets.find(i => walk.symbol === i.MarketName);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;     
      // Reset
      walk.price = 0;
      walk.quantity = 0;
      walk.total = 0;

      value = i === 0 ? arb.entry : arb.walks[i - 1].quantity;

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
        for (let x = 0; x < orders.length; i++) {
          if (orders[x].Quantity < value) {
            value = value - orders[x].Quantity;
            walk.quantity = walk.quantity + orders[x].Quantity;
            walk.price = orders[x].Rate;
            walk.total = walk.total + (orders[x].Quantity * orders[x].Rate) * walk.fee; 
          } else {
            walk.quantity = walk.quantity + value;
            walk.price = orders[x].Rate;
            walk.total = walk.total + (value * orders[x].Rate) * walk.fee;
            break;
          }
        }
      }
    }
  }  
  // Segundo passo
  async calcProfitOutput(arb) {        
    return arb.entry - arb.walks[arb.walks.length - 1].quantity;
  }
  // Ação de compra
  async oppTakerBuy(walk, entry, index) {
    // Comprar
    await walk.exchange.setBuyLimit(walk.symbol, walk.price, this.mask(walk.quantity, 8));
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
    // Se iniciar com a Bullgain
    if (index === 0 && walk.exchangeto === 9) {
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
            for (let [y, walk] of walks.entries()) {
              // Iniciando rotinas
              await this.routine(walk, arb, y);
            }
            await Telegram.sendMessage(`[${arb.name}]: ${profit}`);
            console.log('Enviando notificação para @tiagotrigo');            
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
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
    let sum = 0;
    let qnt = 0;
    let price = null;

    for (let [i, walk] of arb.walks.entries()) {
      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 5);
      // Verificando a mascara
      let markets = await walk.exchange.getMarkets();
      let decimal = markets.find(i => walk.symbol === i.MarketName);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;

      if (i === 0) {
        walk.quantity = arb.entry;
        
        price = orders.find(i => {
          if (i.Rate >= 1) {
            sum = sum + (i.Rate * i.Quantity);
          } else {
            sum = sum + i.Quantity;
          }
          return walk.quantity <= sum;
        });
        
        walk.price = price.Rate;
        
        if (walk.action === 'sell') {
          walk.quantity = this.mask(this.calcQntSell(walk.quantity, walk.price, walk.fee), decimal.DividendDecimal);
        } else {
          walk.quantity = this.mask(this.calcQntBuy(walk.quantity, walk.price, walk.fee), decimal.DividendDecimal);
        }
      } else if (i > 0 && walk.quote != 'USDT' || walk.quote != 'BTC' || walk.quote != 'BRL') {
        walk.quantity = arb.walks[i - 1].quantity;

        price = orders.find(i => {
          if (i.Rate >= 1) {
            sum = sum + (i.Rate * i.Quantity);
          } else {
            sum = sum + i.Quantity;
          }
          return walk.quantity <= sum;
        });
        
        walk.price = price.Rate;
      }
    }
  }  
  // Segundo passo
  async calcProfitOutput(arb) {    
    let output = 0;

    if (arb.walks[arb.walks.length - 1].action === 'sell') {
      output = this.calcQntSell(arb.walks[arb.walks.length - 1].quantity, arb.walks[arb.walks.length - 1].price, arb.walks[arb.walks.length - 1].fee);
    } else {
      output = this.calcQntBuy(arb.walks[arb.walks.length - 1].quantity, arb.walks[arb.walks.length - 1].price, arb.walks[arb.walks.length - 1].fee);
    } 
    
    return this.mask(output, 8);
  }
  // Ação de compra
  async oppTakerBuy(walk, entry, index) {
    let trade = await walk.exchange.getBalance(walk.trade);

    if (index === 0 && (walk.quote === 'USDT' || walk.quote === 'BTC' || walk.quote === 'BRL')) {    
      // Comprar
      await walk.exchange.setBuyMarket(walk.symbol, entry);
      console.log(`Troca de ${walk.base} por ${walk.quote} (${entry})`);
    } else if (index === 0 && (walk.quote != 'USDT' || walk.quote != 'BTC' || walk.quote != 'BRL')) {
      // Comprar
      await walk.exchange.setBuyMarket(walk.symbol, walk.quantity);
      console.log(`Troca de ${walk.base} por ${walk.quote} (${walk.quantity})`);
    } else {
      // Comprar
      await walk.exchange.setBuyMarket(walk.symbol, trade.data.result[0].Available);
      console.log(`Troca de ${walk.base} por ${walk.quote} (${trade.data.result[0].Available})`);
    }
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
    let trade = await walk.exchange.getBalance(walk.trade);

    if (index === 0 && (walk.quote === 'USDT' || walk.quote === 'BTC' || walk.quote === 'BRL')) {    
      // Vender
      await walk.exchange.setSellMarket(walk.symbol, entry);
      console.log(`Troca de ${walk.base} por ${walk.quote} (${entry})`);
    } else if (index === 0 && (walk.quote != 'USDT' || walk.quote != 'BTC' || walk.quote != 'BRL')) {
      // Vender
      await walk.exchange.setSellMarket(walk.symbol, walk.quantity);
      console.log(`Troca de ${walk.base} por ${walk.quote} (${walk.quantity})`);
    } else {
      // Vender
      await walk.exchange.setSellMarket(walk.symbol, trade.data.result[0].Available);
      console.log(`Troca de ${walk.base} por ${walk.quote} (${trade.data.result[0].Available})`);
    }
    
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
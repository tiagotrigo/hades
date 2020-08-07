'use stricts';

const R = require('ramda');
const await = require('await');
const Telegram = require('./telegram');
const Bitrecife = require('./bitrecife');
const Bleutrade = require('./bleutrade');
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
      case 6:
        exchangeto = 'Comprar Bitcoin';
        break;
      case 7:
        exchangeto = 'Bomesp Global';
        break;
      case 8:
        exchangeto = 'Bomesp Brasil';
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
      // Reset
      walk.price = 0;
      walk.quantity = 0;
      walk.total = 0;
      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 20);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;         
      // buy - total
      // sell - quantity
      if (i === 0) {
        this.calcule(walk, orders, arb.entry);
      } else {        
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
    return arb.walks[arb.walks.length - 1].total;
  }
  // Ação de compra
  async oppTakerBuy(walk, entry, index) {
    let amt = null;
    // Comprar
    let b = await walk.exchange.setBuyMarket(walk.symbol, this.mask(walk.total, 8));

    while (b.data.success === false) {
      await this.wait(300);

      walk.total = 0;
      walk.quantity = 0;

      amt = await walk.exchange.getBalance(walk.trade);
      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 20);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;

      this.calcule(walk, orders, amt.data.result[0].Available); 

      b = await walk.exchange.setBuyMarket(walk.symbol, this.mask(walk.total, 8));
      console.log(`Forçando trade`);
    }

    console.log(`Troca de ${walk.base} por ${walk.quote} (${walk.total})`);
    console.log('Trade:', b.data.success ? 'Sucesso' : b.data.message);    
    
    // É preciso transferir ?
    if (walk.transfer) {
      await this.wait(300);

      let dt = null;
      let wallet = await walk.exchange.getBalance(walk.transfer.asset);
      let exchangeto = this.exchangeNameSelected(walk.transfer.exchangeto);

      if (walk.exchangeto === 3) {
        dt = await walk.exchange.setDirectTransfer(walk.transfer.asset, this.mask(walk.total, 8), walk.transfer.exchangeto, walk.transfer.mail);
      } else {
        dt = await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
      }

      console.log(`Enviando ${walk.transfer.asset} para ${exchangeto}`);
      console.log('Envio:', dt.data.success ? 'Sucesso' : dt.data.message);
    }
    // Redirect?
    if (walk.redirect) {
      await this.wait(300); 

      let wallet = await Bleutrade.getBalance(walk.redirect.asset);
      let exchangeto = this.exchangeNameSelected(walk.redirect.exchangeto);

      await Bleutrade.setDirectTransfer(walk.redirect.asset, wallet.data.result[0].Available, walk.redirect.exchangeto, walk.redirect.mail);
      console.log(`Redirect ${walk.redirect.asset} para ${exchangeto}`); 
    }

    await this.wait(300);
  }
  // Ação de venda
  async oppTakerSell(walk, entry, index) {
    let amt = null;
    // Vender
    let s = await walk.exchange.setSellMarket(walk.symbol, this.mask(walk.quantity, 8));

    while (s.data.success === false) {
      await this.wait(300);

      walk.total = 0;
      walk.quantity = 0;

      amt = await walk.exchange.getBalance(walk.trade);
      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 20);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;

      this.calcule(walk, orders, amt.data.result[0].Available); 

      s = await walk.exchange.setSellMarket(walk.symbol, this.mask(walk.quantity, 8));
      console.log(`Forçando trade`);
    }

    console.log(`Troca de ${walk.base} por ${walk.quote} (${walk.quantity})`);    
    console.log('Trade:', s.data.success ? 'Sucesso' : s.data.message);
    
    // É preciso transferir ?
    if (walk.transfer) {
      await this.wait(300);

      let dt = null;
      let wallet = await walk.exchange.getBalance(walk.transfer.asset);
      let exchangeto = this.exchangeNameSelected(walk.transfer.exchangeto);

      if (walk.exchangeto === 3) {
        dt = await walk.exchange.setDirectTransfer(walk.transfer.asset, this.mask(walk.quantity, 8), walk.transfer.exchangeto, walk.transfer.mail);
      } else {
        dt = await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
      }

      console.log(`Enviando ${walk.transfer.asset} para ${exchangeto}`);
      console.log('Envio:', dt.data.success ? 'Sucesso' : dt.data.message);
    }
    // Redirect?
    if (walk.redirect) {
      await this.wait(300); 

      let wallet = await Bleutrade.getBalance(walk.redirect.asset);
      let exchangeto = this.exchangeNameSelected(walk.redirect.exchangeto);

      await Bleutrade.setDirectTransfer(walk.redirect.asset, wallet.data.result[0].Available, walk.redirect.exchangeto, walk.redirect.mail);
      console.log(`Redirect ${walk.redirect.asset} para ${exchangeto}`); 
    }

    await this.wait(300);
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

  repeat(i, arb) {
    // Inserir o elemento anterior à frente, caso tenha lucro
    Arbitrations.splice(i + 1, 0, {
      ...arb, 
      gain: true
    });
  }

  clean() {
    Arbitrations.map((item, index) => {
      if (item.gain === true) {
        Arbitrations.splice(index, 1);
      } else {
        item.gain = false
      }
    });
  }

  async run() {
    do {
      try {
        for (let [i, arb] of Arbitrations.entries()) {

          // Calculando a quantidade
          try {
            await this.calcQntOutput(arb);
          } catch(e) {
            continue;
          };
          // Verificando se a lucro
          const profit = await this.calcProfitOutput(arb);
          
          if (profit === 0) {
            continue;
          } else {
            if (this.mask(profit, arb.decimal) > this.mask(arb.entry, arb.decimal)) {
              console.log(' ');   
              for (let [y, walk] of arb.walks.entries()) {
                // Iniciando rotinas
                await this.routine(walk, arb, y);
              }
              await Telegram.sendMessage(`[${arb.name}]: ${this.mask(profit, 8)}`);
              console.log(`Lucro de (${this.mask(arb.walks[arb.walks.length - 1].total, 8)})`);              
              // Repetindo um caminho com lucro
              this.repeat(i, arb);
              console.log(' ');      
            } else {
              if (i + 1 === Arbitrations.length) {
                console.log(`[CLEAN]`, arb.name, this.mask(profit, 8));                                
                this.clean();
              } else {
                console.log(`[${i + 1}/${Arbitrations.length}]`, arb.name, this.mask(profit, 8));                 
              }
            }               
          }                    
        } 
      } catch(e) {
        console.log(e.message)
      }
    } while (true);
  }
}

new Hades().run();
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

  // Atualizando o preço, procurando a melhor oferta
  async calcUpdateRate(walk, quantity) {
    let sum = 0;
    let price = 0;

    // Livro de ofertas
    let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 3);
    // Verificando a ação 
    let orders = walk.action === 'buy' ? book.sell : book.buy;

    for (let [index, order] of orders.entries()) {
      sum = sum + order.Quantity;
      if (quantity <= sum) {
        price = order.Rate;
        break;
      }
    }

    return price;
  }

  // Primeiro passo
  async calcQntOutput(arb) {
    let sum = 0;
    let old = 0;
    let calc = 0;
    let price = 0;

    for (let [i, walk] of arb.walks.entries()) {
      // Livro de ofertas
      let book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 3);
      // Verificando a ação 
      let orders = walk.action === 'buy' ? book.sell : book.buy;
      // Primeiro passo
      if (i === 0) {
        // Se for BTC ou outra moeda como quote e base for igual a BRL ou USDT
        // Calcular, com quantos USD posso comprar BTC ou outro moeda
        if (walk.base === 'BRL' || walk.base === 'USDT') {
          // Se for venda, calcule uma venda, senão calcule uma compra
          if (walk.action === 'sell') {
            for (let [s, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = this.calcQntSell(arb.entry, order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          } else {
            for (let [b, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = this.calcQntBuy(arb.entry, order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        } else if (walk.quote === 'BRL' || walk.quote === 'USDT') {
          // Se for venda, calcule uma venda, senão calcule uma compra
          if (walk.action === 'sell') {
            for (let [s, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = arb.entry
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          } else {
            for (let [b, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = arb.entry;
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        } else {
          // Se for venda, calcule uma venda, senão calcule uma compra
          if (walk.action === 'sell') {
            for (let [s, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = this.calcQntSell(arb.entry, order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          } else {
            for (let [b, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = this.calcQntBuy(arb.entry, order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        }
      // Se o quote da primeira for o mesmo da segunda, logo usaremos a quantidade do primeiro calculo
      } else if (i === 1 && arb.walks[0].quote === walk.quote) {
        // Se for venda, calcule uma venda, senão calcule uma compra
        if (walk.action === 'sell') {
          for (let [s, order] of orders.entries()) {
            sum = sum + order.Quantity;
            walk.quantity = arb.walks[0].quantity;
            if (walk.quantity <= sum) {
              walk.price = order.Rate;
              break;
            }
          }
        } else {
          for (let [b, order] of orders.entries()) {
            sum = sum + order.Quantity;
            walk.quantity = arb.walks[0].quantity;
            if (walk.quantity <= sum) {
              walk.price = order.Rate;
              break;
            }
          }
        }
      } else {
        // Se for BTC ou outra moeda como quote e base for igual a BRL ou USDT
        // Calcular, com quantos USD posso comprar BTC ou outro moeda
        if (walk.base === 'BRL' || walk.base === 'USDT') {
          // Se for venda, calcule uma venda, senão calcule uma compra
          if (walk.action === 'sell') {
            for (let [s, order] of orders.entries()) {
              sum = sum + order.Quantity;
              if (arb.walks[i - 1].action === 'sell') {
                old = this.calcQntSell(arb.walks[i - 1].quantity, arb.walks[i - 1].price, arb.walks[i - 1].fee);
              } else {
                old = this.calcQntBuy(arb.walks[i - 1].quantity, arb.walks[i - 1].price, arb.walks[i - 1].fee);
              }
              walk.quantity = this.calcQntSell(old, order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          } else {
            for (let [b, order] of orders.entries()) {
              sum = sum + order.Quantity;
              if (arb.walks[i - 1].action === 'sell') {
                old = this.calcQntSell(arb.walks[i - 1].quantity, arb.walks[i - 1].price, arb.walks[i - 1].fee);
              } else {
                old = this.calcQntBuy(arb.walks[i - 1].quantity, arb.walks[i - 1].price, arb.walks[i - 1].fee);
              }
              walk.quantity = this.calcQntBuy(old, order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        } else if (walk.quote === 'BRL' || walk.quote === 'USDT') {
          // Se for venda, calcule uma venda, senão calcule uma compra
          if (walk.action === 'sell') {
            for (let [s, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = arb.walks[i - 1].quantity;
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          } else {
            for (let [b, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = arb.walks[i - 1].quantity;
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        } else {
          // Se for venda, calcule uma venda, senão calcule uma compra
          if (arb.walks[i - 1].action === 'sell') {
            for (let [s, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = this.calcQntSell(arb.walks[i - 1].quantity, order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          } else {
            for (let [b, order] of orders.entries()) {
              sum = sum + order.Quantity;
              walk.quantity = this.calcQntBuy(arb.walks[i - 1].quantity, order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        }
      }      
    }
  }
  
  // Segundo passo
  async calcProfitOutput(arb) {
    const { walks } = arb;

    let sum = 0;
    let output = 0;

    // Livro de ofertas
    let book = await walks[walks.length - 1].exchange.getOrderBook(walks[walks.length - 1].symbol, 'ALL', 3);
    // Verificando a ação 
    let orders = walks[walks.length - 1].action === 'buy' ? book.sell : book.buy;

    if (walks[walks.length - 1].action === 'sell') {
      for (let [i, order] of orders.entries()) {
        sum = sum + order.Quantity;
        // Montando o preço da rotina
        if (walks[walks.length - 1].base === 'BRL' || walks[walks.length - 1].base === 'USDT') {
          output = walks[walks.length - 1].quantity;
        } else {
          output = this.calcQntSell(walks[walks.length - 1].quantity, order.Rate, walks[walks.length - 1].fee);
        }
        // Analisando entre as ordens se existe algum lucro
        if (output > arb.entry && walks[walks.length - 1].quantity <= sum) {
          walks[walks.length - 1].price = order.Rate;
          break;
        }
      }
    } else {
      for (let [index, order] of orders.entries()) {
        sum = sum + order.Quantity;
        // Montando o preço da rotina
        if (walks[walks.length - 1].base === 'BRL' || walks[walks.length - 1].base === 'USDT') {
          output = walks[walks.length - 1].quantity
        } else {
          output = this.calcQntBuy(walks[walks.length - 1].quantity, order.Rate, walks[walks.length - 1].fee);
        }
        // Analisando entre as ordens se existe algum lucro
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
    await walk.exchange.setBuyLimit(walk.symbol, walk.price, walk.quantity);
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
    await walk.exchange.setSellLimit(walk.symbol, walk.price, walk.quantity);
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
    if (index === 0) {
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
    
    /* Se for Bleutrade
    if (walk.exchangeto === 1) {
      if (walk.action === 'sell') {
        // Vender
        await this.oppTakerSell(walk, arb.entry);
      } else if (walk.action === 'buy') {
        // Comprar
        await this.oppTakerBuy(walk, arb.entry);                    
      }
    } else {
      // Se for diferente de Bleutrade
      if (walk.receive === null) {
        if (walk.action === 'sell') {
          // Vender
          await this.oppTakerSell(walk, arb.entry);
        } else if (walk.action === 'buy') {
          // Comprar
          await this.oppTakerBuy(walk, arb.entry);                    
        }
      } else {
        // Enviando BTC ou USDT para outras exchanges
        await this.rebalancingBalance(walk, arb.entry);

        if (walk.action === 'sell') {
          // Vender
          await this.oppTakerSell(walk, arb.entry);
        } else if (walk.action === 'buy') {
          // Comprar
          await this.oppTakerBuy(walk, arb.entry);                    
        }
      }
    }*/
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
            await Telegram.sendMessage(`[${arb.name}]: ${sprintf(`%.8f`, profit)}`);
            console.log('Enviando notificação por telegram');*/
            console.log(arb)
            process.exit()
          } else {
            console.log(arb.name, sprintf(`%.8f`, profit));
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
'use stricts';

const R = require('ramda');
const await = require('await');
const Telegram = require('./telegram');
const Bleutrade = require('./bleutrade');
const Arbitrations = require('./arbitration');

class Hades {
  
  constructor() {
    this.mail = 'tiago.a.trigo@gmail.com'
  }

  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  mask(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  calcQntBuy(entry, price, fee) {
    let quantity = (entry * fee) / price;
    return this.mask(quantity, 8); 
  }

  calcQntBuyBRL(entry, price, fee) {
    let quantity = (entry * fee) * price;
    return this.mask(quantity, 8); 
  }

  calcQntSell(entry, price, fee) {
    let quantity = (entry * price) * (1 - fee);
    return this.mask(quantity, 8);
  }

  calcQntSellBRL(entry, price, fee) {
    let quantity = (entry * price) * (1 - fee);
    return this.mask(quantity, 8);
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
      default:
        exchangeto = 'Exchange';
        break;
    }
    
    return exchangeto;
  }

  async rebalancingBalance(walk, entry) {
    let exchangeto = this.exchangeNameSelected(walk.receive.exchangeto);

    await Bleutrade.setDirectTransfer(walk.receive.asset, entry, walk.receive.exchangeto, walk.receive.mail);
    console.log(`Enviando ${walk.receive.asset} (${entry}) da Bleutrade para ${exchangeto}`);
  }

  async calcQntOutput(arbitration) {
    let sum = 0;
    let calc = 0;
    let price = 0;

    for (const [i, walk] of arbitration.walks.entries()) {
      // Livro de ofertas
      const book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 5);
      // Verificando a ação 
      const orders = walk.action === 'buy' ? book.sell : book.buy;

      if (i === 0) {
        if (walk.action === 'sell') {
          for (const order of orders) {
            sum = sum + order.Quantity;
            walk.quantity = (walk.quote === 'BTC' || walk.quote === 'USDT') ? arbitration.entry : this.calcQntSell(arbitration.entry, order.Rate, walk.fee);
            if (walk.quantity <= sum) {
              walk.price = order.Rate;
              break;
            }
          }  
        } else {
          for (const order of orders) {
            sum = sum + order.Quantity;
            walk.quantity = (walk.quote === 'BTC' || walk.quote === 'USDT') ? arbitration.entry : this.calcQntBuy(arbitration.entry, order.Rate, walk.fee);
            if (walk.quantity <= sum) {
              walk.price = order.Rate;
              break;
            }
          }
        }         
      }

      if (i === 1) {
        if (arbitration.walks[1].quote === arbitration.walks[0].quote) {
          if (walk.action === 'sell') {
            for (const order of orders) {
              sum = sum + order.Quantity;              
              walk.quantity = arbitration.walks[0].quantity;
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }  
          } else {
            for (const order of orders) {
              sum = sum + order.Quantity;
              walk.quantity = arbitration.walks[0].quantity;
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        } else {
          if (walk.action === 'sell') {
            for (const order of orders) {
              sum = sum + order.Quantity;
              if (walk.base === 'BRL') {
                if (arbitration.walks[0].action === 'sell') {
                  calc = this.calcQntSellBRL(arbitration.walks[0].quantity, arbitration.walks[0].price, arbitration.walks[0].fee);
                } else {
                  calc = this.calcQntBuyBRL(arbitration.walks[0].quantity, arbitration.walks[0].price, arbitration.walks[0].fee);
                }
              } else {
                if (arbitration.walks[0].action === 'sell' && arbitration.walks[1].base === arbitration.walks[0].base) {
                  calc = this.calcQntSell(arbitration.walks[0].quantity, arbitration.walks[0].price, arbitration.walks[0].fee);
                } else if (arbitration.walks[0].action === 'buy' && arbitration.walks[1].base === arbitration.walks[0].base) {
                  calc = this.calcQntBuy(arbitration.walks[0].quantity, arbitration.walks[0].price, arbitration.walks[0].fee);
                } else if (arbitration.walks[1].base != arbitration.walks[0].base) {
                  calc = arbitration.walks[0].quantity;
                }
              }
              walk.quantity = this.calcQntSell(this.mask(calc, 8), order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }  
          } else {
            for (const order of orders) {
              sum = sum + order.Quantity;   
              if (walk.base === 'BRL') {
                if (arbitration.walks[0].action === 'sell') {
                  calc = this.calcQntSellBRL(arbitration.walks[0].quantity, arbitration.walks[0].price, arbitration.walks[0].fee);
                } else {
                  calc = this.calcQntBuyBRL(arbitration.walks[0].quantity, arbitration.walks[0].price, arbitration.walks[0].fee);
                }
              } else {
                if (arbitration.walks[0].action === 'sell' && arbitration.walks[1].base === arbitration.walks[0].base) {
                  calc = this.calcQntSell(arbitration.walks[0].quantity, arbitration.walks[0].price, arbitration.walks[0].fee);
                } else if (arbitration.walks[0].action === 'buy' && arbitration.walks[1].base === arbitration.walks[0].base) {
                  calc = this.calcQntBuy(arbitration.walks[0].quantity, arbitration.walks[0].price, arbitration.walks[0].fee);
                } else if (arbitration.walks[1].base != arbitration.walks[0].base) {
                  calc = arbitration.walks[0].quantity;
                }
              }
              walk.quantity = this.calcQntBuy(this.mask(calc, 8), order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        }
      }

      if (i === 2) {
        if (arbitration.walks[1].quote === arbitration.walks[2].quote) {
          if (walk.action === 'sell') {
            for (const order of orders) {
              sum = sum + order.Quantity;              
              walk.quantity = arbitration.walks[1].quantity;
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }  
          } else {
            for (const order of orders) {
              sum = sum + order.Quantity;
              walk.quantity = arbitration.walks[1].quantity;
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }
          }
        } else {
          if (walk.action === 'sell') {
            for (const order of orders) {
              sum = sum + order.Quantity;
              if (walk.base === 'BRL') {
                if (arbitration.walks[1].action === 'sell') {
                  calc = this.calcQntSellBRL(arbitration.walks[1].quantity, arbitration.walks[1].price, arbitration.walks[1].fee);
                } else {
                  calc = this.calcQntBuyBRL(arbitration.walks[1].quantity, arbitration.walks[1].price, arbitration.walks[1].fee);
                }
              } else {
                if (arbitration.walks[1].action === 'sell') {
                  calc = arbitration.walks[1].quantity;
                } else {
                  calc = arbitration.walks[1].quantity;
                }
              }
              walk.quantity = this.calcQntSell(this.mask(calc, 8), order.Rate, walk.fee);
              if (walk.quantity <= sum) {
                walk.price = order.Rate;
                break;
              }
            }  
          } else {
            for (const order of orders) {
              sum = sum + order.Quantity;   
              if (walk.base === 'BRL') {
                if (arbitration.walks[1].action === 'sell') {
                  calc = this.calcQntSellBRL(arbitration.walks[1].quantity, arbitration.walks[1].price, arbitration.walks[1].fee);
                } else {
                  calc = this.calcQntBuyBRL(arbitration.walks[1].quantity, arbitration.walks[1].price, arbitration.walks[1].fee);
                }
              } else {
                if (arbitration.walks[1].action === 'sell') {
                  calc = arbitration.walks[1].quantity;
                } else {
                  calc = arbitration.walks[1].quantity;
                }
              }
              walk.quantity = this.calcQntBuy(this.mask(calc, 8), order.Rate, walk.fee);
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

  async calcUpdateRate(walk, quantity) {
    let sum = 0;
    let price = 0;

    // Livro de ofertas
    const book = await walk.exchange.getOrderBook(walk.symbol, 'ALL', 5);
    // Verificando a ação 
    const orders = walk.action === 'buy' ? book.sell : book.buy;

    for (const order of orders) {
      sum = sum + order.Quantity;
      if (quantity <= sum) {
        price = order.Rate;
        break;
      }
    }

    return price;
  }  

  async calcProfitOutput(arbitration) {
    const { 
      walks 
    } = arbitration;

    let sum = 0;
    let output = 0;

    // Livro de ofertas
    const book = await walks[walks.length - 1].exchange.getOrderBook(walks[walks.length - 1].symbol, 'ALL', 5);
    // Verificando a ação 
    const orders = walks[walks.length - 1].action === 'buy' ? book.sell : book.buy;

    if (walks[walks.length - 1].action === 'sell') {
      for (const order of orders) {
        sum = sum + order.Quantity;
        output = this.calcQntSell(walks[walks.length - 1].quantity, order.Rate, walks[walks.length - 1].fee);
        if (output > arbitration.entry && walks[walks.length - 1].quantity <= sum) {
          walks[walks.length - 1].price = order.Rate;
          break;
        }
      }
    } else {
      for (const order of orders) {
        sum = sum + order.Quantity;
        output = this.calcQntBuy(walks[walks.length - 1].quantity, order.Rate, walks[walks.length - 1].fee);
        if (output > arbitration.entry && walks[walks.length - 1].quantity <= sum) {
          walks[walks.length - 1].price = order.Rate;
          break;
        }
      }
    }

    return this.mask(output, 8);
  }  

  async opportunityTakerBuy(walk, entry) {
    let amount = await walk.exchange.getBalance(walk.quote);

    if ((amount.data.result[0].Available * walk.price) >= 0.0001) {
      let update = await this.calcUpdateRate(walk, amount.data.result[0].Available);
      // Comprar
      await walk.exchange.setBuyLimit(walk.symbol, update, amount.data.result[0].Available);
      console.log(`Troca de ${walk.base} por ${walk.quote} (${amount.data.result[0].Available})`);
    } else {
      // Comprar
      await walk.exchange.setBuyLimit(walk.symbol, walk.price, walk.quantity);
      console.log(`Troca de ${walk.base} por ${walk.quote} (${walk.quantity})`);
    }
    // Cancelando ordem
    let transactions = await walk.exchange.getOpenOrders(walk.symbol);

    if (transactions.data.result != null) {
      await walk.exchange.setOrderCancel(transactions.data.result[0].OrderID);
      console.log('Cancelando ordem');
      
      let wallet = await walk.exchange.getBalance(walk.quote);
      let rate = await calcUpdateRate(walk, wallet.data.result[0].Available)

      await walk.exchange.setBuyLimit(walk.symbol, rate, wallet.data.result[0].Available);
      console.log('Forçando compra da ordem cancelada.');
    }
    // É preciso transferir ?
    if (walk.transfer) {
      let wallet = await walk.exchange.getBalance(walk.transfer.asset);
      let exchangeto = this.exchangeNameSelected(walk.transfer.exchangeto);

      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
      console.log(`Enviando ${walk.transfer.asset} para exchange ${exchangeto}`);
    }
  }

  async opportunityTakerSell(walk, entry) {
    let amount = await walk.exchange.getBalance(walk.quote);

    if ((amount.data.result[0].Available * walk.price) >= 0.0001) {
      let update = await this.calcUpdateRate(walk, amount.data.result[0].Available);
      // Vender
      await walk.exchange.setSellLimit(walk.symbol, update, amount.data.result[0].Available);
      console.log(`Troca de ${walk.quote} (${amount.data.result[0].Available}) por ${walk.base}`);
    } else {
      // Vender
      await walk.exchange.setSellLimit(walk.symbol, walk.price, walk.quantity);
      console.log(`Troca de ${walk.quote} (${walk.quantity}) por ${walk.base}`);  
    }
    
    // Cancelando ordem se for preciso
    let transactions = await walk.exchange.getOpenOrders(walk.symbol);

    if (transactions.data.result != null) {
      await walk.exchange.setOrderCancel(transactions.data.result[0].OrderID);
      console.log('Cancelando ordem');

      let wallet = await walk.exchange.getBalance(walk.quote);
      let rate = await this.calcUpdateRate(walk, wallet.data.result[0].Available)

      await walk.exchange.setSellLimit(walk.symbol, rate, wallet.data.result[0].Available);
      console.log('Forçando venda da ordem cancelada.');
    }                   
    // É preciso transferir ?
    if (walk.transfer) {
      let wallet = await walk.exchange.getBalance(walk.transfer.asset);
      let exchangeto = this.exchangeNameSelected(walk.transfer.exchangeto);

      await walk.exchange.setDirectTransfer(walk.transfer.asset, wallet.data.result[0].Available, walk.transfer.exchangeto, walk.transfer.mail);
      console.log(`Enviando ${walk.transfer.asset} para exchange ${exchangeto}`);
    }
  }

  async routine(walk, arbitration) {
    // Se for Bleutrade
    if (walk.exchangeto === 1) {
      if (walk.action === 'sell') {
        // Vender
        await this.opportunityTakerSell(walk, arbitration.entry);
      } else if (walk.action === 'buy') {
        // Comprar
        await this.opportunityTakerBuy(walk, arbitration.entry);                    
      }
    } else {
      // Se for diferente de Bleutrade
      if (walk.receive === null) {
        if (walk.action === 'sell') {
          // Vender
          await this.opportunityTakerSell(walk, arbitration.entry);
        } else if (walk.action === 'buy') {
          // Comprar
          await this.opportunityTakerBuy(walk, arbitration.entry);                    
        }
      } else {
        // Enviando BTC ou USDT para outras exchanges
        await this.rebalancingBalance(walk, arbitration.entry);

        if (walk.action === 'sell') {
          // Vender
          await this.opportunityTakerSell(walk, arbitration.entry);
        } else if (walk.action === 'buy') {
          // Comprar
          await this.opportunityTakerBuy(walk, arbitration.entry);                    
        }
      }
    }
  }

  async run() {
    do {
      try {
        for (const [i, arbitration] of Arbitrations.entries()) {
          const { walks } = arbitration;
          // Calculando a quantidade
          await this.calcQntOutput(arbitration);
          // Verificando se a lucro
          const profit = await this.calcProfitOutput(arbitration);

          if (profit > arbitration.entry) {
            for (let [c, walk] of walks.entries()) {
              // Iniciando rotinas
              await this.routine(walk, arbitration);
              // Notificação
              if (c === (walks.length - 1)) {
                await Telegram.sendMessage(`[${arbitration.name}]: ${this.mask(profit, 8)}`);
                console.log('Notificando @tiagotrigo');
              } 
            }
            // process.exit();
          } else {
            console.log(arbitration.name, profit);
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
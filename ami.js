'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const coins = require('./coins.js');
const Telegram = require('./telegram');

class Hades {
  
  constructor() {
    this.min = 0.02,
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

  // Buy
  calcBuy(amount, rate, fee) {   
    const qnt = (amount * fee) / rate;

    return qnt;
  }

  // Sell
  calcSell(amount, rate, fee) {
    const qnt = (amount * rate);

    return qnt;
  }

  async amiBuy(exchange, entry, market, fee) {
    let ex   = await exchange.getOrderBook(market, 'SELL', 3);
    let rate  = ex.sell[0].Rate;
    let qnt  = this.calcBuy(entry, rate, fee);

    return {
      rate,
      qnt
    }
  }

  async amiSell(exchange, entry, market) {
    let ex   = await exchange.getOrderBook(market, 'ALL', 3);
    let rate = ex.sell[0].Rate - 0.00000001;
    let ami  = ex.buy[0].Rate + 0.00000001;
    let qnt  = this.calcSell(entry, ami);

    return {
      rate,
      ami,
      qnt
    }
  }

  async run() {
    do {
      try {
        for (let coin of coins) {
          const {
            symbol,
            divisor,
            dividend
          } = coin;

          let buy = await this.amiBuy(Bleutrade, this.min, 'ETH_USDT', 0.9985);
          let sell = await this.amiSell(Exc, buy.qnt, 'ETH_USDT');

          let book = await Exc.getOrderBook('ETH_USDT', 'SELL', 2);
          let order = await Exc.getOpenOrders('ETH_USDT');

          if (sell.qnt > this.min && order.data.result === null) {
            // Criando compra
            await Bleutrade.setBuyLimit('ETH_USDT', buy.rate, buy.qnt);
            console.log('Trocando USDT por ETH')
            // Transferência
            await Bleutrade.setDirectTransfer('ETH', buy.qnt, 2, 'tiago.a.trigo@gmail.com');
            console.log('Enviando ETH para Exccrippto')
            // Ativando AMI de venda
            await Exc.setSellAmi('ETH_USDT', sell.rate, sell.ami, buy.qnt);
            console.log('Ativando AMI de venda')
          } else if (book.sell[0].Rate != (order.data.result && order.data.result[0].Price)) {
            let qnt = order.data.result[0].Quantity;
            let updateRate = await this.amiSell(Exc, qnt, 'ETH_USDT');

            // se ordem ami ativa, sempre deixando ela na primeira
            await Exc.setOrderCancel(order.data.result[0].OrderID);
            console.log('Realocando na primeira posição');

            await Exc.setSellAmi('ETH_USDT', updateRate.rate, updateRate.ami, qnt);
            console.log('Reabrindo ordem AMI de venda')
          } else if (order.data.result && order.data.result[0].Type === 'BUY') {
            // se ordem ami ativa, sempre deixando ela na primeira
            await Exc.setOrderCancel(order.data.result[0].OrderID);
            console.log('Cancelando ordem AMI de compra');

            let balance = await Exc.getBalance('USDT');

            await Exc.setDirectTransfer('USDT', balance.data.result[0].Available, 1, 'tiago.a.trigo@gmail.com');
            console.log('Enviando ETH para Bleutrade');
          } else if (order.data.result != null) {
            console.log(order.data.result[0]);
            console.log(' ');
          } else {
            console.log('ETH_USDT', sell.qnt)
          }
        }
      } catch(e) {
        console.log(e);
      }
    } while (true)
  }
}

new Hades().run();
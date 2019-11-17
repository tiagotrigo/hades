'use stricts';

const R = require('ramda');
const ccxt = require('ccxt');
const await = require('await');
const walks = require('./walks');
const exchanges = require('./exchanges');

class Hades {
  
  constructor() {
  }

  searchMarket(markets) {
    return R.keys(markets);
  }

  searchQuote(quote, payload) {
    return R.filter((n) => n.split('/')[1] === quote, payload);
  }

  mask(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  async run() {
    do {
      try {
        for (let [i, item] of exchanges.entries()) {
          // Exchange Id
          let exchangeId = item.id; 
          let exchangeClass = ccxt[exchangeId];
          // Exchange
          let exchange = new exchangeClass({
            'apiKey': item.apiKey,
            'secret': item.secret,
            'timeout': 30000,
            'enableRateLimit': true,
            'options': {
              'adjustForTimeDifference': true
            }
          });
          // Market
          let markets = await exchange.loadMarkets();
          let market = this.searchMarket(markets);
          for (let m of walks) {
            // Filtrando mercado
            let mkt = this.searchQuote(m.market, market);
            //
            for (let item of mkt) {
              let o1 = await exchange.fetchOrderBook(`${m.market}/BTC`);
              let o2 = await exchange.fetchOrderBook(item);
              let o3 = await exchange.fetchOrderBook(`${item.split('/')[0]}/BTC`);

              if (o1.asks.length > 0 && o2.asks.length > 0 && o3.bids.length) {
                let c1 = (0.002 * 0.9990) / o1.asks[0][0];
                let c2 = (this.mask(c1, 8) * 0.9990) / o2.asks[0][0];
                let c3 = (this.mask(c2, 8) * o3.bids[0][0]) * (1 - 0.001);

                if (this.mask(c3, 8) > 0.002) {
                  console.log(`[${item.split('/')[0]}] =>`, this.mask(c3, 8), 'OK');
                } else {
                  console.log(`[${item.split('/')[0]}] =>`, this.mask(c3, 8));
                }
              }
            }
          }
        }
      } catch(e) {
        console.log(e)
      }
    } while (true);
  }
}

new Hades().run();
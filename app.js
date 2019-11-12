'use stricts';

const R = require('ramda');
const ccxt = require('ccxt');
const await = require('await');
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
          // Filtrando mercado
          let btcs = this.searchQuote('BTC', market);
          let bnbs = this.searchQuote('BNB', market);
          // Verificando igualdade entre os 2 mercados
          let btc_bnb = R.map((item, index) => {
            return R.filter((n) => n.split('/')[0] === item.split('/')[0], bnbs);
          }, btcs);
          // Limpando array
          btc_bnb = R.reject(R.isEmpty, btc_bnb);
          //
          
          console.log(btc_bnb, bnb_btc)

          process.exit()
        }
      } catch(e) {
        console.log(e)
      }
    } while (true);
  }
}

new Hades().run();
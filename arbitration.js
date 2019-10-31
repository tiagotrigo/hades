"use strict";

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

const Arbitration = [
  {
    id: 1,
    name: 'BTC_USDT_BRL_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',

        transfer: {
          asset: 'USDT',
          exchangeto: 3,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.0024,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'USDT_BRL',
        dividend: 'USDT',
        divisor: 'BRL',

        transfer: null
      },
      {
        id: 3,
        exchangeto: 3,
        exchange: Bitrecife,        
        fee: 0.9976,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'BTC_BRL',
        dividend: 'BTC',
        divisor: 'BRL',

        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com',
        }
      },
    ]
  },
  {
    id: 2,
    name: 'BTC_BRL_USDT_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.0024,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'BTC_BRL',
        dividend: 'BTC',
        divisor: 'BRL',

        transfer: null
      },
      {
        id: 2,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'USDT_BRL',
        dividend: 'USDT',
        divisor: 'BRL',

        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 3,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',

        transfer: null
      }
    ]
  },
  {
    id: 3,
    name: 'LTC_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',

        transfer: {
          asset: 'LTC',
          exchangeto: 2,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',

        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 4,
    name: 'LTC_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',

        transfer: {
          asset: 'LTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',

        transfer: null
      }
    ]
  },
  {
    id: 5,
    name: 'ETH_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',

        transfer: {
          asset: 'ETH',
          exchangeto: 2,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',

        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 6,
    name: 'ETH_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',

        transfer: {
          asset: 'ETH',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',

        transfer: null
      }
    ]
  },
  {
    id: 7,
    name: 'BTC_USDT',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',

        transfer: {
          asset: 'USDT',
          exchangeto: 2,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',

        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 8,
    name: 'BTC_USDT',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',
        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',
        transfer: null
      }
    ]
  },
  {
    id: 9,
    name: 'ETH_USDT',
    entry: 1,
    walks: [
      {
        id: 1,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT',
        transfer: {
          asset: 'ETH',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT',
        transfer: null
      }
    ]
  },
  {
    id: 10,
    name: 'ETH_USDT',
    entry: 1,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT',
        transfer: {
          asset: 'ETH',
          exchangeto: 2,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT',
        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 11,
    name: 'LTC_USDT',
    entry: 1,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT',
        transfer: {
          asset: 'LTC',
          exchangeto: 2,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT',
        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 12,
    name: 'LTC_USDT',
    entry: 1,
    walks: [
      {
        id: 1,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT',
        transfer: {
          asset: 'LTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT',
        transfer: null
      }
    ]
  },
  {
    id: 13,
    name: 'BTC_ETH_DOGE_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',
        transfer: {
          asset: 'ETH',
          exchangeto: 2,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'ETH_DOGE',
        dividend: 'ETH',
        divisor: 'DOGE',
        transfer: null
      },
      {
        id: 3,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'DOGE_BTC',
        dividend: 'DOGE',
        divisor: 'BTC',
        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 14,
    name: 'BTC_LTC_DOGE_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,        
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',
        transfer: {
          asset: 'LTC',
          exchangeto: 2,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'LTC_DOGE',
        dividend: 'LTC',
        divisor: 'DOGE',

        transfer: null
      },
      {
        id: 3,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'DOGE_BTC',
        dividend: 'DOGE',
        divisor: 'BTC',
        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 15,
    name: 'USDT_BRL_BTC_USDT',
    entry: 1,
    walks: [
      {
        id: 1,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.0024,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'USDT_BRL',
        dividend: 'USDT',
        divisor: 'BRL',
        transfer: null
      },
      { 
        id: 2,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'BTC_BRL',
        dividend: 'BTC',
        divisor: 'BRL',
        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 3,
        exchangeto: 3,
        exchange: Bleutrade,        
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',
        transfer: null
      },
    ]
  },
  {
    id: 16,
    name: 'USDT_NBC_BRL_USDT',
    entry: 1,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'NBC_USDT',
        dividend: 'NBC',
        divisor: 'USDT',
        transfer: {
          asset: 'NBC',
          exchangeto: 3,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      { 
        id: 2,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.0024,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'NBC_BRL',
        dividend: 'NBC',
        divisor: 'BRL',
        transfer: null
      },
      { 
        id: 3,
        exchangeto: 1,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'USDT_BRL',
        dividend: 'USDT',
        divisor: 'BRL',
        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 17,
    name: 'USDT_BRL_NBC_USDT',
    entry: 1,
    walks: [
      {
        id: 1,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.0024,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'USDT_BRL',
        dividend: 'USDT',
        divisor: 'BRL',
        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      { 
        id: 2,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'NBC_BRL',
        dividend: 'NBC',
        divisor: 'BRL',
        transfer: {
          asset: 'NBC',
          exchangeto: 1,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      { 
        id: 3,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'NBC_USDT',
        dividend: 'NBC',
        divisor: 'USDT',
        transfer: null
      }
    ]
  },
  {
    id: 18,
    name: 'BTC_NBC_BRL_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'NBC_BTC',
        dividend: 'BTC',
        divisor: 'NBC',
        transfer: {
          asset: 'NBC',
          exchangeto: 3,
          email: 'tiago.a.trigo@gmail.com'
        }
      },
      { 
        id: 2,
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.0024,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'sell',
        market: 'NBC_BRL',
        dividend: 'NBC',
        divisor: 'BRL',
        transfer: null
      },
      { 
        id: 3,
        exchangeto: 1,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        sum: [],
        action: 'buy',
        market: 'BTC_BRL',
        dividend: 'BTC',
        divisor: 'BRL',
        transfer: null
      }
    ]
  }
];

module.exports = Arbitration;
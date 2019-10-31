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
        exchange: Bleutrade,
        go: 3,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT'
      },
      {
        id: 2,
        exchange: Bitrecife,
        go: 0,
        fee: 0.0024,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'USDT_BRL',
        dividend: 'USDT',
        divisor: 'BRL'
      },
      {
        id: 3,
        exchange: Bitrecife,
        go: 1,   
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'BTC_BRL',
        dividend: 'BTC',
        divisor: 'BRL'
      }
    ]
  },
  {
    id: 2,
    name: 'BTC_BRL_USDT_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchange: Bitrecife,
        go: 0,       
        fee: 0.0024,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'BTC_BRL',
        dividend: 'BTC',
        divisor: 'BRL'
      },
      {
        id: 2,
        exchange: Bitrecife,
        go: 0,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'USDT_BRL',
        dividend: 'USDT',
        divisor: 'BRL'
      },
      {
        id: 3,
        exchange: Bleutrade,
        go: 1,        
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT'
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
        exchange: Bleutrade,
        go: 2,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC'
      },
      {
        id: 2,
        exchange: Exc,
        go: 1,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC'
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
        exchange: Exc,
        go: 1,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC'
      },
      {
        id: 2,
        exchange: Bleutrade,
        go: 0,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC'
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
        exchange: Bleutrade,
        go: 2,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC'
      },
      {
        id: 2,
        exchange: Exc,
        go: 1,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC'
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
        exchange: Exc,
        go: 1,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC'
      },
      {
        id: 2,
        exchange: Bleutrade,
        go: 0,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC'
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
        exchange: Bleutrade,
        go: 2,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT'
      },
      {
        id: 2,
        exchange: Exc,
        go: 1,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT'
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
        exchange: Exc,
        go: 1,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT'
      },
      {
        id: 2,
        exchange: Bleutrade,
        go: 0,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT'
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
        exchange: Exc,
        go: 1,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT'
      },
      {
        id: 2,
        exchange: Bleutrade,
        go: 0,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT'
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
        exchange: Bleutrade,
        go: 2,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT'
      },
      {
        id: 2,
        exchange: Exc,
        go: 1,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT'
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
        exchange: Bleutrade,
        go: 2,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT'
      },
      {
        id: 2,
        exchange: Exc,
        go: 1,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT'
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
        exchange: Exc,
        go: 1,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT'
      },
      {
        id: 2,
        exchange: Bleutrade,
        go: 0,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT'
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
        exchange: Bleutrade,
        go: 2,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC'
      },
      {
        id: 2,
        exchange: Exc,
        go: 0,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'ETH_DOGE',
        dividend: 'ETH',
        divisor: 'DOGE'
      },
      {
        id: 3,
        exchange: Exc,
        go: 1,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'DOGE_BTC',
        dividend: 'DOGE',
        divisor: 'BTC'
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
        exchange: Bleutrade,
        go: 2,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC'
      },
      {
        id: 2,
        exchange: Exc,
        go: 0,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'LTC_DOGE',
        dividend: 'LTC',
        divisor: 'DOGE'
      },
      {
        id: 3,
        exchange: Exc,
        go: 1,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'DOGE_BTC',
        dividend: 'DOGE',
        divisor: 'BTC'
      }
    ]
  }
];

module.exports = Arbitration;
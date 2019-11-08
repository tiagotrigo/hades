"use strict";

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

const Arbitration = [
  {
    id: 1,
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
        sum: null,
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',
        receive: null,
        transfer: null
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',
        receive: null,
        transfer: null
      }
    ]
  },
  {
    id: 2,
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
        sum: null,
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',
        receive: null,
        transfer: null
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',
        receive: null,
        transfer: null
      }
    ]
  },
  {
    id: 3,
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
        sum: null,
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',
        receive: null,
        transfer: {
          asset: 'ETH',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      }
    ]
  },
  {
    id: 4,
    name: 'ETH_USDT',
    entry: 0.02,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'buy',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT',
        receive: null,
        transfer: {
          asset: 'ETH',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    id: 5,
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
        sum: null,
        action: 'buy',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',
        receive: {
          asset: 'BTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'ETH',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'ETH_BTC',
        dividend: 'ETH',
        divisor: 'BTC',
        receive: null,
        transfer: null
      },
    ]
  },
  {
    id: 6,
    name: 'ETH_USDT',
    entry: 0.02,
    walks: [
      {
        id: 1,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'buy',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT',
        receive: {
          asset: 'USDT',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'ETH',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'ETH_USDT',
        dividend: 'ETH',
        divisor: 'USDT',
        receive: null,
        transfer: null
      },
    ]
  },
  {
    id: 7,
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
        sum: null,
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',
        receive: {
          asset: 'BTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'LTC',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',
        receive: null,
        transfer: null
      },
    ]
  },
  {
    id: 8,
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
        sum: null,
        action: 'buy',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',
        receive: null,
        transfer: {
          asset: 'LTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    id: 9,
    name: 'LTC_USDT',
    entry: 0.02,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'buy',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT',
        receive: null,
        transfer: {
          asset: 'LTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    id: 10,
    name: 'LTC_USDT',
    entry: 0.02,
    walks: [
      {
        id: 1,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'buy',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT',
        receive: {
          asset: 'USDT',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'LTC',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'LTC_USDT',
        dividend: 'LTC',
        divisor: 'USDT',
        receive: null,
        transfer: null
      },
    ]
  },
  {
    id: 11,
    name: 'BTC_USDT',
    entry: 0.99,
    walks: [
      {
        id: 1,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'buy',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',
        receive: {
          asset: 'USDT',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'BTC',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',
        receive: null,
        transfer: null
      },
    ]
  },
  {
    id: 11,
    name: 'BTC_USDT',
    entry: 0.99,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'buy',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        id: 2,
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'BTC_USDT',
        dividend: 'BTC',
        divisor: 'USDT',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    id: 13,
    name: 'BTC_NBC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'buy',
        market: 'NBC_BTC',
        dividend: 'NBC',
        divisor: 'BTC',
        receive: null,
        transfer: null
      },
      {
        id: 2,
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        sum: null,
        action: 'sell',
        market: 'NBC_BTC',
        dividend: 'NBC',
        divisor: 'BTC',
        receive: null,
        transfer: null
      },
    ]
  },
];

module.exports = Arbitration;
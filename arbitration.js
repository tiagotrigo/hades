"use strict";

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const Bullgain = require('./bullgain.js');
const Staging = require('./staging.js');
const Bomesp = require('./bomesp.js');

const Arbitration = [
  {
    name: 'BTC_USDT',
    entry: 0.2,
    walks: [
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'BTC_USDT',
        quote: 'BTC',
        base: 'USDT',
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
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'BTC_USDT',
        quote: 'BTC',
        base: 'USDT',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'BTC_USDT',
    entry: 0.2,
    walks: [
      {
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'BTC_USDT',
        quote: 'BTC',
        base: 'USDT',
        receive: {
          asset: 'USDT',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'BTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'BTC_USDT',
        quote: 'BTC',
        base: 'USDT',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'ETH_BTC',
    entry: 0.0002,
    walks: [
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ETH_BTC',
        quote: 'ETH',
        base: 'BTC',
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
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_BTC',
        quote: 'ETH',
        base: 'BTC',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'LTC_BTC',
    entry: 0.0002,
    walks: [
      {
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'LTC_BTC',
        quote: 'LTC',
        base: 'BTC',
        receive: {
          asset: 'BTC',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'LTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'LTC_BTC',
        quote: 'LTC',
        base: 'BTC',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'LTC_BTC',
    entry: 0.0002,
    walks: [
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'LTC_BTC',
        quote: 'LTC',
        base: 'BTC',
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
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'LTC_BTC',
        quote: 'LTC',
        base: 'BTC',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'ETH_USDT',
    entry: 0.2,
    walks: [
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
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
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'ETH_USDT',
    entry: 0.2,
    walks: [
      {
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
        receive: {
          asset: 'USDT',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'ETH',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'LTC_USDT',
    entry: 0.2,
    walks: [
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
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
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'LTC_USDT',
    entry: 0.2,
    walks: [
      {
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
        receive: {
          asset: 'USDT',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'LTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  // {
  //   name: 'BTC_USDT_DOGE_BTC',
  //   entry: 0.0002,
  //   walks: [
  //     {
  //       exchangeto: 2,
  //       exchange: Exc,
  //       fee: 0.0025,
  //       price: 0,
  //       quantity: 0,
  //       action: 'sell',
  //       symbol: 'BTC_USDT',
  //       quote: 'BTC',
  //       base: 'USDT',
  //       receive: {
  //         asset: 'BTC',
  //         exchangeto: 2,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       },
  //       transfer: null
  //     },
  //     {
  //       exchangeto: 2,
  //       exchange: Exc,
  //       fee: 0.9975,
  //       price: 0,
  //       quantity: 0,
  //       action: 'buy',
  //       symbol: 'DOGE_USDT',
  //       quote: 'DOGE',
  //       base: 'USDT',
  //       receive: null,
  //       transfer: null
  //     },
  //     {
  //       exchangeto: 2,
  //       exchange: Exc,
  //       fee: 0.0025,
  //       price: 0,
  //       quantity: 0,
  //       action: 'sell',
  //       symbol: 'DOGE_BTC',
  //       quote: 'DOGE',
  //       base: 'BTC',
  //       receive: null,
  //       transfer: {
  //         asset: 'BTC',
  //         exchangeto: 9,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       }
  //     },
  //   ]
  // },
];

module.exports = Arbitration;
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
        total: 0,
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
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'BTC_USDT',
        quote: 'BTC',
        base: 'USDT',
        total: 0,
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
        total: 0,
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
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'BTC_USDT',
        quote: 'BTC',
        base: 'USDT',
        total: 0,
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
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
        total: 0,
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
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
        total: 0,
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
        total: 0,
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
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
        total: 0,
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
        total: 0,
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
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
        total: 0,
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
        total: 0,
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
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
        total: 0,
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
        total: 0,
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
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_BTC',
        quote: 'ETH',
        base: 'BTC',
        total: 0,
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
    name: 'ETH_BTC',
    entry: 0.0002,
    walks: [
      {
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ETH_BTC',
        quote: 'ETH',
        base: 'BTC',
        total: 0,
        receive: {
          asset: 'BTC',
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
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_BTC',
        quote: 'ETH',
        base: 'BTC',
        total: 0,
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
        total: 0,
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
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'LTC_BTC',
        quote: 'LTC',
        base: 'BTC',
        total: 0,
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
        total: 0,
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
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'LTC_BTC',
        quote: 'LTC',
        base: 'BTC',
        total: 0,
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  // 3 Passos
  // {
  //   name: 'DOGE_BTC_USDT_BTC',
  //   entry: 0.0002,
  //   walks: [
  //     {
  //       exchangeto: 2,
  //       exchange: Exc,
  //       fee: 0.0025,
  //       price: 0,
  //       quantity: 0,
  //       action: 'buy',
  //       symbol: 'DOGE_BTC',
  //       quote: 'DOGE',
  //       base: 'BTC',
  //       trade: 'DOGE',
  //       receive: {
  //         asset: 'BTC',
  //         exchangeto: 2,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       },
  //       transfer: {
  //         asset: 'DOGE',
  //         exchangeto: 2,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       }
  //     },
  //     {
  //       exchangeto: 2,
  //       exchange: Exc,
  //       fee: 0.0025,
  //       price: 0,
  //       quantity: 0,
  //       action: 'sell',
  //       symbol: 'LTC_BTC',
  //       quote: 'LTC',
  //       base: 'BTC',
  //       trade: 'LTC',
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
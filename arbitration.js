"use strict";

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const Bullgain = require('./bullgain.js');
const Stonoex = require('./stonoex.js');
const Staging = require('./staging.js');
const ComprarBitcoin = require('./comprarBitcoin.js');

let Arbitration = [
  // BRL
  {
    name: 'ETH_BRL >> ETH_BRL >> USDT_BRL >> USDT_BRL',
    entry: 200,
    decimal: 2,
    walks: [
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ETH_BRL',
        quote: 'ETH',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
        transfer: {
          asset: 'ETH',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 9,
        exchange: Bullgain,
        fee: 0.9968,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_BRL',
        quote: 'ETH',
        base: 'BRL',
        total: 0,
        trade: 'ETH',
        receive: null,
        transfer: null
      },
      {
        exchangeto: 9,
        exchange: Bullgain,
        fee: 0.9968,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
      }
    ]
  },
  {
    name: 'BTC_BRL >> BTC_BRL >> USDT_BRL >> USDT_BRL',
    entry: 200,
    decimal: 2,
    walks: [
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'BTC_BRL',
        quote: 'BTC',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 9,
        exchange: Bullgain,
        fee: 0.9968,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'BTC_BRL',
        quote: 'BTC',
        base: 'BRL',
        total: 0,
        trade: 'BTC',
        receive: null,
        transfer: null
      },
      {
        exchangeto: 9,
        exchange: Bullgain,
        fee: 0.9968,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
      }
    ]
  },
  {
    name: 'USDT_BRL >> USDT_BRL >> ETH_BRL >> ETH_BRL',
    entry: 200,
    decimal: 2,
    walks: [
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 9,
        exchange: Bullgain,
        fee: 0.9968,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
      },
      {
        exchangeto: 9,
        exchange: Bullgain,
        fee: 0.9968,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ETH_BRL',
        quote: 'ETH',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
        transfer: {
          asset: 'ETH',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_BRL',
        quote: 'ETH',
        base: 'BRL',
        total: 0,
        trade: 'ETH',
        receive: null,
        transfer: null
      }
    ]
  },

  {
    name: 'BTC_BRL >> BTC_USDT >> USDT_BRL',
    entry: 200,
    decimal: 2,
    walks: [
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'BTC_BRL',
        quote: 'BTC',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
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
        trade: 'BTC',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
      }
    ]
  },
  {
    name: 'ETH_BRL >> ETH_USDT >> USDT_BRL',
    entry: 200,
    decimal: 2,
    walks: [
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ETH_BRL',
        quote: 'ETH',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
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
        trade: 'ETH',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
      }
    ]
  },
  {
    name: 'USDC_BRL >> BTC_USDC >> BTC_BRL',
    entry: 200,
    decimal: 2,
    walks: [
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'USDC_BRL',
        quote: 'USDC',
        base: 'BRL',
        total: 0,
        trade: 'BRL',
        receive: null,
        transfer: {
          asset: 'USDC',
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
        action: 'buy',
        symbol: 'BTC_USDC',
        quote: 'BTC',
        base: 'USDC',
        total: 0,
        trade: 'USDC',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 3,
        exchange: Bitrecife,
        fee: 0.9976,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'BTC_BRL',
        quote: 'BTC',
        base: 'BRL',
        total: 0,
        trade: 'BTC',
        receive: null,
        transfer: null
      }
    ]
  },
  // BTC  
  /*{
    name: 'LTC_BTC >> LTC_BTC',
    entry: 0.001,
    decimal: 8,
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
        trade: 'BTC',
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
        trade: 'LTC',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'LTC_BTC >> LTC_BTC',
    entry: 0.001,
    decimal: 8,
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
        trade: 'BTC',
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
        trade: 'LTC',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'LTC_BTC >> LTC_USDT >> BTC_USDT',
    entry: 0.001,
    decimal: 8,
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
        trade: 'BTC',
        receive: {
          asset: 'BTC',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: null
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
        trade: 'LTC',
        receive: null,
        transfer: null
      },
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
        trade: 'USDT',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },   
  {
    name: 'LTC_BTC >> LTC_USDT >> BTC_USDT',
    entry: 0.001,
    decimal: 8,
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
        trade: 'BTC',
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
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
        total: 0,
        trade: 'LTC',
        receive: null,
        transfer: null
      },
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
        trade: 'USDT',
        receive: null,
        transfer: {
          asset: 'BTC',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  }*/
];

module.exports = Arbitration;
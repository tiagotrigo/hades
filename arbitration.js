"use strict";

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const Bullgain = require('./bullgain.js');
const Staging = require('./staging.js');
const ComprarBitcoin = require('./comprarBitcoin.js');

let Arbitration = [
  // BRL
  {
    name: 'BTC_BRL >> BTC_USDT >> USDT_BRL',
    entry: 500,
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
      },
    ]
  },
  {
    name: 'BTC_BRL >> BTC_USDC >> USDC_BRL',
    entry: 500,
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
        symbol: 'BTC_USDC',
        quote: 'BTC',
        base: 'USDC',
        total: 0,
        trade: 'BTC',
        receive: null,
        transfer: {
          asset: 'USDC',
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
        symbol: 'USDC_BRL',
        quote: 'USDC',
        base: 'BRL',
        total: 0,
        trade: 'USDC',
        receive: null,
        transfer: null
      },
    ]
  },
  // {
  //   name: 'CBRL_BRL >> CBRL_BRL >> BTC_BRL >> BTC_BRL',
  //   entry: 500,
  //   decimal: 2,
  //   walks: [
  //     {
  //       exchangeto: 3,
  //       exchange: Bitrecife,
  //       fee: 0.9976,
  //       price: 0,
  //       quantity: 0,
  //       action: 'buy',
  //       symbol: 'CBRL_BRL',
  //       quote: 'CBRL',
  //       base: 'BRL',
  //       total: 0,
  //       trade: 'BRL',
  //       receive: null,
  //       transfer: {
  //         asset: 'CBRL',
  //         exchangeto: 9,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       }
  //     },
  //     {
  //       exchangeto: 9,
  //       exchange: Bullgain,
  //       fee: 0.99684,
  //       price: 0,
  //       quantity: 0,
  //       action: 'sell',
  //       symbol: 'CBRL_BRL',
  //       quote: 'CBRL',
  //       base: 'BRL',
  //       total: 0,
  //       trade: 'CBRL',
  //       receive: null,
  //       transfer: null
  //     },
  //     {
  //       exchangeto: 9,
  //       exchange: Bullgain,
  //       fee: 0.99684,
  //       price: 0,
  //       quantity: 0,
  //       action: 'buy',
  //       symbol: 'BTC_BRL',
  //       quote: 'BTC',
  //       base: 'BRL',
  //       total: 0,
  //       trade: 'BRL',
  //       receive: null,
  //       transfer: {
  //         asset: 'BTC',
  //         exchangeto: 3,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       }
  //     },
  //     {
  //       exchangeto: 3,
  //       exchange: Bitrecife,
  //       fee: 0.9976,
  //       price: 0,
  //       quantity: 0,
  //       action: 'sell',
  //       symbol: 'BTC_BRL',
  //       quote: 'BTC',
  //       base: 'BRL',
  //       total: 0,
  //       trade: 'BTC',
  //       receive: null,
  //       transfer: null
  //     },
  //   ]
  // },
  // USDT
  {
    name: 'USDT_BRL >> BTC_BRL >> BTC_USDT',
    entry: 20,
    decimal: 6,
    walks: [
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
      },
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
    ]
  },
  {
    name: 'BTC_USDT >> DOGE_BTC >> DOGE_USDT',
    entry: 20,
    decimal: 6,
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
        trade: 'USDT',
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
        action: 'buy',
        symbol: 'DOGE_BTC',
        quote: 'DOGE',
        base: 'BTC',
        total: 0,
        trade: 'BTC',
        receive: null,
        transfer: null
      },
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'DOGE_USDT',
        quote: 'DOGE',
        base: 'USDT',
        total: 0,
        trade: 'DOGE',
        receive: null,
        transfer: {
          asset: 'USDT',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'USDT_BRL >> BTC_BRL >> BTC_USDT',
    entry: 20,
    decimal: 6,
    walks: [
      {
        exchangeto: 9,
        exchange: Bullgain,
        fee: 0.99684,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'USDT_BRL',
        quote: 'USDT',
        base: 'BRL',
        total: 0,
        trade: 'USDT',
        receive: {
          asset: 'USDT',
          exchangeto: 9,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: null
      },
      {
        exchangeto: 9,
        exchange: Bullgain,
        fee: 0.99684,
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
    ]
  },
  // FIM USDT

  // CBRL
  {
    name: 'USDT_CBRL >> USDT_CBRL',
    entry: 45,
    decimal: 2,
    walks: [
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'USDT_CBRL',
        quote: 'USDT',
        base: 'CBRL',
        total: 0,
        trade: 'CBRL',
        receive: {
          asset: 'CBRL',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'USDT',
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
        symbol: 'USDT_CBRL',
        quote: 'USDT',
        base: 'CBRL',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: {
          asset: 'CBRL',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  {
    name: 'USDT_CBRL >> USDT_CBRL',
    entry: 45,
    decimal: 2,
    walks: [
      {
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'USDT_CBRL',
        quote: 'USDT',
        base: 'CBRL',
        total: 0,
        trade: 'CBRL',
        receive: {
          asset: 'CBRL',
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'USDT',
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
        symbol: 'USDT_CBRL',
        quote: 'USDT',
        base: 'CBRL',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: {
          asset: 'CBRL',
          exchangeto: 3,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  // FIM CBRL

  // BTC  
  {
    name: 'ETH_BTC >> ETH_BTC',
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
        symbol: 'ETH_BTC',
        quote: 'ETH',
        base: 'BTC',
        total: 0,
        trade: 'BTC',
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
        trade: 'ETH',
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
    name: 'ETH_BTC >> ETH_BTC',
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
        symbol: 'ETH_BTC',
        quote: 'ETH',
        base: 'BTC',
        total: 0,
        trade: 'BTC',
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
        trade: 'ETH',
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
    name: 'BTC_USDT >> ASLT_USDT >> ASLT_BTC',
    entry: 0.001,
    decimal: 8,
    walks: [
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
        trade: 'BTC',
        receive: {
          asset: 'BTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: null
      },
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'buy',
        symbol: 'ASLT_USDT',
        quote: 'ASLT',
        base: 'USDT',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
      },
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9975,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ASLT_BTC',
        quote: 'ASLT',
        base: 'BTC',
        total: 0,
        trade: 'ASLT',
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
    name: 'BTC_USDT >> ETH_USDT >> ETH_BTC',
    entry: 0.001,
    decimal: 8,
    walks: [
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'BTC_USDT',
        quote: 'BTC',
        base: 'USDT',
        total: 0,
        trade: 'BTC',
        receive: {
          asset: 'BTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'USDT',
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
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
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
        trade: 'ETH',
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
    name: 'BTC_USDT >> LTC_USDT >> LTC_BTC',
    entry: 0.001,
    decimal: 8,
    walks: [
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
        action: 'buy',
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
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
    name: 'BTC_USDT >> LTC_USDT >> LTC_BTC',
    entry: 0.001,
    decimal: 8,
    walks: [
      {
        exchangeto: 2,
        exchange: Exc,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'BTC_USDT',
        quote: 'BTC',
        base: 'USDT',
        total: 0,
        trade: 'BTC',
        receive: {
          asset: 'BTC',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        },
        transfer: {
          asset: 'USDT',
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
        symbol: 'LTC_USDT',
        quote: 'LTC',
        base: 'USDT',
        total: 0,
        trade: 'USDT',
        receive: null,
        transfer: null
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
    name: 'ETH_BTC >> HTML_ETH >> HTML_USDT >> BTC_USDT',
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
        symbol: 'ETH_BTC',
        quote: 'ETH',
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
        action: 'buy',
        symbol: 'HTML_ETH',
        quote: 'HTML',
        base: 'ETH',
        total: 0,
        trade: 'ETH',
        receive: null,
        transfer: null
      },
      {
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'HTML_USDT',
        quote: 'HTML',
        base: 'USDT',
        total: 0,
        trade: 'HTML',
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
    name: 'BTC_USDT >> ETH_USDT >> HTML_ETH >> HTML_USDT >> BTC_USDT',
    entry: 0.001,
    decimal: 8,
    walks: [
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
        action: 'buy',
        symbol: 'ETH_USDT',
        quote: 'ETH',
        base: 'USDT',
        total: 0,
        trade: 'USDT',
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
        symbol: 'HTML_ETH',
        quote: 'HTML',
        base: 'ETH',
        total: 0,
        trade: 'ETH',
        receive: null,
        transfer: null
      },
      {
        exchangeto: 1,
        exchange: Bleutrade,
        fee: 0.9985,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'HTML_USDT',
        quote: 'HTML',
        base: 'USDT',
        total: 0,
        trade: 'HTML',
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
  },
  {
    name: 'NBC_BTC >> NBC_USDT >> BTC_USDT',
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
        symbol: 'NBC_BTC',
        quote: 'NBC',
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
        symbol: 'NBC_USDT',
        quote: 'NBC',
        base: 'USDT',
        total: 0,
        trade: 'NBC',
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
    name: 'BCH_BTC >> BCH_USDT >> BTC_USDT',
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
        symbol: 'BCH_BTC',
        quote: 'BCH',
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
        symbol: 'BCH_USDT',
        quote: 'BCH',
        base: 'USDT',
        total: 0,
        trade: 'BCH',
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
    name: 'BTC_BRL >> USDT_BRL >> BTC_USDT',
    entry: 0.001,
    decimal: 8,
    walks: [
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
      },
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
    name: 'BTC_BRL >> USDC_BRL >> BTC_USDT',
    entry: 0.001,
    decimal: 8,
    last: true,
    walks: [
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
      },
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
    ]
  },
];

module.exports = Arbitration;
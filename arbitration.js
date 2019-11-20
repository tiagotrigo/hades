"use strict";

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

const Arbitration = [
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
        transfer: null
      },
    ]
  },
  // {
  //   name: 'ETH_USDT',
  //   entry: 0.2,
  //   walks: [
  //     {
  //       exchangeto: 2,
  //       exchange: Exc,
  //       fee: 0.9975,
  //       price: 0,
  //       quantity: 0,
  //       action: 'buy',
  //       symbol: 'ETH_USDT',
  //       quote: 'ETH',
  //       base: 'USDT',
  //       receive: {
  //         asset: 'USDT',
  //         exchangeto: 2,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       },
  //       transfer: {
  //         asset: 'ETH',
  //         exchangeto: 1,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       }
  //     },
  //     {
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.0015,
  //       price: 0,
  //       quantity: 0,
  //       action: 'sell',
  //       symbol: 'ETH_USDT',
  //       quote: 'ETH',
  //       base: 'USDT',
  //       receive: null,
  //       transfer: null
  //     },
  //   ]
  // },
];

module.exports = Arbitration;
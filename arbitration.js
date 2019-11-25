"use strict";

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

const Arbitration = [
  {
    name: 'ETH_BTC',
    entry: 0.0004,
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
        receive: null,
        transfer: {
          asset: 'ETH',
          exchangeto: 2,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
      {
        exchangeto: 1,
        exchange: Exc,
        fee: 0.0025,
        price: 0,
        quantity: 0,
        action: 'sell',
        symbol: 'ETH_BTC',
        quote: 'ETH',
        base: 'BTC',
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
    name: 'ETH_BTC',
    entry: 0.0004,
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
        transfer: null
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
        receive: null,
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
          exchangeto: 1,
          mail: 'tiago.a.trigo@gmail.com'
        }
      },
    ]
  },
  // {
  //   name: 'BRL_BTC_USDT_BTC',
  //   entry: 0.0002,
  //   walks: [
  //     {
  //       exchangeto: 3,
  //       exchange: Bitrecife,
  //       fee: 0.0024,
  //       price: 0,
  //       quantity: 0,
  //       action: 'sell',
  //       symbol: 'BTC_BRL',
  //       quote: 'BTC',
  //       base: 'BRL',
  //       receive: {
  //         asset: 'BTC',
  //         exchangeto: 3,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       },
  //       transfer: null
  //     },
  //     {
  //       exchangeto: 3,
  //       exchange: Bitrecife,
  //       fee: 0.9976,
  //       price: 0,
  //       quantity: 0,
  //       action: 'buy',
  //       symbol: 'USDT_BRL',
  //       quote: 'NBC',
  //       base: 'BRL',
  //       receive: null,
  //       transfer: {
  //         asset: 'USDT',
  //         exchangeto: 1,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       }
  //     },
  //     {
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.9985,
  //       price: 0,
  //       quantity: 0,
  //       action: 'buy',
  //       symbol: 'BTC_USDT',
  //       quote: 'BTC',
  //       base: 'USDT',
  //       receive: null,
  //       transfer: null
  //     },
  //   ]
  // }
];

module.exports = Arbitration;
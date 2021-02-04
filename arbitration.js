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
    entry: 40,
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
    entry: 40,
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
    entry: 40,
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
];

module.exports = Arbitration;
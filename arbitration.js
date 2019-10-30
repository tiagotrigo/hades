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
    name: 'ETH_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchange: Exc,
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
    id: 4,
    name: 'LTC_BTC',
    entry: 0.0002,
    walks: [
      {
        id: 1,
        exchange: Exc,
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
        fee: 0.0015,
        price: 0,
        quantity: 0,
        action: 'sell',
        market: 'LTC_BTC',
        dividend: 'LTC',
        divisor: 'BTC'
      }
    ]
  }
];

module.exports = Arbitration;
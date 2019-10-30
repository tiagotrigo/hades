"use strict";

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

let Arbitration = [
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
  }
];

module.exports = Arbitration;
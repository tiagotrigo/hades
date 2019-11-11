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
    id: 2,
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
    id: 5,
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
    id: 6,
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
  // {
  //   id: 11,
  //   name: 'BTC_ETH_NBC_BTC',
  //   entry: 0.0002,
  //   walks: [
  //     {
  //       id: 1,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.9985,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'buy',
  //       market: 'ETH_BTC',
  //       dividend: 'ETH',
  //       divisor: 'BTC',
  //       receive: null,
  //       transfer: null
  //     },
  //     {
  //       id: 2,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.9985,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'buy',
  //       market: 'NBC_ETH',
  //       dividend: 'NBC',
  //       divisor: 'ETH',
  //       receive: null,
  //       transfer: null
  //     },
  //     {
  //       id: 3,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.0015,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'sell',
  //       market: 'NBC_BTC',
  //       dividend: 'NBC',
  //       divisor: 'BTC',
  //       receive: null,
  //       transfer: null
  //     },
  //   ]
  // },
  // {
  //   id: 12,
  //   name: 'BTC_ETH_NBC_BTC',
  //   entry: 0.0002,
  //   walks: [
  //     {
  //       id: 1,
  //       exchangeto: 2,
  //       exchange: Exc,
  //       fee: 0.9975,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'buy',
  //       market: 'ETH_BTC',
  //       dividend: 'ETH',
  //       divisor: 'BTC',
  //       receive: {
  //         asset: 'BTC',
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
  //       id: 2,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.9985,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'buy',
  //       market: 'NBC_ETH',
  //       dividend: 'NBC',
  //       divisor: 'ETH',
  //       receive: null,
  //       transfer: null
  //     },
  //     {
  //       id: 3,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.0015,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'sell',
  //       market: 'NBC_BTC',
  //       dividend: 'NBC',
  //       divisor: 'BTC',
  //       receive: null,
  //       transfer: null
  //     },
  //   ]
  // },
  // {
  //   id: 13,
  //   name: 'BTC_NBC_ETH_BTC',
  //   entry: 0.0002,
  //   walks: [
  //     {
  //       id: 1,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.9985,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'buy',
  //       market: 'NBC_BTC',
  //       dividend: 'NBC',
  //       divisor: 'BTC',
  //       receive: null,
  //       transfer: null
  //     },
  //     {
  //       id: 2,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.0015,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'sell',
  //       market: 'NBC_ETH',
  //       dividend: 'NBC',
  //       divisor: 'ETH',
  //       receive: null,
  //       transfer: null
  //     },
  //     {
  //       id: 3,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.0015,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'sell',
  //       market: 'ETH_BTC',
  //       dividend: 'ETH',
  //       divisor: 'BTC',
  //       receive: null,
  //       transfer: null
  //     },
  //   ]
  // },
  // {
  //   id: 14,
  //   name: 'BTC_NBC_ETH_BTC',
  //   entry: 0.0002,
  //   walks: [
  //     {
  //       id: 1,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.9985,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'buy',
  //       market: 'NBC_BTC',
  //       dividend: 'NBC',
  //       divisor: 'BTC',
  //       receive: null,
  //       transfer: null
  //     },
  //     {
  //       id: 2,
  //       exchangeto: 1,
  //       exchange: Bleutrade,
  //       fee: 0.0015,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'sell',
  //       market: 'NBC_ETH',
  //       dividend: 'NBC',
  //       divisor: 'ETH',
  //       receive: null,
  //       transfer: {
  //         asset: 'ETH',
  //         exchangeto: 2,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       }
  //     },
  //     {
  //       id: 3,
  //       exchangeto: 2,
  //       exchange: Exc,
  //       fee: 0.0025,
  //       price: 0,
  //       quantity: 0,
  //       sum: null,
  //       action: 'sell',
  //       market: 'ETH_BTC',
  //       dividend: 'ETH',
  //       divisor: 'BTC',
  //       receive: null,
  //       transfer: {
  //         asset: 'BTC',
  //         exchangeto: 1,
  //         mail: 'tiago.a.trigo@gmail.com'
  //       }
  //     },
  //   ]
  // }
];

module.exports = Arbitration;
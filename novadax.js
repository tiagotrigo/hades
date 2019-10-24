'use stricts';

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const nonce = require('nonce')();
const endpoints = require('./endpoints.js');

const Novadax = {
  getTickers: function() {
    const options = {
      uri: endpoints.api.novadax,
      public: '/market/tickers'
    };

    return new Promise((resolve, reject) => {
      const data = axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {}
      })

      resolve(data)
    })
  },
  getTicker: function(market) {
    const options = {
      uri: endpoints.api.novadax,
      public: '/market/ticker'
    };

    return new Promise((resolve, reject) => {
      const data = axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          symbol: market
        }
      })

      resolve(data)
    })
  },
  getOrderBook: function(market) {
    const options = {
      uri: endpoints.api.novadaxPro,
      public: '/websocket/crypto2crypto/depth'
    };

    return new Promise((resolve, reject) => {
      const data = axios({
        method: 'POST',
        url: options.uri + options.public,
        params: {
          symbol: market,
          precision: 8
        },
        forms: {
          symbol: market
        }
      })

      resolve(data)
    })
  },
  getBalance: function() {
    const options = {
      uri: endpoints.api.novadax,
      private: '/account/getBalance',
      params: {
        apikey: process.env.NOVADAX_APIKEY,
        apisecret: process.env.NOVADAX_APISECRET,
        timestamp: new Date().getTime()
      }
    };

    const hmacURL = `GET\n/v1/account/getBalance\n\n${options.params.timestamp}`;
    const apisign = crypto.createHmac('sha256', options.params.apisecret).update(hmacURL).digest('hex');

    return new Promise((resolve, reject) => {
      const data = axios({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Nova-Access-Key': options.params.apikey,
          'X-Nova-Signature': apisign,
          'X-Nova-Timestamp': options.params.timestamp
        },
        url: options.uri + options.private
      })

      resolve(data)
    })
  },
  order: function(symbol, type, side, amount, price) {
    const options = {
      uri: endpoints.api.novadax,
      private: '/orders/create',
      params: {
        apikey: process.env.NOVADAX_APIKEY,
        apisecret: process.env.NOVADAX_APISECRET,
        timestamp: new Date().getTime()
      }
    };

    const body = {
      symbol,
      type,
      side,
      amount,
      price
    }

    const md5 = crypto.createHash('md5').update(JSON.stringify(body)).digest('hex');
    const hmacURL = `POST\n/v1/orders/create\n${md5}\n${options.params.timestamp}`;
    const apisign = crypto.createHmac('sha256', options.params.apisecret).update(hmacURL).digest('hex');

    return new Promise((resolve, reject) => {
      const data = axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Nova-Access-Key': options.params.apikey,
          'X-Nova-Signature': apisign,
          'X-Nova-Timestamp': options.params.timestamp
        },
        url: options.uri + options.private,
        data: JSON.stringify(body)
      })

      resolve(data)
    })
  }
};

module.exports = Novadax;
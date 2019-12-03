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
  getOrderBook: function(market, size) {
    const options = {
      uri: endpoints.api.novadax,
      public: '/market/depth'
    };

    return new Promise((resolve, reject) => {
      const data = axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          symbol: market,
          limit: size
        }
      }).then((data) => {
        resolve(data.data.data)  
      }).catch((er) => {
        reject(er)
      })      
    })
  },
  getBalance: function() {
    const options = {
      uri: endpoints.api.novadax,
      public: '/account/getBalance',
      params: {
        apikey: process.env.NOVADAX_APIKEY,
        apisecret: process.env.NOVADAX_APISECRET
      }
    };

    const hmacURL = `GET\n/v1/account/getBalance\n${new Date().getTime()}`;
    const apisign = crypto.createHmac('sha256', options.params.apisecret);

    return new Promise((resolve, reject) => {
      const data = axios({
        method: 'GET',
        headers: {
          'X-Nova-Access-Key': options.params.apikey,
          'X-Nova-Signature': apisign,
          'X-Nova-Timestamp': new Date().getTime()
        },
        url: options.uri + options.public
      })

      resolve(data)
    })
  },
  create: function(symbol, type, side, amount, price) {
    const options = {
      uri: endpoints.api.novadax,
      private: '/orders/create',
      params: {
        apikey: process.env.NOVADAX_APIKEY,
        apisecret: process.env.NOVADAX_APISECRET,
        symbol,
        type,
        side,
        amount,
        price
      }
    };

    const hmacURL = `symbol=${options.params.symbol}&type=${options.params.type}&side=${options.params.side}&amount=${options.params.amount}&price=${options.params.price}`;
    const apisign = crypto.createHmac('sha256', options.params.apisecret).update(hmacURL).digest('hex');

    return new Promise((resolve, reject) => {
      const data = axios({
        method: 'POST',
        headers: {
          'X-Nova-Access-Key': options.params.apikey,
          'X-Nova-Signature': apisign,
          'X-Nova-Timestamp': new Date().getTime()
        },
        url: options.uri + options.private,
        data: {
          symbol: options.params.symbol,
          type: options.params.type,
          side: options.params.side,
          amount: options.params.amount,
          price: options.params.price
        }
      })

      resolve(data)
    })
  }
};

module.exports = Novadax;
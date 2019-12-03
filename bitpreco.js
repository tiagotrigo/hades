'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Endpoints = require('./endpoints.js');

const BitPreco = {
  ticker: function(market) {
    const options = {
      uri: Endpoints.api.bitpreco,
      public: `/${market}/ticker`
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: options.uri + options.public,
        params: {}
      }).then((data) => {
        resolve(data.data)  
      }).catch((er) => {
        reject(er)
      });      
    })
  },
  getOrderBook: function(market) {
    const options = {
      uri: Endpoints.api.bitpreco,
      public: `/${market}/orderbook`
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: options.uri + options.public,
        params: {}
      }).then((data) => {
        resolve(data.data)  
      }).catch((er) => {
        reject(er)
      });      
    })
  },
  getTrades: function(market) {
    const options = {
      uri: Endpoints.api.bitpreco,
      public: `/${market}/trades`
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: options.uri + options.public,
        params: {}
      }).then((data) => {
        resolve(data.data)  
      }).catch((er) => {
        reject(er)
      });      
    })
  },
  getExchanges: function(market) {
    const options = {
      uri: Endpoints.api.bitpreco,
      public: `/${market}/exchanges`
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: options.uri + options.public,
        params: {}
      }).then((data) => {
        resolve(data.data)  
      }).catch((er) => {
        reject(er)
      });      
    })
  }
};

module.exports = BitPreco;
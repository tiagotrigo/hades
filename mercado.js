'use strict';

require('dotenv').config()
const axios = require('axios');
const nonce = require('nonce')();
const crypto = require('crypto');
const endpoints = require('./endpoints.js');

const MercadoBitcoin = {
    getTicker: function(asset) {
        let options = {
            uri: endpoints.api.mercado,
            public: `/${asset}/ticker/`,
            params: {}
        }

        return new Promise((resolve, reject) => {
            const data = axios({
                method: 'GET',
                url: options.uri + options.public
            })
            resolve(data)
        })
    },
    getOrderBook: function(asset) {
      let options = {
            uri: endpoints.api.mercado,
            public: `/${asset}/orderbook/`,
            params: {}
        }

        return new Promise((resolve, reject) => {
            const data = axios({
                method: 'GET',
                url: options.uri + options.public
            })
            resolve(data)
        })  
    }
};

module.exports = MercadoBitcoin;
'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Crypto = require('crypto');
const Endpoints = require('./endpoints.js');

const Bleutrade = {
	 getTicker: function(market) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getticker'
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market
        }
      })

      resolve(data)
    })
  },
  getMarketSummary: function(market) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getmarketsummary'
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market
        }
      })

      resolve(data)
    })
  },
  getOrderBook: function(market, type, depth) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getorderbook'
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market,
          type,
          depth
        }
      })

      resolve(data)
    })
  },
  getBalance: function(asset) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/getbalance',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}`;
    const apisign = Crypto.createHmac('sha512', options.params.apisecret).update(hmacURL).digest('hex');

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'POST',
        headers: {
          apisign
        },
        url: options.uri + options.private,
        params: {
          apikey: options.params.apikey,
          nonce: options.params.nonce,
          asset: options.params.asset
        }
      })

      resolve(data)
    })
  },
  setBuyLimit: function(market, rate, quantity, postonly) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/buylimit',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        rate,
        quantity,
        postonly
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&rate=${options.params.rate}&quantity=${options.params.quantity}&postonly=${options.params.postonly}`;
    const apisign = Crypto.createHmac('sha512', options.params.apisecret).update(hmacURL).digest('hex');    

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'POST',
        headers: {
          apisign
        },
        url: options.uri + options.private,
        params: {
          apikey: options.params.apikey,
          nonce: options.params.nonce,
          market: options.params.market,
          rate: options.params.rate,
          quantity: options.params.quantity,
          postonly: options.params.postonly
        }
      })

      resolve(data)
    })
  },
  setSellLimit: function(market, rate, quantity, postonly) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/selllimit',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        rate,
        quantity,
        postonly
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&rate=${options.params.rate}&quantity=${options.params.quantity}&postonly=${options.params.postonly}`;
    const apisign = Crypto.createHmac('sha512', options.params.apisecret).update(hmacURL).digest('hex');

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'POST',
        headers: {
          apisign
        },
        url: options.uri + options.private,
        params: {
          apikey: options.params.apikey,
          nonce: options.params.nonce,
          market: options.params.market,
          rate: options.params.rate,
          quantity: options.params.quantity,
          postonly: options.params.postonly
        }
      })

      resolve(data)
    })
  },
  setOrderCancel: function(orderId) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/ordercancel',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        orderId
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&orderid=${options.params.orderId}`;
    const apisign = Crypto.createHmac('sha512', options.params.apisecret).update(hmacURL).digest('hex');

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'POST',
        headers: {
          apisign
        },
        url: options.uri + options.private,
        params: {
          apikey: options.params.apikey,
          nonce: options.params.nonce,
          orderid: options.params.orderId
        }
      })

      resolve(data)
    })
  },
  getOpenOrders: function(market) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/getopenorders',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}`;
    const apisign = Crypto.createHmac('sha512', options.params.apisecret).update(hmacURL).digest('hex');

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'POST',
        headers: {
          apisign
        },
        url: options.uri + options.private,
        params: {
          apikey: options.params.apikey,
          nonce: options.params.nonce,
          market: options.params.market
        }
      })

      resolve(data)
    })
  },
  setDirectTransfer: function(asset, quantity, exchangeto, accountto) {
    // 1 - Bleutrade, 2 - ExCripto, 3 - bleutrade
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/directtransfer',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset,
        quantity,
        exchangeto,
        accountto
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}&quantity=${options.params.quantity}&exchangeto=${options.params.exchangeto}&accountto=${options.params.accountto}`;
    const apisign = Crypto.createHmac('sha512', options.params.apisecret).update(hmacURL).digest('hex');

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'POST',
        headers: {
          apisign
        },
        url: options.uri + options.private,
        params: {
          apikey: options.params.apikey,
          nonce: options.params.nonce,
          asset: options.params.asset,
          quantity: options.params.quantity,
          exchangeto: options.params.exchangeto,
          accountto: options.params.accountto
        }
      })

      resolve(data)
    })
  }
};

module.exports = Bleutrade;
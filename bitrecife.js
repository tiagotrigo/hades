'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Crypto = require('crypto');
const Endpoints = require('./endpoints.js');

const Bitrecife = {
  getAssets: function(callback) {
    const options = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getassets'
    };

    Axios({
      method: 'GET',
      url: options.uri + options.public
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getMarkets: function() {
    const options = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarkets'
    };

    Axios({
      method: 'GET',
      url: options.uri + options.public
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getTicker: function(market) {
    const options = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getticker'
    };

    Axios({
      method: 'GET',
      url: options.uri + options.public,
      params: {
        market
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getMarketSummary: function(market) {
    const options = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarketsummary'
    };

    Axios({
      method: 'GET',
      url: options.uri + options.public,
      params: {
        market
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getMarketSummaries: function(basemarket) {
    const options = {
      uri: Endpoints.api.bitrecife,
      public: '/public​/getmarketsummaries'
    };

    Axios({
      method: 'GET',
      url: options.uri + options.public,
      params: {
        basemarket
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getOrderBook: function(market, type, depth) {
    const options = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getorderbook'
    };

    Axios({
      method: 'GET',
      url: options.uri + options.public,
      params: {
        market,
        type,
        depth
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getMarketHistory: function(market, count) {
    const options = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarkethistory'
    };

    Axios({
      method: 'GET',
      url: options.uri + options.public,
      params: {
        market,
        count
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getCandles: function(market, period) {
    const options = {
      uri: Endpoints.api.bitrecife,
      public: '/public​/getcandles'
    };

    Axios({
      method: 'GET',
      url: options.uri + options.public,
      params: {
        market,
        period
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getBalance: function(asset, callback) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getbalance',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getBalances: function() {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getbalances',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: options.uri + options.private,
      params: {
        apikey: options.params.apikey,
        nonce: options.params.nonce
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setBuyLimit: function(market, rate, quantity, postonly) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/buylimit',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        rate,
        quantity,
        postonly
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&rate=${options.params.rate}&quantity=${options.params.quantity}&postonly=${options.params.postonly}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setSellLimit: function(market, rate, quantity, postonly) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/selllimit',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        rate,
        quantity,
        postonly
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&rate=${options.params.rate}&quantity=${options.params.quantity}&postonly=${options.params.postonly}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setAMIBuy: function(market, rate, amirate, quantity) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private​/buylimitami',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        rate,
        amirate,
        quantity
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&quantity=${options.params.quantity}&rate=${options.params.rate}&amirate=${options.params.amirate}&market=${options.params.market}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: encodeURIComponent(options.uri + options.private),
      params: {
        apikey: options.params.apikey,
        nonce: options.params.nonce,
        quantity: options.params.quantity,
        rate: options.params.rate,
        amirate: options.params.amirate,
        market: options.params.market
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setAMISell: function(market, rate, amirate, quantity) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private​/selllimitami',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        rate,
        amirate,
        quantity
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&rate=${options.params.rate}&amirate=${options.params.amirate}&quantity=${options.params.quantity}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: encodeURIComponent(options.uri + options.private),
      params: {
        apikey: options.params.apikey,
        nonce: options.params.nonce,
        quantity: options.params.quantity,
        rate: options.params.rate,
        amirate: options.params.amirate,
        market: options.params.market
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setStopBuyLimit: function(market, stop, limit, quantity) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/buystoplimit',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        stop,
        limit,
        quantity
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&stop=${options.params.stop}&limit=${options.params.limit}&quantity=${options.params.quantity}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: options.uri + options.private,
      params: {
        apikey: options.params.apikey,
        nonce: options.params.nonce,
        market: options.params.market,
        stop: options.params.rate,
        limit: options.params.limit,
        quantity: options.params.quantity
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setStopSellLimit: function(market, stop, limit, quantity) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/sellstoplimit',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        stop,
        limit,
        quantity
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&stop=${options.params.stop}&limit=${options.params.limit}&quantity=${options.params.quantity}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: options.uri + options.private,
      params: {
        apikey: options.params.apikey,
        nonce: options.params.nonce,
        market: options.params.market,
        stop: options.params.rate,
        limit: options.params.limit,
        quantity: options.params.quantity
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setOrderCancel: function(orderId) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/ordercancel',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        orderId
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&orderid=${options.params.orderId}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getOpenOrders: function(market) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getopenorders',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getDepositAddress: function(asset) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getdepositaddress',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getDepositHistory: function() {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getdeposithistory',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000)       
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: options.uri + options.private,
      params: {
        apikey: options.params.apikey,
        nonce: options.params.nonce
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getMyTransactions: function(asset) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getmytransactions',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setWithdraw: function(asset, quantity, address) {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/withdraw',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset,
        quantity,
        address
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}&quantity=${options.params.quantity}&address=${options.params.address}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
        address: options.params.address
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  setDirectTransfer: function(asset, quantity, exchangeto, accountto) {
    // 1 - Bleutrade, 2 - ExCripto, 3 - Bitrecife
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/directtransfer',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset,
        quantity,
        exchangeto,
        accountto
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}&quantity=${options.params.quantity}&exchangeto=${options.params.exchangeto}&accountto=${options.params.accountto}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
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
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getWithdrawHistory: function() {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getwithdrawhistory',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: options.uri + options.private,
      params: {
        apikey: options.params.apikey,
        nonce: options.params.nonce
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  },
  getLimits: function() {
    const options = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getlimits',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: options.uri + options.private,
      params: {
        apikey: options.params.apikey,
        nonce: options.params.nonce
      }
    }).then(function(resp) {
      callback(resp.data.success, resp.data.result)
    })
  }
};

module.exports = Bitrecife;
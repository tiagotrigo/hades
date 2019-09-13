'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Crypto = require('crypto');
const Endpoints = require('./endpoints.js');

const Bitrecife = {
  getAssets: function(callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getassets'
    };

    Axios({
      method: 'GET',
      url: r.uri + r.public
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    });
  },
  getMarkets: function(callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarkets'
    };

    Axios({
      method: 'GET',
      url: r.uri + r.public
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    });
  },
  getTicker: function(market, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getticker'
    };

    Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    });
  },
  getMarketSummary: function(market, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarketsummary'
    };

    Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    });
  },
  getMarketSummaries: function(basemarket, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public​/getmarketsummaries'
    };

    Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        basemarket
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    });
  },
  getOrderBook: function(market, type, depth, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getorderbook'
    };

    Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market,
        type,
        depth
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    });
  },
  getMarketHistory: function(market, count, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarkethistory'
    };

    Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market,
        count
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    });
  },
  getCandles: function(market, period, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public​/getcandles'
    };

    Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market,
        period
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    });
  },
  getBalance: function(asset, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getbalance',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&asset=${r.params.asset}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        asset
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  getBalances: function(callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getbalances',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setBuyLimit: function(market, rate, quantity, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/buylimit',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        rate,
        quantity,
        postonly: true
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&market=${r.params.market}&rate=${r.params.rate}&quantity=${r.params.quantity}&postonly=${r.params.postonly}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        market: r.params.market,
        rate: r.params.rate,
        quantity: r.params.quantity,
        postonly: r.params.postonly
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setSellLimit: function(market, rate, quantity, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/selllimit',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market,
        rate,
        quantity,
        postonly: true
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&market=${r.params.market}&rate=${r.params.rate}&quantity=${r.params.quantity}&postonly=${r.params.postonly}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        market: r.params.market,
        rate: r.params.rate,
        quantity: r.params.quantity,
        postonly: r.params.postonly
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setAMIBuy: function(market, rate, amirate, quantity, callback) {
    const r = {
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

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&market=${r.params.market}&rate=${r.params.rate}&amirate=${r.params.amirate}&quantity=${r.params.quantity}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        market: r.params.market,
        rate: r.params.rate,
        amirate: r.params.amirate,
        quantity: r.params.quantity
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setAMISell: function(market, rate, amirate, quantity, callback) {
    const r = {
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

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&market=${r.params.market}&rate=${r.params.rate}&amirate=${r.params.amirate}&quantity=${r.params.quantity}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        market: r.params.market,
        rate: r.params.rate,
        amirate: r.params.amirate,
        quantity: r.params.quantity
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setStopBuyLimit: function(market, stop, limit, quantity, callback) {
    const r = {
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

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&market=${r.params.market}&stop=${r.params.stop}&limit=${r.params.limit}&quantity=${r.params.quantity}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        market: r.params.market,
        stop: r.params.rate,
        limit: r.params.limit,
        quantity: r.params.quantity
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setStopSellLimit: function(market, stop, limit, quantity, callback) {
    const r = {
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

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&market=${r.params.market}&stop=${r.params.stop}&limit=${r.params.limit}&quantity=${r.params.quantity}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        market: r.params.market,
        stop: r.params.rate,
        limit: r.params.limit,
        quantity: r.params.quantity
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setOrderCancel: function(orderId, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/ordercancel',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        orderId
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&orderid=${r.params.orderId}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        orderid: r.params.orderId
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  getOpenOrders: function(market, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getopenorders',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        market
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&market=${r.params.market}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        market: r.params.market
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  getDepositAddress: function(asset, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getdepositaddress',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&asset=${r.params.asset}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        asset: r.params.asset
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  getDepositHistory: function(callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getdeposithistory',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  getMyTransactions: function(asset, callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getmytransactions',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&asset=${r.params.asset}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        asset: r.params.asset
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setWithdraw: function(asset, quantity, address, callback) {
    const r = {
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

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&asset=${r.params.asset}&quantity=${r.params.quantity}&address=${r.params.address}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        asset: r.params.asset,
        quantity: r.params.quantity,
        address: r.params.address
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  setDirectTransfer: function(asset, quantity, exchangeto, accountto, callback) {
    // 1 - Bleutrade
    // 2 - ExCripto
    // 3 - Bitrecife
    const r = {
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

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}&asset=${r.params.asset}&quantity=${r.params.quantity}&exchangeto=${r.params.exchangeto}&accountto=${r.params.accountto}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce,
        asset: r.params.asset,
        quantity: r.params.quantity,
        exchangeto: r.params.exchangeto,
        accountto: r.params.accountto
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  getWithdrawHistory: function(callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getwithdrawhistory',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  },
  getLimits: function(callback) {
    const r = {
      uri: Endpoints.api.bitrecife,
      private: '/private/getlimits',
      params: {
        apikey: process.env.BITRECIFE_APIKEY,
        apisecret: process.env.BITRECIFE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${r.uri}${r.private}?apikey=${r.params.apikey}&nonce=${r.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', r.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce
      }
    }).then((data) => {
      callback(data);
    }).catch((er) => {
      callback(er);
    })
  }
};

module.exports = Bitrecife;
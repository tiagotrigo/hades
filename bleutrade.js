'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Crypto = require('crypto');
const Endpoints = require('./endpoints.js');

const Bleutrade = {
	getAssets: function() {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getassets'
    };

    const data = Axios({
      method: 'GET',
      url: r.uri + r.public
    })

    return data
  },
  getMarkets: function() {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarkets'
    };

    const data = Axios({
      method: 'GET',
      url: r.uri + r.public
    })

    return data
  },
  getTicker: function(market) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getticker'
    };

    const data = Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market
      }
    })

    return data;
  },
  getMarketSummary: function(market) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarketsummary'
    };

    const data = Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market
      }
    })

    return data;
  },
  getMarketSummaries: function(basemarket) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public​/getmarketsummaries'
    };

    const data = Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        basemarket
      }
    });

    return data;
  },
  getOrderBook: function(market, type, depth) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getorderbook'
    };

    const data = Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market,
        type,
        depth
      }
    })

    return data;
  },
  getMarketHistory: function(market, count) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public/getmarkethistory'
    };

    const data = Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market,
        count
      }
    });

    return data;
  },
  getCandles: function(market, period) {
    const r = {
      uri: Endpoints.api.bitrecife,
      public: '/public​/getcandles'
    };

    const data = Axios({
      method: 'GET',
      url: r.uri + r.public,
      params: {
        market,
        period
      }
    });

    return data;
  },
  getBalance: function(asset) {
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

    const data = Axios({
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
    })

    return data;
  },
  getBalances: function() {
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

    const data = Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce
      }
    });

    return data;
  },
  setBuyLimit: function(market, rate, quantity) {
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

    const data = Axios({
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
    });

    return data;
  },
  setSellLimit: function(market, rate, quantity) {
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

    const data = Axios({
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
    });

    return data;
  },
  setAMIBuy: function(market, rate, amirate, quantity) {
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

    const data = Axios({
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
    });

    return data;
  },
  setAMISell: function(market, rate, amirate, quantity) {
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

    const data = Axios({
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
    });

    return data;
  },
  setStopBuyLimit: function(market, stop, limit, quantity) {
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

    const data = Axios({
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
    });

    return data;
  },
  setStopSellLimit: function(market, stop, limit, quantity) {
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

    const data = Axios({
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
    });

    return data;
  },
  setOrderCancel: function(orderId) {
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

    const data = Axios({
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
    });

    return data;
  },
  getOpenOrders: function(market) {
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

    const data = Axios({
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
    });

    return data;
  },
  getDepositAddress: function(asset) {
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

    const data = Axios({
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
    });

    return data;
  },
  getDepositHistory: function() {
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

    const data = Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce
      }
    });

    return data;
  },
  getMyTransactions: function(asset) {
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

    const data = Axios({
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
    });

    return data;
  },
  setWithdraw: function(asset, quantity, address) {
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

    const data = Axios({
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
    });

    return data;
  },
  setDirectTransfer: function(asset, quantity, exchangeto, accountto) {
    // 1 - Bleutrade, 2 - ExCripto, 3 - Bitrecife
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

    const data = Axios({
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
    });

    return data;
  },
  getWithdrawHistory: function() {
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

    const data = Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce
      }
    });

    return data;
  },
  getLimits: function() {
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

    const data = Axios({
      method: 'POST',
      headers: {
        apisign
      },
      url: r.uri + r.private,
      params: {
        apikey: r.params.apikey,
        nonce: r.params.nonce
      }
    });

    return data;
  }
};

module.exports = Bleutrade;
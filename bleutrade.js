'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Crypto = require('crypto');
const Endpoints = require('./endpoints.js');

const Bleutrade = {
	 getAssets: function() {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getassets'
    };

    return new Promise(function(resolve, reject) {
      Axios({
        method: 'GET',
        url: options.uri + options.public
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    });
  },
  getMarkets: function() {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getmarkets'
    };

    return new Promise(function(resolve, reject) {
      Axios({
        method: 'GET',
        url: options.uri + options.public
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    });
  },
  getTicker: function(market) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getticker'
    };

    return new Promise(function(resolve, reject) {
      Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market
        }
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    });
  },
  getMarketSummary: function(market) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getmarketsummary'
    };

    return new Promise(function(resolve, reject) {
      Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market
        }
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    });
  },
  getMarketSummaries: function(basemarket) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public​/getmarketsummaries'
    };

    return new Promise(function(resolve, reject) {
      Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          basemarket
        }
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    });
  },
  getOrderBook: function(market, type, depth) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getorderbook'
    };

    return new Promise(function(resolve, reject) {
      Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market,
          type,
          depth
        }
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    });
  },
  getMarketHistory: function(market, count) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public/getmarkethistory'
    };

    return new Promise(function(resolve, reject) {
      Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market,
          count
        }
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    });
  },
  getCandles: function(market, period) {
    const options = {
      uri: Endpoints.api.bleutrade,
      public: '/public​/getcandles'
    };

    return new Promise(function(resolve, reject) {
      Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market,
          period
        }
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    });
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
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })

  },
  getBalances: function() {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/getbalances',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
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
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
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
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  setAMIBuy: function(market, rate, amirate, quantity) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private​/buylimitami',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
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

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  setAMISell: function(market, rate, amirate, quantity) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private​/selllimitami',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
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

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  setStopBuyLimit: function(market, stop, limit, quantity) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/buystoplimit',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
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

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  setStopSellLimit: function(market, stop, limit, quantity) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/sellstoplimit',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
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

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
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
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
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
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  getDepositAddress: function(asset) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/getdepositaddress',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  getDepositHistory: function() {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/getdeposithistory',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000)       
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  getMyTransactions: function(asset) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/getmytransactions',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000),
        asset
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&asset=${options.params.asset}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  setWithdraw: function(asset, quantity, address) {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/withdraw',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
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

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  setDirectTransfer: function(asset, quantity, exchangeto, accountto) {
    // 1 - Bleutrade, 2 - ExCripto, 3 - Bitrecife
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
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  getWithdrawHistory: function() {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/getwithdrawhistory',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  },
  getLimits: function() {
    const options = {
      uri: Endpoints.api.bleutrade,
      private: '/private/getlimits',
      params: {
        apikey: process.env.BLEUTRADE_APIKEY,
        apisecret: process.env.BLEUTRADE_APISECRET,
        nonce: Math.floor(new Date() / 1000)
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}`;
    const hmac512 = Crypto.createHmac('sha512', options.params.apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return new Promise(function(resolve, reject) {
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
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject('Oops!').catch(err => {
          throw new Error(err);
        });
      })
    })
  }
};

module.exports = Bleutrade;
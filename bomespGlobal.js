'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Crypto = require('crypto');
const Nonce = require('nonce')();
const Endpoints = require('./endpoints.js');

const BomespGlobal = {
  getMarkets: function() {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      public: '/public/getmarkets'
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        url: options.uri + options.public
      }).then((data) => {
        resolve(data.data.result)  
      }).catch((er) => {
        reject(er)
      })
    })
  },
  getTicker: function(market) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      public: '/public/getticker'
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        url: options.uri + options.public,
        params: {
          market
        }
      }).then((data) => {
        resolve(data)  
      }).catch((er) => {
        reject(er)
      })
    })
  },
  getOrderBook: function(market, type, depth) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
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
      }).then((data) => {
        resolve(data.data.result)  
      }).catch((er) => {
        reject(er)
      })
    })
  },
  getBalance: function(asset) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      private: '/private/getbalance',
      params: {
        apikey: process.env.BOMESP_GLOBAL_APIKEY,
        apisecret: process.env.BOMESP_GLOBAL_APISECRET,
        nonce: Nonce(),
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
      }).then((data) => {
        resolve(data)  
      }).catch((er) => {
        reject(er)
      })
    })
  },
  setBuyLimit: function(market, rate, quantity) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      private: '/private/buylimit',
      params: {
        apikey: process.env.BOMESP_GLOBAL_APIKEY,
        apisecret: process.env.BOMESP_GLOBAL_APISECRET,
        nonce: Nonce(),
        market,
        rate,
        quantity
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&rate=${options.params.rate}&quantity=${options.params.quantity}`;
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
          quantity: options.params.quantity
        }
      }).then((data) => {        
        resolve(data)  
      }).catch((er) => {        
        reject(er)
      })
    })
  },
  setBuyMarket: function(market, quantity) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      private: '/private/buymarket',
      params: {
        apikey: process.env.BOMESP_GLOBAL_APIKEY,
        apisecret: process.env.BOMESP_GLOBAL_APISECRET,
        nonce: Nonce(),
        market,
        quantity
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&quantity=${options.params.quantity}`;
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
          quantity: options.params.quantity
        }
      }).then((data) => {        
        resolve(data)  
      }).catch((er) => {        
        reject(er)
      })     
    })
  },
  setSellMarket: function(market, quantity) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      private: '/private/sellmarket',
      params: {
        apikey: process.env.BOMESP_GLOBAL_APIKEY,
        apisecret: process.env.BOMESP_GLOBAL_APISECRET,
        nonce: Nonce(),
        market,
        quantity
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&quantity=${options.params.quantity}`;
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
          quantity: options.params.quantity
        }
      }).then((data) => {        
        resolve(data)  
      }).catch((er) => {        
        reject(er)
      })      
    })
  },
  setSellLimit: function(market, rate, quantity) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      private: '/private/selllimit',
      params: {
        apikey: process.env.BOMESP_GLOBAL_APIKEY,
        apisecret: process.env.BOMESP_GLOBAL_APISECRET,
        nonce: Nonce(),
        market,
        rate,
        quantity
      }
    };

    const hmacURL = `${options.uri}${options.private}?apikey=${options.params.apikey}&nonce=${options.params.nonce}&market=${options.params.market}&rate=${options.params.rate}&quantity=${options.params.quantity}`;
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
      }).then((data) => {        
        resolve(data)  
      }).catch((er) => {        
        reject(er)
      })
    })
  },
  setOrderCancel: function(orderId) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      private: '/private/ordercancel',
      params: {
        apikey: process.env.BOMESP_GLOBAL_APIKEY,
        apisecret: process.env.BOMESP_GLOBAL_APISECRET,
        nonce: Nonce(),
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
      }).then((data) => {
        resolve(data)  
      }).catch((er) => {
        reject(er)
      })
    })
  },
  getOpenOrders: function(market) {
    const options = {
      uri: Endpoints.api.bomespGlobal,
      private: '/private/getopenorders',
      params: {
        apikey: process.env.BOMESP_GLOBAL_APIKEY,
        apisecret: process.env.BOMESP_GLOBAL_APISECRET,
        nonce: Nonce(),
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
      }).then((data) => {
        resolve(data)  
      }).catch((er) => {
        reject(er)
      })
    })
  },
  setDirectTransfer: function(asset, quantity, exchangeto, accountto) {
    // 1 - Bleutrade, 2 - ExCripto, 3 - Bitrecife
    const options = {
      uri: Endpoints.api.bomespGlobal,
      private: '/private/directtransfer',
      params: {
        apikey: process.env.BOMESP_GLOBAL_APIKEY,
        apisecret: process.env.BOMESP_GLOBAL_APISECRET,
        nonce: Nonce(),
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
      }).then((data) => {
        console.log(data.data)
        resolve(data)  
      }).catch((er) => {
        console.log(er)
        reject(er)
      })
    })
  }
};

module.exports = BomespGlobal;
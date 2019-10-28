'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Endpoints = require('./endpoints.js');

const Awesomeapi = {
  getDolar: function(market) {
    const options = {
      uri: Endpoints.api.awesomeapi,
      public: `/all/${market}`
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'GET',
        url: options.uri + options.public
      }).then((data) => {
        resolve(data.data.USD)  
      })
    })
  }
};

module.exports = Awesomeapi;
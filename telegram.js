'use stricts';

require('dotenv').config();
const Axios = require('axios');
const Endpoints = require('./endpoints.js');

const Telegram = {
  sendMessage: function(message) {
    const options = {
      uri: Endpoints.api.telegram,
      public: '/sendMessage'
    };

    return new Promise((resolve, reject) => {
      const data = Axios({
        method: 'POST',
        url: options.uri + options.public,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          chat_id: process.env.CHAT_ID,
          text: `${message}`
        }
      })

      resolve(data)
    })
  }
};

module.exports = Telegram;
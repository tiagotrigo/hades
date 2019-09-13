'use stricts';

const Crypto = require('crypto');

const Config = {
  generateApiSign: function(uri, privateURL, apikey, apisecret, nonce, asset) {
    const hmacURL = `${uri}${privateURL}?apikey=${apikey}&nonce=${nonce}&asset=${asset}`;
    const hmac512 = Crypto.createHmac('sha512', apisecret);
    hmac512.update(hmacURL);
    const apisign = hmac512.digest('hex');

    return apisign;
  }
};

module.exports = Config;
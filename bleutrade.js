'use stricts';

const Axios = require('axios');
const Endpoints = require('./endpoints.js');

const Bleutrade = {
	getAssets: function() {

	},
	getMarkets: function() {

	},
	getTicker: function(market) {
		// Ex: ETH_BTC
	},
	getMarketSummary: function(market = 'ETH_BTC') {
		// Ex: ETH_BTC
	},
	getMarketSummaries: function(basemarket = 'BTC') {
		// Ex: BTC
	},
	getOrderBook: function(market = 'ETH_BTC', type = 'BUY', depth = 20) {

	},
	getMarketHistory: function(market = 'ETH_BTC', count = 20) {
		// 20/200
	},
	getCandles: function(market = 'ETH_BTC', period = '1d') {

	}
};

module.exports = Bleutrade;
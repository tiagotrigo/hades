'use stricts';

const Axios = require('axios');
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
	getTicker: function(market = 'BTC_BRL', callback) {
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
	getMarketSummary: function(market = 'BTC_BRL', callback) {
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
	getMarketSummaries: function(basemarket = 'BTC', callback) {
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
	getOrderBook: function(market = 'BTC_BRL', type = 'BUY', depth = 20, callback) {
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
	getMarketHistory: function(market = 'BTC_BRL', count = 20, callback) {
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
	getCandles: function(market = 'BTC_BRL', period = '1d', callback) {
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
	getBalance: function(apiKey, nonce, apisign, asset, callback) {

	},
	getBalances: function(apiKey, nonce, apisign, callback) {
		//
	}
};

module.exports = Bitrecife;
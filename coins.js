"use strict";

const Coins = [
	{
		symbol: 'ETH_USDT', 
		dividend: 'ETH',
		divisor: 'USDT',
		entry: 0.01
	},
	{
		symbol: 'LTC_USDT', 
		dividend: 'LTC',
		divisor: 'USDT',
		entry: 0.01
	},
	{
		symbol: 'BTC_USDT', 
		dividend: 'BTC',
		divisor: 'USDT',
		entry: 0.01
	},
	{
		symbol: 'ETH_BTC', 
		dividend: 'ETH',
		divisor: 'BTC',
		entry: 0.00020015
	},
	{
		symbol: 'LTC_BTC', 
		dividend: 'LTC',
		divisor: 'BTC',
		entry: 0.00020015
	}
];

module.exports = Coins;
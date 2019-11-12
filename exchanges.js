"use strict";

require('dotenv').config();

const exchanges = [
	{
		id: "binance",
		apiKey: process.env.APIKEY,
		secret: process.env.APISECRET
	}
];

module.exports = exchanges;
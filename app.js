'use stricts';

const Await = require('await');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
	
	constructor() {
	}
	
	async run() {
		// Real
		const BRL = await Bitrecife.getBalance('BRL');
		// Dólar
		const USDT = await Bleutrade.getBalance('USDT');
	}
}

new Hades().run();
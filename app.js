'use stricts';

const R = require('ramda');
const await = require('await');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
	
	constructor() {
		this.feeMakerBl = 0.0025,
		this.feeTakerBl = 0.0025,
		this.feeMakerBt = 0.0020,
		this.feeTakerBt = 0.0040,
		this.brl = 25,
		this.usd = 0.0
	}
	// se colocar uma ordem no book é maker
	// se pegar uma ordem no livro é taker

	wait(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	repeat(ms, func) {
		return new Promise((resolve) => (
			setInterval(func, ms), 
			this.wait(ms).then(resolve)
		));
	}

	async main() {
		const BL_BTC_USDT = await Bleutrade.getTicker('BTC_USDT');
		const BT_USDT_BRL = await Bitrecife.getTicker('USDT_BRL');

		// Trocando BRL por USDT
		// pega a primeira ordem do bid
		const val_USDT = this.brl / BT_USDT_BRL.data.result[0].Bid;
		const val_USDT_FEE = val_USDT - (val_USDT * this.feeMakerBt);
		// Trocando USDT por BTC
		// pegar a primera ordem do ask

		const val_BTC = val_USDT / BL_BTC_USDT.data.result[0].Ask;
		const val_BTC_FEE = val_BTC - (val_BTC * this.feeMakerBl);
		//
		console.log('Quantidade em USDT:', val_USDT_FEE);
		console.log('Quantidade em BTC:', val_BTC);
	}

	async run() {
		this.repeat(
			5000, 
			() => Promise.all([
				this.main()
			])
		);
	}
}

new Hades().run();
'use stricts';

const await = require('await');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
	
	constructor() {
	}

	async converteBTCtoBRL() {	
		// Valor de USDT em real
		const USDT_BRL = await Bitrecife.getTicker('USDT_BRL');
		// Valor do bitcoin em dólar
		const BTC_USDT = await Bleutrade.getTicker('BTC_USDT');
		// Convertendo o valor do bitcoin em USDT para BRL
		const ticker = BTC_USDT.data.result[0].Bid * USDT_BRL.data.result[0].Last;
		
		return ticker;
	}
	
	async run() {
		// Balança da ( Bitrecife / Bleutrade )
		const BRL = await Bitrecife.getBalance('BRL');
		const USDT = await Bleutrade.getBalance('USDT');
		// Valor do bitcoin em real
		const BTC_BRL = await Bitrecife.getTicker('BTC_BRL');
		const USDT_BRL = await Bitrecife.getTicker('USDT_BRL');

		// 1 - Verificar se existe BRL ( Bitrecife );
		if (BRL.data.result[0].Balance > 0) {
			// 2 - Se existir, comprar USDT ( Bitrecife );
			await Bitrecife.setAMIBuy('USDT_BRL', USDT_BRL.data.result[0].Bid, USDT_BRL.data.result[0].Ask, 5);
			console.log(' ');
			console.log('Compra realizada');
			console.log(' ');
		} else
			// 3 - Na Bleu, verifique se o par BTC/USDT está + barato do que na ( Bitrecife ); 
			if (await this.converteBTCtoBRL() < BTC_BRL.data.result[0].Bid) {
			console.log('O par BTC/USDT é mais barato na Bleutrade do que a Bitrecife');
		} else {
			console.log('Aguardando oportunidade');
		}

		console.log(' ');
		console.log('Saldo em reais:', BRL.data.result[0].Balance);
		console.log('Saldo em dólar:', USDT.data.result[0].Balance);
		console.log(' ');
	}
}

new Hades().run();
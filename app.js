'use stricts';

const Bitrecife = require('./bitrecife.js');

class Hades {
	
	constructor() {

	}


	run() {
		Bitrecife.getOrderBook('BTC_BRL', 'BUY', 20, function(response) {
			console.log(response.data.result.buy)
		})
	}
}

new Hades().run();
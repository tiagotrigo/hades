'use stricts';

const Bitrecife = require('./bitrecife.js');

class Hades {
	
	constructor() {

	}


	run() {
		Bitrecife.setSellLimit('BTC_BRL', 45000, 42, function(response) {
			console.log(response.data)
		})
	}
}

new Hades().run();
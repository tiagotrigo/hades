'use stricts';

const Bitrecife = require('./bitrecife.js');

class Hades {
	
	constructor() {

	}


	run() {
		Bitrecife.getBalance('BTC', function(response) {
			console.log(response)
		})
	}
}

new Hades().run();
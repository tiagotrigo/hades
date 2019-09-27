'use stricts';

const R = require('ramda');
const await = require('await');
const colors = require('colors/safe');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const sprintf = require("sprintf-js").sprintf;

class Hades {
  
  constructor() {
    this.entry = 25.00,
    this.dolar = 0.0,
    this.profit = 0.0,
    this.qnt_BRL = 0.0,
    this.qnt_BTC = 0.0,
    this.fee_Bl = 0.0025,
    this.fee_Bt = 0.0040
  }

  atraso(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  repetir(ms, func) {
    return new Promise((resolve) => (
      setInterval(func, ms), 
      this.atraso(ms).then(resolve)
    ));
  }

  calcular(op, x, y) {
    const n = {
      '*': x * y,
      '-': x - y,
      '+': x + y,
      '/': x / y
    }[op];        

    return Math.round(n * 100) / 100;
  }

  async iniciar() {
    await Bitrecife.getBalance('BRL', function(err, data) {
      if (!err) return;        

      
      console.log(data)
    });
  }
}

new Hades().iniciar();
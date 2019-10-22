'use stricts';

const R = require('ramda');
const Exc = require('./exc.js');
const Coins = require('./coins.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.fee_bl = 0.0025,
    this.fee_exc = 0.0025,
    this.entry = 0.00020000,
    this.min = 0.00020000,
    this.profit = null
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

  formatNumber(num, precision) {
    const output = Math.pow(10, precision); 
    return Math.floor((num * output)) / output;
  }

  setup() {
    if (this.count >= Coins.length) this.count = 0;

    const { 
      symbol,
      dividend
    } = Coins[this.count];

    // Saldo em USDT Exc
    Exc.getBalance('BTC').then((data) => {
      this.entry = data.data.result[0].Balance;
      // Saldo em USDT Bleu
      Bleutrade.getOrderBook(symbol, 'ALL', 3).then((bookBleu) => {
        let qntAskBleu;
        let qntAskFee;
        let qntAskBleu_float;
        
        // if ((bookBleu.data.result.sell[0].Quantity * bookBleu.data.result.sell[0].Rate) >= this.entry) {
        //   this.gain = this.entry;
        //   qntAskBleu = this.gain * 0.9975;
        //   qntAskFee = this.formatNumber(qntAskBleu, 8) / bookBleu.data.result.sell[0].Rate;
        //   qntAskBleu_float = this.formatNumber(qntAskFee, 8);
        // } else {
        //   this.gain = this.min;
        //   qntAskBleu = this.gain * 0.9975;
        //   qntAskFee = this.formatNumber(qntAskBleu, 8) / bookBleu.data.result.sell[0].Rate;
        //   qntAskBleu_float = this.formatNumber(qntAskFee, 8);
        // }

        this.gain = this.min;
        qntAskBleu = this.gain * 0.9975;
        qntAskFee = this.formatNumber(qntAskBleu, 8) / bookBleu.data.result.sell[0].Rate;
        qntAskBleu_float = this.formatNumber(qntAskFee, 8);

        // Vender moeda qualquer por USDT
        Exc.getOrderBook(symbol, 'ALL', 3).then((bookExc) => {
          const qntBidUSDTExc = this.formatNumber((qntAskBleu_float * bookExc.data.result.buy[0].Rate) * (1 - 0.0025), 8);
          
          if (qntBidUSDTExc > this.gain) {
            if (bookBleu.data.result.sell[0].Quantity >= qntAskBleu_float && bookExc.data.result.buy[0].Quantity >= qntAskBleu_float) {
              //Transferir Exc para Bleu
              Exc.setDirectTransfer('BTC', this.gain, 1, 'tiago.a.trigo@gmail.com').then((data) => {
                console.log('Enviando BTC para Bleutrade');
                // Comprar na Bleu
                Bleutrade.setBuyLimit(symbol, bookBleu.data.result.sell[0].Rate, qntAskBleu_float, false).then((data) => {
                  console.log(`Troca de BTC por ${dividend}`);                    
                  
                  Bleutrade.getBalance(dividend).then((data) => {
                    const bleu = data.data.result[0].Balance;
                    // Transferir Bleu para Exc
                    Bleutrade.setDirectTransfer(dividend, bleu, 2, 'tiago.a.trigo@gmail.com').then((data) => {
                      console.log(`Enviando ${dividend} para Exccripto`);
                      // Vender na Exc
                      Exc.getBalance(dividend).then((data) => {
                        const exc = data.data.result[0].Balance;

                        Exc.setSellLimit(symbol, bookExc.data.result.buy[0].Rate, exc, false).then((data) => {
                          console.log(`Trocar de ${dividend} por BTC`);
                        });
                      });
                    });
                  });
                })
              });
              //
              console.log(' ');
            } else {
              console.log(' ');
              console.log('Status: A primeira ordem do livro está inferior ao meu saldo');
              console.log('Moeda:', symbol)
              console.log('Ganho:', qntBidUSDTExc);
              console.log('Livro Exc:', this.formatNumber((bookExc.data.result.buy[0].Quantity * bookExc.data.result.buy[0].Rate), 8));
              console.log('Livro Bleutrade:', this.formatNumber((bookBleu.data.result.sell[0].Quantity * bookBleu.data.result.sell[0].Rate), 8));
              console.log(' ');
            }
          } else {
            console.log('['+ symbol +']:', qntBidUSDTExc);
          }
        });
      });
    });

    this.count += 1;
  }

  iniciar() {
    this.repetir(5000, 
      () => Promise.all([
        this.setup()
      ])
    )
  }
}

new Hades().iniciar();
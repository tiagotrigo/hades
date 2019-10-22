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
    this.fee_bt = 0.0040,
    this.fee_exc = 0.0025,
    this.entry = 0.00252383
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
      const saldoUSDTExc = data.data.result[0].Balance;
      // Saldo em USDT Bleu
      Bleutrade.getBalance('BTC').then((data) => {
        const saldoUSDTBleu = data.data.result[0].Balance;
        // Trocar USDT por outra moeda
        Bleutrade.getOrderBook(symbol, 'ALL', 5).then((bookBleu) => {
          const qntAskBleu = this.entry * 0.9975;
          const qntAskFee = this.formatNumber(qntAskBleu, 8) / bookBleu.data.result.sell[0].Rate;
          const qntAskBleu_float = this.formatNumber(qntAskFee, 8);

          // Vender moeda qualquer por USDT
          Exc.getOrderBook(symbol, 'ALL', 5).then((bookExc) => {
            const qntBidUSDTExc = (qntAskBleu_float * bookExc.data.result.buy[0].Rate) * (1 - 0.0025);
            // const profit = ((qntBidUSDTExc - this.entry) / this.entry) * 100;
            
            if (this.formatNumber(qntBidUSDTExc, 8) > this.entry) {
              if (bookBleu.data.result.sell[0].Quantity >= qntAskBleu_float) {
                //Transferir Exc para Bleu
                Exc.setDirectTransfer('BTC', saldoUSDTExc, 1, 'tiago.a.trigo@gmail.com').then((data) => {
                  console.log('Enviando BTC para Bleutrade');
                  // Comprar na Bleu
                  Bleutrade.setBuyLimit(symbol, bookBleu.data.result.sell[0].Rate, qntAskBleu_float, false).then((data) => {
                    console.log(`Troca de BTC por ${dividend}`);
                    // process.exit();
                    
                    Bleutrade.getBalance(dividend).then((data) => {
                      const balanceBleu = data.data.result[0].Balance;
                      // Transferir Bleu para Exc
                      Bleutrade.setDirectTransfer(dividend, balanceBleu, 2, 'tiago.a.trigo@gmail.com').then((data) => {
                        console.log(`Enviando ${dividend} para Exc`);
                        // Vender na Exc
                        Exc.getBalance(dividend).then((data) => {
                          const balanceExc = data.data.result[0].Balance;

                          Exc.setSellLimit(symbol, bookExc.data.result.buy[0].Rate, balanceExc, false).then((data) => {
                            console.log(`Trocar de ${dividend} por BTC`);
                            process.exit();
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
                console.log('A primeira ordem do livro está inferior ao meu saldo');
                console.log('Moeda:', symbol)
                console.log('Ganho:', this.formatNumber(qntBidUSDTExc, 8));
                console.log('Livro:', bookBleu.data.result.sell[0].Quantity);
                console.log(' ');
              }
            } else {
              console.log('['+ symbol +']:', this.formatNumber(qntBidUSDTExc, 8));
            }
          });
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
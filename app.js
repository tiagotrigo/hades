'use stricts';

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
    this.entry = 11.02485228
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

  setup() {
    if (this.count >= Coins.length) this.count = 0;

    const { 
      symbol,
      dividend
    } = Coins[this.count];

    // Saldo em USDT Exc
    Exc.getBalance('USDT').then((usdt) => {
      const saldoUSDTExc = usdt.data.result[0].Balance;
      // Saldo em USDT Bleu
      Bleutrade.getBalance('USDT').then((usdt) => {
        const saldoUSDTBleu = usdt.data.result[0].Balance;
        // Trocar USDT por outra moeda
        Bleutrade.getOrderBook(symbol, 'ALL', 5).then((bookBleu) => {
          const qntAskBleu = (this.entry / bookBleu.data.result.sell[0].Rate) * (1 + 0.0025);
          const qntAskBleu_int = parseInt((qntAskBleu * 100000000)) - 1;
          const qntAskBleu_float = qntAskBleu_int / 100000000;
          // Vender moeda qualquer por USDT
          Exc.getOrderBook(symbol, 'ALL', 5).then((bookExc) => {
            const qntBidUSDTExc = (qntAskBleu_float * bookExc.data.result.buy[0].Rate) * (1 - 0.0025);
            const profit = ((qntBidUSDTExc - this.entry) / this.entry) * 100;

            if (Math.sign(profit) === 1 && profit > 0.01) {
              if (bookBleu.data.result.sell[0].Quantity >= qntAskBleu_float) {
                console.log(' ');
                console.log(this.entry)
                console.log(qntBidUSDTExc)
                console.log(profit)
                process.exit();
                // Transferir Exc para Bleu
                // Exc.setDirectTransfer('USDT', saldoUSDTExc, 1, 'tiago.a.trigo@gmail.com').then((data) => {
                //   console.log('Enviando USDT para Bleutrade');
                //   // Comprar na Bleu
                //   Bleutrade.setBuyLimit(symbol, bookBleu.data.result.sell[0].Rate, qntAskBleu_float, false).then((data) => {
                //     console.log(`Troca de USDT por ${dividend}`);
                    
                //     Bleutrade.getBalance(dividend).then((data) => {
                //       const balanceBleu = data.data.result[0].Balance;
                //       // Transferir Bleu para Exc
                //       Bleutrade.setDirectTransfer(dividend, balanceBleu, 2, 'tiago.a.trigo@gmail.com').then((data) => {
                //         console.log(`Enviando ${dividend} para Exc`);
                //         // Vender na Exc
                //         Exc.getBalance(dividend).then((data) => {
                //           const balanceExc = data.data.result[0].Balance;

                //           Exc.setSellLimit(symbol, bookExc.data.result.buy[0].Rate, balanceExc, false).then((data) => {
                //             console.log(`Trocar de ${dividend} por USDT`);
                //             process.exit();
                //           });
                //         });
                //       });
                //     });
                //   });
                // });
                //
                console.log(' ');
              } else {
                console.log(' ');
                console.log('A primeira ordem do livro está inferior ao meu saldo');
                console.log('Livro de Ofertas:', bookBleu.data.result.sell[0].Quantity);
                console.log('Minha Balança:', qntAskBleu_float);
                console.log(' ');
              }
            } else {
              console.log('['+ symbol +']:', profit);
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
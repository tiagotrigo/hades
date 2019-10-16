'use stricts';

const Exc = require('./exc.js');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');
const Coins = require('./coins.js');

class Hades {
  
  constructor() {
    this.fee_bl = 0.0025,
    this.fee_bt = 0.0040,
    this.fee_exc = 0.0025,
    this.count = 0
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
        // Trocar USDT por LTC
        Bleutrade.getOrderBook(symbol, 'ALL', 5).then((bookLTCBleu) => {
          const qntAskLTCBleu = (10 / bookLTCBleu.data.result.sell[0].Rate) * (1 - 0.0025);
          const qntAskLTCBleu_int = parseInt((qntAskLTCBleu * 100000000)) - 1;
          const qntAskLTCBleu_float = qntAskLTCBleu_int / 100000000;
          // Vender LTC por USDT
          Exc.getOrderBook(symbol, 'ALL', 5).then((bookLTCExc) => {
            const qntBidUSDTExc = (qntAskLTCBleu_float * bookLTCExc.data.result.buy[0].Rate) * (1 - 0.0025);
            const profit = ((qntBidUSDTExc - 10) / 10) * 100;

            if (Math.sign(profit) === 1 && profit > 0.01) {
              console.log(' ');
              console.log('['+ symbol +']:', profit, 'OK');
              console.log(' ');
            } else {
              console.log('['+ symbol +']:', profit);
            }
            // // Transferir USDT para Bleu
            // Exc.setDirectTransfer('USDT', saldoUSDTExc, 1, 'tiago.a.trigo@gmail.com').then((data) => {
            //   console.log('Enviando USDT para Bleutrade');
            //   // Comprar na Bleu
            //   Bleutrade.setBuyLimit(symbol, bookLTCBleu.data.result.sell[0].Rate, qntAskLTCBleu_float, false).then((data) => {
            //     console.log(`Troca de USDT por ${dividend}`);
            //     // Transferir para Exc
            //     Bleutrade.getBalance(dividend).then((data) => {
            //       const balance = data.data.result[0].Balance;

            //       Exc.setDirectTransfer(dividend, balance, 2, 'tiago.a.trigo@gmail.com').then((data) => {
            //         console.log(`Enviando ${dividend} para Exc`);

            //         // Vender na Exc
            //         Exc.getBalance(dividend).then((data) => {
            //           const balance = data.data.result[0].Balance;

            //           Bleutrade.setSellLimit(symbol, bookLTCExc.data.result.buy[0].Rate, qntBidUSDTExc, false).then((data) => {
            //             console.log(`Trocar de ${dividend} por USDT`);
            //           });
            //         });
            //       });
            //     });
            //   });
            // });
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
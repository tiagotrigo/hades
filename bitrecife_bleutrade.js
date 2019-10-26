'use stricts';

const R = require('ramda');
const Bitrecife = require('./bitrecife.js');
const Bleutrade = require('./bleutrade.js');

class Hades {
  
  constructor() {
    this.count = 0,
    this.fee_bl = 0.0025,
    this.fee_bt = 0.004
    this.entry = 15.00,
    this.min = 15.00,
    this.email = 'tiago.a.trigo@gmail.com',
    this.coins = [
      {
        symbol: 'BTC_BRL', 
        market: 'BRL'
      },
      {
        symbol: 'BTC_USDT', 
        market: 'USDT'     
      }
    ]
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

  // Bitrecife
  exchangeA() {
    // Saldo
    Bitrecife.getBalance('BRL').then((data) => {
      // Salvando o saldo
      this.entry = 50.00;
      // Compra
      Bitrecife.getOrderBook('BTC_BRL', 'ALL', 3).then((bookBitrecife) => {
        const qntFee = this.entry * 0.9960;
        const qntAsk = this.formatNumber(qntFee, 8) / bookBitrecife.sell[0].Rate;
        const qnt = this.formatNumber(qntAsk, 8);
        // Venda
        Bleutrade.getOrderBook('BTC_USDT', 'ALL', 3).then((bookBleutrade) => {
          const qntBid = this.formatNumber((qnt * bookBleutrade.buy[0].Rate) * (1 - 0.0025), 8);
          // Venda
          Bitrecife.getOrderBook('USDT_BRL', 'ALL', 3).then((bookBitrecife) => {
            const qntBidUSDT = this.formatNumber((qntBid * bookBitrecife.buy[0].Rate) * (1 - 0.004), 8);

            if (qntBidUSDT > this.formatNumber(this.entry, 2)) {
              console.log('[USDT_BRL]:', this.formatNumber(qntBidUSDT, 8), 'OK')
            } else {
              console.log('[USDT_BRL]:', this.formatNumber(qntBidUSDT, 2))
            }
          });
        });
      });
    });
  }

  // Bleutrade
  exchangeB() {
    // Saldo
    Bitrecife.getBalance('BRL').then((data) => {
      // Salvando o saldo
      this.entry = 50.00;
      // Compra
      Bitrecife.getOrderBook('USDT_BRL', 'ALL', 3).then((bookBitrecife) => {
        const qntFee = this.entry * 0.9960;
        const qntAsk = this.formatNumber(qntFee, 8) / bookBitrecife.sell[0].Rate;
        const qnt = this.formatNumber(qntAsk, 8);
        // Compra
        Bleutrade.getOrderBook('BTC_USDT', 'ALL', 3).then((bookBleutrade) => {
          const qntFeeBTC = qnt * 0.9975;
          const qntAskBTC = this.formatNumber(qntFeeBTC, 8) / bookBleutrade.sell[0].Rate;
          const qntBTC = this.formatNumber(qntAskBTC, 8);
          // Venda
          Bitrecife.getOrderBook('BTC_BRL', 'ALL', 3).then((bookBitrecife) => {            
            const qntBid = this.formatNumber((qntBTC * bookBitrecife.buy[0].Rate) * (1 - 0.004), 8);

            if (qntBid > this.formatNumber(this.entry, 2)) {
              console.log('[BTC_BRL]:', this.formatNumber(qntBid, 8), 'OK')
              // Validando se é possível executar as ordens
              // if (bookBitrecife.sell[0].Quantity >= this.entry && bookBleutrade.sell[0].Quantity >= qnt && bookBitrecife.buy[0].Quantity >= qntBTC) {
              //   Bitrecife.getOpenOrders('USDT_BRL').then((data) => {
              //     if (data.data.result === null) {
              //       // Comprar
              //       Bitrecife.setBuyLimit('USDT_BRL', bookBitrecife.sell[0].Rate, qnt, false).then((data) => {
              //         console.log(`Troca de BRL por USDT`);
              //         // Transferir Bitrecife para Bleutrade
              //         Bitrecife.setDirectTransfer('USDT', qnt, 1, this.email).then((data) => {
              //           console.log(`Enviando USDT para Bleutrade`);
              //           // Comprar
              //           Bleutrade.setBuyLimit('BTC_USDT', bookBleutrade.buy[0].Rate, qntBTC, false).then((data) => {
              //             console.log(`Troca de USDT por BTC`);
              //             // Transferir Bleutrade para Bitrecife
              //             setTimeout(() => {
              //               Bleutrade.setDirectTransfer('BTC', qntBTC, 3, this.email).then((data) => {
              //                 console.log(`Enviando BTC para Bitrecife`);
              //                 // Venda
              //                 Bitrecife.setSellLimit('BTC_BRL', bookBitrecife.buy[0].Rate, qntBTC, false).then((data) => {
              //                   console.log(`Trocar de BTC por BRL`);                                
              //                 });
              //               });
              //             }, 400);
              //           });
              //         });
              //       })
              //     } else {
              //       console.log(`Moeda USDT_BRL está com ordem aberta`);
              //       console.log(' ');
              //     }
              //   });
              // } else {
              //   console.log(' ');
              //   console.log('Exchange: Bitrecife / Bleutrade');
              //   console.log('Status: Ordem inferior ao meu saldo');
              //   console.log('Moeda:', symbol)
              //   console.log('Ganho:', qntBid);
              //   console.log('Quantidade:', qntBTC);
              //   console.log('Livro Bitrecife:', this.formatNumber((bookBitrecife.buy[0].Quantity * bookBitrecife.buy[0].Rate), 8));
              //   console.log('Livro Bleutrade:', this.formatNumber((bookBleutrade.sell[0].Quantity * bookBleutrade.sell[0].Rate), 8));
              //   console.log(' ');
              // }
            } else {
              console.log('[BTC_BRL]:', this.formatNumber(qntBid, 2))
            }
          });
        });
      });
    });
  }

  setup() {
    if (this.count >= this.coins.length) this.count = 0;

    const { 
      symbol,
      market
    } = this.coins[this.count];

    if (market === 'USDT') {
      this.exchangeA();
    } else if (market === 'BRL') {
      this.exchangeB();
    }

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
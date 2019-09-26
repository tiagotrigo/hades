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
    this.fee_Bl = 0.0025,
    this.fee_Bt = 0.0040,
    this.dolar = 0.0,
    this.qnt_BRL = 0.0,
    this.qnt_BTC = 0.0,
    this.profit = 0.0,
    this.balance = 0.0
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

  async passoUm() {
    // Real
    const BT_BRL = await Bitrecife.getBalance('BRL');
    // Dólar
    const BT_USDT = await Bitrecife.getBalance('USDT');
    // Livro de ofertas
    const BT_BOOK_USDT_BRL = await Bitrecife.getOrderBook('USDT_BRL', 'ALL', 5);
    // Saldo em BRL
    if (BT_BRL && BT_BRL.data) {
      // Saldo em dólar
      if (BT_USDT && BT_USDT.data) {
        if (parseInt(BT_BRL.data.result[0].Balance) > 0) {
          // Livro de ofertas
          if (BT_BOOK_USDT_BRL && BT_BOOK_USDT_BRL.data) {
            // Calculando BRL por USDT
            this.dolar = this.calcular('/', this.entry, BT_BOOK_USDT_BRL.data.result.sell[0].Rate) * (1 - this.fee_Bt); 
            // Comprando USDT
            let buy = await Bitrecife.setBuyLimit('USDT_BRL', BT_BOOK_USDT_BRL.data.result.sell[0].Rate, this.dolar, false);
            // Transferindo para Bleutrade
            if (buy && buy.data) {
              // Validando a transferência
              let direct = await Bitrecife.setDirectTransfer('USDT', BT_USDT.data.result[0].Balance, 1, 'tiago.a.trigo@gmail.com');
              if (direct && direct.data) {
                return {
                  success: true,
                  message: 'Transferência para Bleutrade realizada com sucesso'
                }
              } else {
                return {
                  success: false,
                  message: 'Transferência para Bleutrade não foi realizada'
                }
              }
            } else {
              return {
                success: false,
                message: 'Erro! Compra de USDT não realizada'
              }
            }
          }
        } else {
          return {
            success: false,
            message: 'Saldo insuficiente!'
          }
        }
      } else {
        return {
          success: false,
          message: 'Erro! Problema para carregar o saldo em USDT'
        }
      }
    } else {
      return {
        success: false,
        message: 'Erro! Problema para carregar o saldo em BRL'
      }
    }
    return {
      success: true,
      message: 'Passo 1 realizado com sucesso'
    }
  }

  async passoDois() {
    // Dólar
    const BL_USDT = await Bleutrade.getBalance('USDT');
    // Bitcoin
    const BL_BTC = await Bleutrade.getBalance('BTC');
    // Ticker
    const BL_BTC_USDT = await Bleutrade.getTicker('BTC_USDT');
    // Saldo em dólar
    if (BL_USDT && BL_USDT.data) {
      // Saldo em bitcoin
      if (BL_BTC && BL_BTC.data) {
        if (parseInt(BL_USDT.data.result[0].Balance) > 0) {
          // Ticker BTC para USDT
          if (BL_BTC_USDT && BL_BTC_USDT.data) {
            // Calculando USDT para BTC
            this.qnt_BTC = this.calcular('/', BL_USDT.data.result[0].Balance, BL_BTC_USDT.data.result[0].Ask) * (1 - this.fee_Bl);
            this.qnt_BTC_fee = this.calcular('+', this.qnt_BTC, 0.00000001);
            // Vendendo USDT para BTC
            let sell = await Bleutrade.setBuyLimit('BTC_USDT', BL_BTC_USDT.data.result[0].Ask, this.qnt_BTC_fee, false);
            if (sell && sell.data) {
              console.log('Troca de USDT por BTC realizado com sucesso na Bleutrade');
            } else {
              return {
                success: false,
                message: 'Erro! Compra de BTC não realizada na Bleutrade'
              }
            }
          } else {
            return {
              success: false,
              message: 'Erro! Ticker'
            }
          }
        } else {
          return {
            success: false,
            message: 'Saldo insuficiente!'
          }  
        }
      } else {
        return {
          success: false,
          message: 'Erro! Problema para carregar o saldo em BTC'
        }
      }
    } else {
      return {
        success: false,
        message: 'Erro! Problema para carregar o saldo em USDT'
      }
    }
    return {
      success: true,
      message: 'Passo 2 realizado com sucesso'
    }
  }

  async passoTres() {
    // Bitcoin
    const BL_BTC = await Bleutrade.getBalance('BTC');
    const BT_BTC = await Bitrecife.getBalance('BTC');
    // Ticker
    const BT_BTC_BRL = await Bitrecife.getTicker('BTC_BRL');
    // Saldo em BTC
    if (BL_BTC && BL_BTC.data) {
      if (BT_BTC && BT_BTC.data) {
        // Tikcer de BTC para BRL
        if (BT_BTC_BRL && BT_BTC_BRL.data) {
            // Calculando BTC para BRL
            this.qnt_BRL = this.calcular('*', BL_BTC.data.result[0].Balance, BT_BTC_BRL.data.result[0].Bid) * (1 - this.fee_Bt);
            // Lucro
            this.profit = ((this.qnt_BRL - this.entry) * 100) / this.qnt_BRL;
            // Oportunidade
            if (Math.sign(this.profit) === 1 && this.profit >= 0.01) {
              // Venda
              let sell = await Bitrecife.setSellLimit('BTC_BRL', BT_BTC_BRL.data.result[0].Bid, BT_BTC.data.result[0].Balance, false);
              if (sell && sell.data) {
                console.log('Troca de BTC por BRL realizado com sucesso na Bitrecife');
              } else {
                return {
                  success: false,
                  message: 'Erro! Compra de BRL não realizada na Bitrecife'
                }
              } 
            } else {
              return {
                success: false,
                message: this.profit
              }
            }
        } else {
          return {
            success: false,
            message: 'Erro! Ticker'
          }
        }
      } else {
        return {
          success: false,
          message: 'Erro! Problema para carregar o saldo em BTC'
        } 
      }
    } else {
      return {
        success: false,
        message: 'Erro! Problema para carregar o saldo em BTC'
      }
    }
    return {
      success: true,
      message: 'Passo 3 realizado com sucesso'
    }
  }

  async iniciar() {
    const one = await this.passoUm();
    const two = await this.passoDois();
    const three = await this.passoTres();

    this.repetir(3000, () => {
      if (one && one.success) {
        console.log(' ');
        console.log(one.message);
        console.log(' ');
      } else if (two && two.success) {
        console.log(' ');
        console.log(two.message);
        console.log(' ');
      } else if (three && three.success) {
        console.log(' ');
        console.log(three.message);
        console.log(' ');
      } else {
        console.log(three.message);
      }
    })
  }
}

new Hades().iniciar();
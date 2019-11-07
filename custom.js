// if (z === 1) {
//   // Verificando o restante dos passos
//   // Se for Bleutrade
//   if (walk.exchangeto === 1) {
//     if (walk.action === 'sell') {
//       walk.price = await this.updateRate(walk, walks[0].quantity);

//       // 2 - Comprar ou vender
//       await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
//       console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
      
//       // 3 - Transfer caso precise
//       if (walk.transfer) {
//         await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
//         console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
//       }
//     } else {
//       walk.price = await this.updateRate(walk, walks[0].quantity);

//       // 2 - Comprar ou vender
//       await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
//       console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
      
//       // 3 - Transferir caso precise
//       if (walk.transfer) {
//         await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
//         console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
//       }
//     }
//   } else {
//     // Se o primeiro passo não for Bleutrade
//     // Ele precisa receber BTC ou USDT ? Se sim, enviar
//     if (walk.receive != null) {
//       if (walk.action === 'sell') {
//         await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.005, walk.receive.exchangeto, walk.receive.mail);
//         console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
        
//         walk.price = await this.updateRate(walk, walks[0].quantity);

//         // 2 - Comprar ou vender
//         await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
//         console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
        
//         // 3 - Transferir caso precise
//         if (walk.transfer) {
//           await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
//           console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
//         }
//       } else {
//         await Bleutrade.setDirectTransfer(walk.receive.asset, entry * 1.005, walk.receive.exchangeto, walk.receive.mail);
//         console.log(`Enviando ${walk.receive.asset} da Bleutrade para ${walk.exchangeto}`);
        
//         walk.price = await this.updateRate(walk, walks[0].quantity);

//         // 2 - Comprar ou vender
//         await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
//         console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
        
//         // 3 - Transferir caso precise
//         if (walk.transfer) {
//           await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
//           console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
//         }
//       }
//     } else {
//       // 2 - Comprar ou vender
//       if (walk.action === 'sell') {
//         walk.price = await this.updateRate(walk, walks[0].quantity);
        
//         // 2 - Comprar ou vender
//         await walk.exchange.setSellLimit(walk.market, walk.price, walks[0].quantity);
//         console.log(`Troca de ${walk.dividend} por ${walk.divisor}`);
        
//         // 3 - Transferir caso precise
//         if (walk.transfer) {
//           await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
//           console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
//         }
//       } else {
//         walk.price = await this.updateRate(walk, walks[0].quantity);

//         // 2 - Comprar ou vender
//         await walk.exchange.setBuyLimit(walk.market, walk.price, walks[0].quantity);
//         console.log(`Troca de ${walk.divisor} por ${walk.dividend}`);
        
//         // 3 - Transferir caso precise
//         if (walk.transfer) {
//           await walk.exchange.setDirectTransfer(walk.transfer.asset, walk.quantity, walk.transfer.exchangeto, walk.transfer.mail);
//           console.log(`Enviando ${walk.transfer.asset} para exchange ${walk.transfer.exchangeto}`);
//         }
//       }
//     }            
//   }
// }
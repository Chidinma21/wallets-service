// import { WalletService } from '../src/services/wallet.service.js';
// import { Wallet, sequelize } from '../src/database.js';
// import { Decimal } from 'decimal.js';

// describe('Wallet Service Integration', () => {
//   const walletService = new WalletService();

//   beforeEach(async () => {
//     // 1. Clear and Sync the database for a clean start
//     await sequelize.sync({ force: true });

//     // 2. Create test users with $100 balance
//     await Wallet.create({ userId: 'user_a', balance: '100.00' });
//     await Wallet.create({ userId: 'user_b', balance: '0.00' });
//   });

//   test('should prevent double spending on concurrent requests', async () => {
//     // Both requests try to send $100 at the SAME time
//     // Request 1 uses key-1, Request 2 uses key-2 (so both try to process)
//     const request1 = walletService.transfer('user_a', 'user_b', '100', 'key-1');
//     const request2 = walletService.transfer('user_a', 'user_b', '100', 'key-2');

//     const results = await Promise.allSettled([request1, request2]);
    
//     // Only ONE should succeed because user_a only has $100
//     const successes = results.filter(r => r.status === 'fulfilled');
    
//     expect(successes.length).toBe(1);

//     // Verify final balance is exactly 0 and not negative
//     const sender = await Wallet.findOne({ where: { userId: 'user_a' } });
//     expect(new Decimal(sender!.balance).toNumber()).toBe(0);
//   });
// });

import { WalletService } from '../src/services/wallet.service.js';
import { Wallet, sequelize } from '../src/database.js';
import { Decimal } from 'decimal.js';

describe('Wallet Service Integration', () => {
  const walletService = new WalletService();

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    await Wallet.create({ userId: 'user_a', balance: '100.00' });
    await Wallet.create({ userId: 'user_b', balance: '0.00' });
  });

  test('should prevent double spending on concurrent requests', async () => {
    const request1 = walletService.transfer('user_a', 'user_b', '100', 'key-1');
    
    await new Promise(res => setTimeout(res, 50));
    
    const request2 = walletService.transfer('user_a', 'user_b', '100', 'key-2');

    const results = await Promise.allSettled([request1, request2]);
    
    const successes = results.filter(r => r.status === 'fulfilled');
    expect(successes.length).toBe(1); 
  });
});
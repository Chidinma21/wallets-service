import { Wallet, TransactionLog, sequelize } from '../database.js';
import { Decimal } from 'decimal.js';

export class WalletService {
  async transfer(fromUserId: string, toUserId: string, amount: string, idempotencyKey: string) {
    const [log, created] = await TransactionLog.findOrCreate({
      where: { idempotencyKey },
      defaults: { status: 'PENDING' }
    });

    if (!created) {
      if (log.status === 'COMPLETED') return { status: 'success', message: 'Already processed' };
      throw new Error("Transaction in progress or failed");
    }

    const t = await sequelize.transaction();

    try {
      const sender = await Wallet.findOne({ where: { userId: fromUserId }, transaction: t, lock: t.LOCK.UPDATE });
      const receiver = await Wallet.findOne({ where: { userId: toUserId }, transaction: t, lock: t.LOCK.UPDATE });

      if (!sender || !receiver) throw new Error("Wallet not found");

      const amountToMove = new Decimal(amount);
      if (new Decimal(sender.balance).lt(amountToMove)) throw new Error("Insufficient funds");

      await sender.update({ balance: new Decimal(sender.balance).minus(amountToMove).toString() }, { transaction: t });
      await receiver.update({ balance: new Decimal(receiver.balance).plus(amountToMove).toString() }, { transaction: t });

      await log.update({ status: 'COMPLETED' }, { transaction: t });

      await t.commit();
      return { status: 'success' };
    } catch (error) {
      if (t) await t.rollback();
      await log.update({ status: 'FAILED' });
      throw error;
    }
  }
}
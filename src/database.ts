import { Sequelize, DataTypes, Model } from 'sequelize';

const isTest = process.env.NODE_ENV === 'test';

const sequelize = isTest 
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    })
  : new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/wallets_db', {
      logging: false,
    });

export class Wallet extends Model {
  declare userId: string;
  declare balance: string;
}

Wallet.init({
  userId: { type: DataTypes.STRING, unique: true, allowNull: false },
  balance: { type: DataTypes.DECIMAL(20, 4), defaultValue: "0.0000" }
}, { sequelize, modelName: 'Wallet' });

export class TransactionLog extends Model {
  declare idempotencyKey: string;
  declare status: 'PENDING' | 'COMPLETED' | 'FAILED';
  declare metadata: unknown;
}

TransactionLog.init({
  idempotencyKey: { type: DataTypes.STRING, unique: true, allowNull: false },
  status: { type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'), defaultValue: 'PENDING' },
  metadata: { type: DataTypes.JSONB }
}, { sequelize, modelName: 'TransactionLog' });

export { sequelize };
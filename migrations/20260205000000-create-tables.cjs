module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('Wallets', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: { type: Sequelize.STRING, allowNull: false, unique: true },
      balance: { type: Sequelize.DECIMAL(20, 4), defaultValue: 0.0000 }, 
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('TransactionLogs', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      idempotencyKey: { type: Sequelize.STRING, allowNull: false, unique: true },
      status: { type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED'), defaultValue: 'PENDING' },
      metadata: { type: Sequelize.JSONB },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('TransactionLogs');
    await queryInterface.dropTable('Wallets');
  }
};
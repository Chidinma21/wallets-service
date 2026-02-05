import express from 'express';
import { WalletService } from './services/wallet.service.js';
import { sequelize } from './database.js'; 

const app = express();
app.use(express.json());

app.post('/transfer', async (req: any, res: any) => {
  const { fromUserId, toUserId, amount, idempotencyKey } = req.body;
  
  const walletService = new WalletService(); 

  try {
    const result = await walletService.transfer(fromUserId, toUserId, amount, idempotencyKey);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    
    app.listen(3000, () => {
      console.log('🚀 API running on http://localhost:3000');
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();
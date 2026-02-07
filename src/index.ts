import express, { Request, Response } from 'express';
import { WalletService } from './services/wallet.service.js';
import { sequelize } from './database.js'; 

const app = express();
app.use(express.json());

app.post('/transfer', async (req: unknown, res: unknown) => {
  const request = req as Request;
  const response = res as Response;
  const { fromUserId, toUserId, amount, idempotencyKey } = request.body;

  const walletService = new WalletService(); 

  try {
    const result = await walletService.transfer(fromUserId, toUserId, amount, idempotencyKey);
    return response.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return response.status(400).json({ error: message });
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
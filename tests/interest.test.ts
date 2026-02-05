import { InterestService } from '../src/services/interest.service.js';

describe('Interest Service', () => {
  const service = new InterestService();

  test('Calculates correctly for standard year (365 days)', () => {
    const balance = '100000';
    const date = new Date('2025-01-01'); 
    const result = service.calculateDailyInterest(balance, date);
    
    expect(result).toBe('75.3425');
  });

  test('Calculates correctly for leap year (366 days)', () => {
    const balance = '100000';
    const date = new Date('2024-01-01');
    const result = service.calculateDailyInterest(balance, date);
    
    expect(result).toBe('75.1366');
  });
});
import { Decimal } from 'decimal.js';

export class InterestService {
  private readonly ANNUAL_RATE = new Decimal(0.275);

  calculateDailyInterest(balance: string, date: Date): string {
    const year = date.getFullYear();
    
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const daysInYear = isLeapYear ? 366 : 365;

    const principal = new Decimal(balance);
    
    const dailyInterest = principal.times(this.ANNUAL_RATE).dividedBy(daysInYear);

    return dailyInterest.toFixed(4);
  }
}
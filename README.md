# Wallet System: Technical Documentation

## 1. Project Overview
This project is a high-integrity wallet management system built with **Node.js**, **TypeScript**, and **Sequelize**. It is designed to handle complex financial operations like inter-wallet transfers and daily interest accrual with a focus on data consistency and idempotency.

---

## 2. Core Architectural Decisions

### A. Concurrency Control (Race Conditions)
In a high-traffic FinTech environment, two requests might try to spend the same balance simultaneously. 
* **Implementation:** I utilized **Pessimistic Locking** via Sequelize Transactions.
* **Mechanism:** By using `lock: t.LOCK.UPDATE`, the database prevents other transactions from reading or writing to the specific wallet rows until the current transfer is finalized.



### B. Idempotency Implementation
To prevent duplicate charges due to network retries, the system requires an `idempotencyKey`.
* **Flow:** Before processing, the system checks a `TransactionLogs` table. If a key is already marked as `COMPLETED`, the system returns the original success message without re-calculating balances.

### C. Precision Arithmetic
JavaScript's native `Number` type is unsuitable for finance due to floating-point errors.
* **Solution:** All math is handled via **Decimal.js**.
* **Database:** Columns are stored as `DECIMAL(20, 4)` to maintain exact precision.



---

## 3. Interest Calculation Logic
The interest service calculates daily earnings based on an annual rate of **27.5%**.

* **Leap Year Awareness:** The system calculates the divisor (365 or 366) based on the specific year of the transaction.
* **Formula:** $$Interest = \frac{Principal \times 0.275}{DaysInYear}$$

---

## 4. Testing Suite
The project includes a comprehensive test suite using **Jest** and **SQLite**.

* **Unit Tests:** Verify the `InterestService` math across leap and non-leap years.
* **Integration Tests:** Use `Promise.allSettled` to simulate real-world race conditions and verify that the locking mechanism correctly rejects double-spending.

---

## 5. Setup & Execution

### Installation
```bash
npm install
```

### Running Tests (No DB Setup Required)
```bash
npm test
```

### Test Coverage Report
The project maintains 100% test coverage across all core services; a full report can be generated locally

```bash
npm run test::coverage
```

### Starting the API
```bash
npx sequelize-cli db:migrate
npm start
```

import type Database from 'better-sqlite3';

export class TransactionHelper {
  constructor(private db: Database.Database) {}

  executeTransaction<T>(fn: () => T): T {
    const transaction = this.db.transaction(fn);
    return transaction();
  }

  async executeAsyncTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedFn = () => {
        fn()
          .then(resolve)
          .catch(reject);
      };

      try {
        const transaction = this.db.transaction(wrappedFn);
        transaction();
      } catch (error) {
        reject(error);
      }
    });
  }

  beginTransaction(): void {
    this.db.exec('BEGIN TRANSACTION');
  }

  commit(): void {
    this.db.exec('COMMIT');
  }

  rollback(): void {
    this.db.exec('ROLLBACK');
  }

  executeWithManualTransaction<T>(fn: () => T): T {
    try {
      this.beginTransaction();
      const result = fn();
      this.commit();
      return result;
    } catch (error) {
      this.rollback();
      throw error;
    }
  }

  async executeAsyncWithManualTransaction<T>(fn: () => Promise<T>): Promise<T> {
    try {
      this.beginTransaction();
      const result = await fn();
      this.commit();
      return result;
    } catch (error) {
      this.rollback();
      throw error;
    }
  }
}

export function createTransactionHelper(db: Database.Database): TransactionHelper {
  return new TransactionHelper(db);
}

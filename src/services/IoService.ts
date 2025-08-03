import { io } from '../index';
import { TransactionRepository } from '../repositories';

export class IoService {
  static async emitNewTransaction(): Promise<void> {
    const transactions = await TransactionRepository.findAll();
    io.emit('newTransaction', transactions);
  }

  static async emitTransaction(): Promise<void> {
    const transactions = await TransactionRepository.findAll();
    io.emit('transactions', transactions);
  }
}

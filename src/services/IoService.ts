import { io } from '../index';

export class IoService {
  static async emitNewTransaction(): Promise<void> {
    io.emit('newTransaction');
  }

  static async emitTransaction(): Promise<void> {
    io.emit('transactions');
  }
}

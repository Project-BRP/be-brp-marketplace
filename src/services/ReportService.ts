import type { IGetRevenueResponse } from '../dtos';
import { TransactionRepository } from '../repositories';
import { TimeUtils } from '../utils';

export class ReportService {
  static async getRevenue(): Promise<IGetRevenueResponse> {
    const now = TimeUtils.now();

    const currentMonthStartDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );
    const currentMonthEndDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    );
    const lastMonthStartDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastMonthEndDate = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthRevenue =
      await TransactionRepository.aggregateRevenueByDateRange(
        currentMonthStartDate,
        currentMonthEndDate,
      );

    const lastMonthRevenue =
      await TransactionRepository.aggregateRevenueByDateRange(
        lastMonthStartDate,
        lastMonthEndDate,
      );

    const gainPercentage =
      lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : currentMonthRevenue > 0
          ? 100
          : 0;

    return {
      totalRevenue: currentMonthRevenue,
      gainPercentage: parseFloat(gainPercentage.toFixed(2)),
    };
  }
}
